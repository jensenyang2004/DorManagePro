const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
// const { user } = require('./schema')
// const fs = require('fs'); // 引入 Node.js 文件系統模組
require('dotenv').config(); // 加載 .env 文件


const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


let db; // Define a variable to hold the Drizzle instance

// Async function to initialize the database
async function initializeDatabase() {
  try {
    await pool.connect(); // Ensure the pool connects first
    console.log('Connected to the database');

    // Initialize Drizzle ORM after connection
    db = drizzle(pool);
    console.log('Drizzle ORM initialized');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1); // Exit the process if DB initialization fails
  }
}

// Call the initialization function
initializeDatabase();

// Export a function to get the db instance after it's initialized
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Please wait for initialization to complete.');
  }
  return db;
}

module.exports = { getDb, pool, db };