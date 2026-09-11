/**
 * Hybrid Skill Matching Engine
 * 
 * Combines exact matching with semantic similarity for robust skill matching.
 * 
 * LAYER 1 - EXACT MATCH (~80% weight):
 * - Matches skills by exact skillId
 * - Scores based on proficiency ratio: min(studentProf / requiredProf, 1.0)
 * 
 * LAYER 2 - SEMANTIC SIMILARITY (~20% weight):
 * - For unmatched required skills, computes embedding similarity
 * - Uses sentence-transformers (all-MiniLM-L6-v2) for semantic understanding
 * - Catches variants like "ReactJS" vs "React", "ML" vs "Machine Learning"
 * - Threshold: 0.75+ similarity for partial match
 * 
 * FINAL SCORE:
 * - Weighted average across all required skills
 * - Each skill contributes: exact match score OR semantic fallback score OR 0
 */

import { pipeline } from '@xenova/transformers';

// Force WebAssembly backend (avoids native binding issues on Windows)
if (typeof window === 'undefined') {
  // Server-side: use WASM backend
  process.env.ONNX_WEB_USE_WASM = 'true';
}

// Lazy-load the embedding model (loaded only once on first use)
let embeddingPipeline: any = null;

async function getEmbeddingModel() {
  if (!embeddingPipeline) {
    console.log('🤖 Loading sentence-transformer model (one-time load)...');
    embeddingPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    console.log('✅ Model loaded successfully');
  }
  return embeddingPipeline;
}

/**
 * Compute embedding vector for a text string
 */
async function computeEmbedding(text: string): Promise<number[]> {
  const model = await getEmbeddingModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Compute cosine similarity between two embedding vectors
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// ===== TYPES =====

export interface StudentSkill {
  skillId: string;
  skillName: string;
  proficiencyLevel: number;
}

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  minProficiency: number;
}

export interface ExactMatchDetail {
  type: 'exact';
  requiredSkillName: string;
  studentSkillName: string;
  studentProficiency: number;
  requiredProficiency: number;
  proficiencyRatio: number; // 0-1
  credit: number; // Contribution to final score
}

export interface SemanticMatchDetail {
  type: 'semantic';
  requiredSkillName: string;
  matchedStudentSkillName: string;
  similarityScore: number; // 0-1
  studentProficiency: number;
  requiredProficiency: number;
  credit: number; // Contribution to final score
}

export interface GapSkillDetail {
  type: 'gap';
  requiredSkillName: string;
  requiredProficiency: number;
  credit: number; // Always 0
}

export type MatchDetail = ExactMatchDetail | SemanticMatchDetail | GapSkillDetail;

export interface HybridMatchResult {
  overallScore: number; // 0-100 percentage
  exactMatches: ExactMatchDetail[];
  semanticMatches: SemanticMatchDetail[];
  gapSkills: GapSkillDetail[];
  breakdown: {
    exactMatchCount: number;
    semanticMatchCount: number;
    gapCount: number;
    totalRequired: number;
  };
}

// ===== WEIGHTS =====
const EXACT_MATCH_WEIGHT = 0.8; // 80%
const SEMANTIC_MATCH_WEIGHT = 0.2; // 20%
const SEMANTIC_THRESHOLD = 0.75; // Minimum similarity to count as match

/**
 * Main hybrid matching function
 */
