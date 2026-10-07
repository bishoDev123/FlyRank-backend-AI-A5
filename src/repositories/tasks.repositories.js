const { pool } = require('../db/connection');

async function findAll({ search, status } = {}) {
    let query = "SELECT * FROM tasks";
    const conditions = [];
    const params = [];

    if (search) {
        params.push(`%${search}%`);
        conditions.push(`title ILIKE $${params.length}`);
    }
    if (status !== undefined) {
        params.push(status);
        conditions.push(`done = $${params.length}`);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    const { rows } = await pool.query(query, params);
    return rows;
}

async function findById(id) {
    const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return rows[0];
}

async function insert(title) {
    const { rows } = await pool.query("INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *", [title, false]);
    return rows[0];
}

async function update(id, title, done) {
    const { rows } = await pool.query("UPDATE tasks SET title = $1, done = $2 WHERE id = $3", [title, done, id]);
    return rows[0];
}

async function remove(id) {
    const { rows } = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return rows[0];
}

module.exports = {
    findAll,
    findById,
    insert,
    update,
    remove
};