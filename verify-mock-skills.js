// Verify mock data has all 9 skills per field
const fs = require('fs');
const path = require('path');

// Read the mock data file
const mockDataPath = path.join(__dirname, 'lib', 'ayush-mock-data.ts');
const content = fs.readFileSync(mockDataPath, 'utf-8');

// Extract MOCK_FIELD_SKILLS section
const match = content.match(/export const MOCK_FIELD_SKILLS[^=]*=\s*{([^}]+(?:}[^}]+)*?)};/s);

if (!match) {
  console.log('❌ Could not parse MOCK_FIELD_SKILLS');
  process.exit(1);
}

// Count skills per field
const fieldPattern = /'(ayush-field-\d+)':\s*\[([^\]]+)\]/g;
let fieldMatch;
const results = [];

while ((fieldMatch = fieldPattern.exec(match[1])) !== null) {
  const fieldId = fieldMatch[1];
  const skillsContent = fieldMatch[2];
  const skillCount = (skillsContent.match(/{\s*id:/g) || []).length;
  results.push({ fieldId, skillCount });
}

console.log('📊 Mock Data Skill Counts:\n');
console.log('Field ID          | Skill Count | Status');
console.log('------------------|-------------|--------');

let allCorrect = true;
results.forEach(({ fieldId, skillCount }) => {
  const expected = 9;
  const status = skillCount === expected ? '✅' : '❌';
  if (skillCount !== expected) allCorrect = false;
  console.log(`${fieldId.padEnd(17)} | ${skillCount.toString().padEnd(11)} | ${status}`);
});

console.log('\n' + '='.repeat(50));
console.log(`Total AYUSH fields checked: ${results.length}`);
console.log(`Expected per field: 9 skills`);
console.log(`Status: ${allCorrect ? '✅ ALL CORRECT' : '❌ SOME FIELDS HAVE WRONG COUNT'}`);

if (!allCorrect) {
  console.log('\n⚠️  Some fields do not have 9 skills!');
  console.log('This may be why you see <9 skills in the UI.');
  process.exit(1);
}

console.log('\n✅ All AYUSH fields have exactly 9 skills in mock data!');
console.log('If you still see <9 skills in UI:');
console.log('1. Restart your dev server: npm run dev');
console.log('2. Hard refresh browser: Ctrl+Shift+R');
console.log('3. Check browser console for errors');
