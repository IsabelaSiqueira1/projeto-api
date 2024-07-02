import { openDb } from "../config.js"

export async function createTable() {
    openDb().then(db => {
        db.exec(`CREATE TABLE IF NOT EXISTS Pessoa (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER, cargo TEXT)`)
        .then(() => {
            console.log('Tabela Pessoa criada ou já existe')
        }).catch(err => {
            console.error('Erro ao criar tabela Pessoa:', err)
        })
    })
}
 
export async function getPessoas(req, res) {
    openDb().then(db => {
        db.all(`SELECT * FROM Pessoa`)
        .then(pessoas => {
            res.json(pessoas)
        })
        .catch(err => {
            res.status(500).json({ error: 'Erro ao buscar pessoas' });
        });
    });
}

export async function getPessoa(req, res) {
    let id = req.body.id
    openDb().then(db => {
        db.get(`SELECT * FROM Pessoa WHERE id = ?`, [id])
        .then(pessoa => {
            res.json(pessoa)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: 'Erro ao buscar pessoa' })
        })
    })
}

export async function insertPessoa(req, res) {
    let pessoa = req.body
    openDb().then(db=>{
        db.run(`INSERT INTO Pessoa (nome, idade, cargo) VALUES (?, ?, ?)`, [pessoa.nome, pessoa.idade, pessoa.cargo])
    })
    res.json({
        "statusCode":200
    })
}

export async function updatePessoa(req, res) {
    let pessoa = req.body
    openDb().then(db=>{
        db.run(`UPDATE Pessoa SET nome=?, idade=? WHERE id=?`, [pessoa.nome, pessoa.idade, pessoa.cargo, pessoa.id])
    })
    res.json({
        "statusCode":200
    })
}

export async function deletePessoa(req, res) {
    let id = req.body.id
    openDb().then(db=>{
        db.get(`DELETE FROM Pessoa WHERE id=?`, [id])
        .then(res=>res)
    })
    res.json({
        "statusCode":200
    })
}
export async function createUserTable() {
    openDb().then(db => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS Usuario (id INTEGER PRIMARY KEY, username TEXT,password TEXT)
        `)
    })
}

export async function getUserByUsername(username) {
    return openDb().then(db =>
        db.get(`SELECT * FROM Usuario WHERE username = ?`, [username])
    )
}

export async function insertUser(username, hashedPassword) {
    return openDb().then(db =>
        db.run(`INSERT INTO Usuario (username, password) VALUES (?, ?)`, [username, hashedPassword])
    )
}
