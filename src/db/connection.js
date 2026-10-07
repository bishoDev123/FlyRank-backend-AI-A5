// const Database = require('better-sqlite3');

// const db = new Database('tasks.db');

// db.exec(`
//     CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         done BOOLEAN NOT NULL DEFAULT 0
//     )
// `);

// function seedIfEmpty() {
//     const seedCount = db.prepare(`SELECT COUNT(*) AS count FROM tasks`).get().count;

//     if (seedCount === 0) {
//         const insert = db.prepare(`INSERT INTO tasks (title, done) VALUES (?, ?)`);
//         insert.run("walk the dog", 0);
//         insert.run("take out the trash", 0);
//         insert.run("take a shower", 1);
//     }

//     return seedCount;
// }

// module.exports = {
//     db,
//     seedIfEmpty
// };

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function init() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT false
        )    
    `);
}

async function seedIfEmpty() {
    const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM tasks`);
    const seedCount = parseInt(rows[0].count, 10);

    if (seedCount === 0) {
        const insert = `INSERT INTO tasks (title, done) VALUES ($1, $2)`;
        await pool.query(insert, ["walk the dog", false]);
        await pool.query(insert, ["Take out the trash", false]);
        await pool.query(insert, ["Take a shower", true]);
    }

    return seedCount;
}

module.exports = { pool, init, seedIfEmpty };