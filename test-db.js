require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing database connection...\n');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
