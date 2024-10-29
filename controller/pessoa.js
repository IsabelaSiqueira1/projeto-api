import pool from "../config.js";
import { redisClient } from "../app.js";

export async function resetSequence() {
  try {
    const client = await pool.connect();
    await client.query(`
      SELECT setval('pessoa_id_seq', COALESCE((SELECT MAX(id) FROM Pessoa), 1));
    `);
    client.release();
  } catch (err) {
    console.error('Erro ao ajustar a sequência:', err);
  }
}

export async function createTable() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS Pessoa (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        idade INT,
        cargo VARCHAR(50)
      )
    `);
    console.log('Tabela Pessoa já existe');
    client.release();
  } catch (err) {
    console.error('Erro ao criar tabela Pessoa:', err);
  }
}

export async function getPessoas(req, res) {
  try {
    const cacheKey = 'pessoas';
    let cachedData;

    // Tentar buscar os dados do Redis
    try {
      cachedData = await redisClient.get(cacheKey);
    } catch (err) {
      console.error('Erro ao tentar acessar o Redis:', err);
    }

    if (cachedData) {
      console.log("redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("db");
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Pessoa');
    client.release();

    // Definir cache com expiração (TTL) no Redis
    try {
      await redisClient.set(cacheKey, JSON.stringify(result.rows), { EX: 300 }); // 5 minutos
    } catch (err) {
      console.error('Erro ao tentar definir o cache no Redis:', err);
    }

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
}

export async function getPessoa(req, res) {
  const id = req.params.id;
  const cacheKey = `pessoa:${id}`;
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('redis');
      return res.status(200).json(JSON.parse(cachedData));
    }
    
    console.log("db");
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      // Armazena a resposta negativa no cache
      await redisClient.set(cacheKey, JSON.stringify({ error: 'Pessoa não encontrada' }), { EX: 300 }); // Cache por 5 minutos
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Armazena a pessoa encontrada no cache
    await redisClient.set(cacheKey, JSON.stringify(result.rows[0]));
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar pessoa:', err);
    res.status(500).json({ error: 'Erro ao buscar pessoa' });
  }
}

export async function insertPessoa(req, res) {
  const { nome, idade, cargo } = req.body;
  let client;

  try {
    client = await pool.connect();
    await client.query('INSERT INTO Pessoa (nome, idade, cargo) VALUES ($1, $2, $3)', [nome, idade, cargo]);

    // Redefine a sequência após a inserção
    await resetSequence();

    // Atualiza o cache com a nova lista de pessoas
    const allPessoas = await pool.query('SELECT * FROM Pessoa');
    await redisClient.set('pessoas', JSON.stringify(allPessoas.rows), { EX: 300 }); // 5 minutos

    res.status(201).json({ message: 'Pessoa criada com sucesso!' });
  } catch (err) {
    console.error('Erro ao inserir pessoa:', err);
    res.status(500).json({ error: 'Erro ao inserir pessoa' });
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function updatePessoa(req, res) {
  const { id, nome, idade, cargo } = req.body;
  let client;

  try {
    client = await pool.connect(); // Conecta ao banco

    // Verifica se a pessoa existe antes de atualizar
    const pessoaResult = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id]);
    
    if (pessoaResult.rows.length === 0) {
      // Se a pessoa não for encontrada, libera o cliente e retorna o erro
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Atualiza a pessoa no banco de dados
    await client.query('UPDATE Pessoa SET nome = $1, idade = $2, cargo = $3 WHERE id = $4', [nome, idade, cargo, id]);

    // Busca a pessoa atualizada no banco de dados
    const result = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      // Atualiza o cache da pessoa específica
      try {
        await redisClient.set(`pessoa:${id}`, JSON.stringify(result.rows[0]), { EX: 300 });
      } catch (err) {
        console.error('Erro ao tentar definir o cache no Redis:', err);
      }
    }

    // Atualiza o cache "pessoas" com a nova lista do banco
    const allPessoas = await client.query('SELECT * FROM Pessoa');
    try {
      await redisClient.set('pessoas', JSON.stringify(allPessoas.rows), { EX: 300 }); // 5 minutos
    } catch (err) {
      console.error('Erro ao tentar definir o cache no Redis:', err);
    }

    res.status(200).json({ message: 'Pessoa atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar pessoa' });
  } finally {
    // Certifica-se de liberar o cliente apenas uma vez, evitando múltiplas liberações
    if (client) {
      client.release();
    }
  }
}

export async function deletePessoa(req, res) {
  const id = req.params.id;
  let client;

  try {
    client = await pool.connect();
    
    // Consulta a pessoa antes de deletar
    const result = await client.query('SELECT * FROM Pessoa WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Salva os detalhes da pessoa que será deletada
    const pessoaDeletada = result.rows[0];

    // Deleta a pessoa
    await client.query('DELETE FROM Pessoa WHERE id = $1', [id]);

    // Redefine a sequência após a deleção
    await resetSequence();

    // Atualiza o cache "pessoas" com a nova lista do banco
    const allPessoas = await pool.query('SELECT * FROM Pessoa');
    try {
      await redisClient.set('pessoas', JSON.stringify(allPessoas.rows), { EX: 300 }); // 5 minutos
    } catch (err) {
      console.error('Erro ao tentar definir o cache no Redis:', err);
    }

    // Remove o cache da pessoa deletada
    try {
      await redisClient.del(`pessoa:${id}`);
    } catch (err) {
      console.error('Erro ao tentar deletar o cache no Redis:', err);
    }

    // Retorna os detalhes da pessoa que foi deletada
    res.status(200).json({ message: 'Pessoa deletada com sucesso!', pessoa: pessoaDeletada });
  } catch (err) {
    console.error('Erro ao deletar pessoa:', err);
    res.status(500).json({ error: 'Erro ao deletar pessoa' });
  } finally {
    if (client) {
      client.release(); // Garante que o cliente seja liberado
    }
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
