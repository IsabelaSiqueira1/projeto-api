import pool from '../config/postgres.js';

export const getAllUsuarios = async () => {
    const query = 'SELECT * FROM usuarios';
    const { rows } = await pool.query(query);
    return rows;
};

export const getUsuarioById = async (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const createUsuario = async (usuario) => {
    const { nome, email, senha } = usuario;
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [nome, email, senha]);
    return rows[0];
};

export const updateUsuario = async (id, usuario) => {
    const { nome, email, senha } = usuario;
    const query = `
        UPDATE usuarios 
        SET nome = $1, email = $2, senha = $3 
        WHERE id = $4
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [nome, email, senha, id]);
    return rows[0];
};

export const deleteUsuario = async (id) => {
    const query = 'DELETE FROM usuarios WHERE id = $1';
    await pool.query(query, [id]);
};
