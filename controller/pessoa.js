import pool from "../config.js";
import { redisClient } from "../app.js"

export async function resetSequence() {
  try {
    const client = await pool.connect()
    await client.query(`
      SELECT setval('pessoa_id_seq', (SELECT MAX(id) FROM Pessoa))
    `)
    client.release()
  } catch (err) {
    console.error('Erro ao ajustar a sequência:', err)
  }
}

export async function createTable() {
  try {
    const client = await pool.connect()
    await client.query(`
      CREATE TABLE IF NOT EXISTS Pessoa (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        idade INT,
        cargo VARCHAR(50)
      )
    `)
    console.log('Tabela Pessoa já existe')
    client.release()
  } catch (err) {
    console.error('Erro ao criar tabela Pessoa:', err)
  }
}

export async function getPessoas(req, res) {
  try {
    const cacheKey = 'pessoas'
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      console.log("redis")
      return res.json(JSON.parse(cachedData))
    }

    console.log("db")
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM Pessoa')
    client.release()

    await redisClient.set(cacheKey, JSON.stringify(result.rows))
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pessoas' })
  }
}

export async function getPessoa(req, res) {
  const id = req.params.id
  const cacheKey = `pessoa:${id}`

  try {
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      console.log('redis')
      return res.json(JSON.parse(cachedData))
    }
    console.log("db")
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id])
    client.release()

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' })
    }

    await redisClient.set(cacheKey, JSON.stringify(result.rows[0]))
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pessoa' })
  }
}

export async function insertPessoa(req, res) {
  const { nome, idade, cargo } = req.body
  try {
    const client = await pool.connect()
    
    await client.query('INSERT INTO Pessoa (nome, idade, cargo) VALUES ($1, $2, $3)', [nome, idade, cargo])

    await resetSequence()
    await redisClient.del('pessoas')
    
    res.json({ statusCode: 200 })
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao inserir pessoa' })
  }
}

export async function updatePessoa(req, res) {
  const { id, nome, idade, cargo } = req.body
  try {
    const client = await pool.connect()
    await client.query('UPDATE Pessoa SET nome = $1, idade = $2, cargo = $3 WHERE id = $4', [nome, idade, cargo, id])

    await redisClient.del('pessoas')

    res.json({ statusCode: 200 })
    client.release()
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar pessoa' })
  }
}

export async function deletePessoa(req, res) {
  const id = req.params.id
  try {
    const client = await pool.connect();
    
    const result = await client.query('DELETE FROM Pessoa WHERE id = $1', [id])
    client.release()

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' })
    }

    await redisClient.del('pessoas')

    res.json({ statusCode: 200, message: 'Pessoa deletada com sucesso!' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar pessoa' })
  }
}

export async function createUserTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS Usuario (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      );
    `);
    client.release();
  } catch (err) {
    console.error('Erro ao criar tabela Usuario:', err)
  }
}

export async function getUserByUsername(username) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Usuario WHERE username = $1', [username])
    client.release()
    return result.rows[0]
  } catch (err) {
    console.error('Erro ao buscar usuário:', err)
  }
}

export async function insertUser(username, hashedPassword) {
  try {
    const client = await pool.connect()
    await client.query('INSERT INTO Usuario (username, password) VALUES ($1, $2)', [username, hashedPassword])
    client.release()
  } catch (err) {
    console.error('Erro ao inserir usuário:', err)
  }
}
