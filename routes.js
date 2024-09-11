import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Router } from "express"
import { createTable, insertPessoa, updatePessoa, getPessoas, getPessoa, deletePessoa, getUserByUsername, insertUser } from './controller/pessoa.js'
import { authenticateToken } from './auth.js'

const router = Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' })
    }

    await insertUser(username, hashedPassword)
    res.json({ "statusCode": 200, "message": "Usuário registrado com sucesso!" })
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await getUserByUsername(username)

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(403).json({ message: 'Senha incorreta' })
        }

        const token = jwt.sign({ username: user.username }, 'seu_segredo', { expiresIn: '1h' })
        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' })
    }
})


router.get('/', (req, res) => {
    res.json({
        "statusCode" : 200,
        "message": "Api rodandooo! aleluiaaa eita gloria"
    })
})

router.get('/pessoas', getPessoas)
router.get('/pessoa/:id', getPessoa)
router.post('/pessoa', authenticateToken, insertPessoa)
router.put('/pessoa', authenticateToken, updatePessoa)
router.delete('/pessoa/:id', authenticateToken, deletePessoa);

export default router