export async function calculateHybridMatch(
  studentSkills: StudentSkill[],
  requiredSkills: RequiredSkill[]
): Promise<HybridMatchResult> {
  // Edge case: no required skills
  if (requiredSkills.length === 0) {
    return {
      overallScore: 0,
      exactMatches: [],
      semanticMatches: [],
      gapSkills: [],
      breakdown: {
        exactMatchCount: 0,
        semanticMatchCount: 0,
        gapCount: 0,
        totalRequired: 0,
      },
    };
  }

  // Edge case: student has no skills
  if (studentSkills.length === 0) {
    const gapSkills: GapSkillDetail[] = requiredSkills.map(rs => ({
      type: 'gap',
      requiredSkillName: rs.skillName,
      requiredProficiency: rs.minProficiency,
      credit: 0,
    }));
    
    return {
      overallScore: 0,
      exactMatches: [],
      semanticMatches: [],
      gapSkills,
      breakdown: {
        exactMatchCount: 0,
        semanticMatchCount: 0,
        gapCount: requiredSkills.length,
        totalRequired: requiredSkills.length,
      },
    };
  }

  const exactMatches: ExactMatchDetail[] = [];
  const semanticMatches: SemanticMatchDetail[] = [];
  const gapSkills: GapSkillDetail[] = [];

  // Create quick lookup map for student skills by ID
  const studentSkillMap = new Map(
    studentSkills.map(s => [s.skillId, s])
  );

  // Track which required skills were matched exactly
  const unmatchedRequiredSkills: RequiredSkill[] = [];

  // LAYER 1: EXACT MATCHING
  for (const required of requiredSkills) {
    const studentSkill = studentSkillMap.get(required.skillId);

    if (studentSkill) {
      // Exact match found!
      const proficiencyRatio = Math.min(
        studentSkill.proficiencyLevel / required.minProficiency,
        1.0
      );

      // Credit is weighted by how well they meet the requirement
      const credit = EXACT_MATCH_WEIGHT * proficiencyRatio;

      exactMatches.push({
        type: 'exact',
        requiredSkillName: required.skillName,
        studentSkillName: studentSkill.skillName,
        studentProficiency: studentSkill.proficiencyLevel,
        requiredProficiency: required.minProficiency,
        proficiencyRatio,
        credit,
      });
    } else {
      // No exact match - will try semantic matching
      unmatchedRequiredSkills.push(required);
    }
  }

  // LAYER 2: SEMANTIC MATCHING (for unmatched required skills)
  if (unmatchedRequiredSkills.length > 0) {
    // Compute embeddings for all required unmatched skills
    const requiredEmbeddings = await Promise.all(
      unmatchedRequiredSkills.map(rs => computeEmbedding(rs.skillName))
    );

    // Compute embeddings for all student skills
    const studentEmbeddings = await Promise.all(
      studentSkills.map(ss => computeEmbedding(ss.skillName))
    );

    // For each unmatched required skill, find best semantic match
    for (let i = 0; i < unmatchedRequiredSkills.length; i++) {
      const required = unmatchedRequiredSkills[i];
      const requiredEmb = requiredEmbeddings[i];

      let bestMatch: {
        studentSkill: StudentSkill;
        similarity: number;
      } | null = null;

      // Find student skill with highest similarity
      for (let j = 0; j < studentSkills.length; j++) {
        const studentSkill = studentSkills[j];
        const studentEmb = studentEmbeddings[j];

        const similarity = cosineSimilarity(requiredEmb, studentEmb);

        if (similarity >= SEMANTIC_THRESHOLD) {
          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = {
              studentSkill,
              similarity,
            };
          }
        }
      }

      if (bestMatch) {
        // Semantic match found!
        const proficiencyRatio = Math.min(
          bestMatch.studentSkill.proficiencyLevel / required.minProficiency,
          1.0
        );

        // Credit is weighted by similarity AND proficiency
        const credit =
          SEMANTIC_MATCH_WEIGHT *
          bestMatch.similarity *
          proficiencyRatio;

        semanticMatches.push({
          type: 'semantic',
          requiredSkillName: required.skillName,
          matchedStudentSkillName: bestMatch.studentSkill.skillName,
          similarityScore: bestMatch.similarity,
          studentProficiency: bestMatch.studentSkill.proficiencyLevel,
          requiredProficiency: required.minProficiency,
          credit,
        });
      } else {
        // No match found - it's a gap
        gapSkills.push({
          type: 'gap',
          requiredSkillName: required.skillName,
          requiredProficiency: required.minProficiency,
          credit: 0,
        });
      }
    }
  }

  // FINAL SCORE CALCULATION
  const totalCredit =
    exactMatches.reduce((sum, m) => sum + m.credit, 0) +
    semanticMatches.reduce((sum, m) => sum + m.credit, 0);

  // Normalize to 0-100 scale
  // Maximum possible credit per skill:
  // - Exact match: 0.8 (if proficiency ratio = 1.0)
  // - Semantic match: 0.2 (if similarity = 1.0 and proficiency ratio = 1.0)
  // Average max credit per skill: 0.8 (since exact match is primary path)
  const maxPossibleCredit = requiredSkills.length * 0.8;
  const overallScore = Math.min((totalCredit / maxPossibleCredit) * 100, 100);

  return {
    overallScore: Math.round(overallScore),
    exactMatches,
    semanticMatches,
    gapSkills,
    breakdown: {
      exactMatchCount: exactMatches.length,
      semanticMatchCount: semanticMatches.length,
      gapCount: gapSkills.length,
      totalRequired: requiredSkills.length,
    },
  };
}

/**
 * Synchronous fallback matching (when semantic matching fails or is disabled)
 * Uses the original exact-match-only algorithm
 */
export function calculateSimpleMatch(
  studentSkills: StudentSkill[],
  requiredSkills: RequiredSkill[]
): HybridMatchResult {
  if (requiredSkills.length === 0) {
    return {
      overallScore: 0,
      exactMatches: [],
      semanticMatches: [],
      gapSkills: [],
      breakdown: {
        exactMatchCount: 0,
        semanticMatchCount: 0,
        gapCount: 0,
        totalRequired: 0,
      },
    };
  }

  const studentSkillMap = new Map(studentSkills.map(s => [s.skillId, s]));
  const exactMatches: ExactMatchDetail[] = [];
  const gapSkills: GapSkillDetail[] = [];

  for (const required of requiredSkills) {
    const studentSkill = studentSkillMap.get(required.skillId);

    if (studentSkill) {
      const proficiencyRatio = Math.min(
        studentSkill.proficiencyLevel / required.minProficiency,
        1.0
      );

      exactMatches.push({
        type: 'exact',
        requiredSkillName: required.skillName,
        studentSkillName: studentSkill.skillName,
        studentProficiency: studentSkill.proficiencyLevel,
        requiredProficiency: required.minProficiency,
        proficiencyRatio,
        credit: proficiencyRatio,
      });
    } else {
      gapSkills.push({
        type: 'gap',
        requiredSkillName: required.skillName,
        requiredProficiency: required.minProficiency,
        credit: 0,
      });
    }
  }

  const totalCredit = exactMatches.reduce((sum, m) => sum + m.credit, 0);
  const overallScore = (totalCredit / requiredSkills.length) * 100;

  return {
    overallScore: Math.round(overallScore),
    exactMatches,
    semanticMatches: [],
    gapSkills,
    breakdown: {
      exactMatchCount: exactMatches.length,
      semanticMatchCount: 0,
      gapCount: gapSkills.length,
      totalRequired: requiredSkills.length,
    },
  };
}
