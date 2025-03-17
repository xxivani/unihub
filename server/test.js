const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'team77',
  password: process.env.POSTGRES_PASSWORD || 'team77',
  database: process.env.POSTGRES_DB || 'UniHub',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5433 // you can change this depending on what port ur pg server is using, to do that right click on postgres 17/16 and right click on properties and then click on connection to check ur port
});


async function testConnection() {
  let client;
  try {
    console.log('Attempting to connect to PostgreSQL database...');
    client = await pool.connect();

    const result = await client.query('SELECT NOW() as now');
    console.log('✅ Connection successful!');
    console.log(`Current database time: ${result.rows[0].now}`);
    
    const dbInfoQuery = await client.query('SELECT current_database() as db_name, current_user as user');
    console.log(`Connected to database: ${dbInfoQuery.rows[0].db_name}`);
    console.log(`Connected as user: ${dbInfoQuery.rows[0].user}`);

    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    if (tablesQuery.rows.length > 0) {
      console.log('\nAvailable tables:');
      tablesQuery.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('\nNo tables found in the database.');
    }
    
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  } finally {
    if (client) {
      client.release();
      console.log('Database connection closed.');
    }
    

    await pool.end();
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('All database tests completed successfully.');
    } else {
      console.log('Database tests failed. Please check your connection settings.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });