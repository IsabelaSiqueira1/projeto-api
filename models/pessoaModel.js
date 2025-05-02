import { pool } from '../config/db.js';

export async function getAllPessoas() {
    try {
        const result = await pool.query('SELECT * FROM pessoas');
        return result.rows; 
    } catch (error) {
        console.error('Erro ao buscar pessoas no banco', error);
        throw error;  
    }
}

export async function getPessoa(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id]);
        return result.rows[0]; 
    } finally {
        client.release();
    }
}

export async function insertPessoa(pessoa) {
    const client = await pool.connect();
    try {
        const { nome, idade } = pessoa;
        const result = await client.query('INSERT INTO Pessoa (nome, idade) VALUES ($1, $2) RETURNING *', [nome, idade]);
        return result.rows[0]; 
    } finally {
        client.release();
    }
}

export async function updatePessoa(id, pessoa) {
    const client = await pool.connect();
    try {
        const { nome, idade } = pessoa;
        const result = await client.query('UPDATE Pessoa SET nome = $1, idade = $2 WHERE id = $3 RETURNING *', [nome, idade, id]);
        return result.rowCount > 0; 
    } finally {
        client.release();
    }
}

export async function deletePessoa(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM Pessoa WHERE id = $1', [id]);
        return result.rowCount > 0; 
    } finally {
        client.release();
    }
}
