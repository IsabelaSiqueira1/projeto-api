//import { openDb } from './config.js'
import { createTable, createUserTable } from './controller/pessoa.js'
import express from 'express'

const app = express()
app.use(express.json())

import router from './routes.js'
app.use(router)

createTable()
createUserTable()
// app.get('/', (req, res)=> {
//     res.send("Hello word")
// })

// app.get('/pessoas', async (req, res)=> {
//     let pessoas = await getPessoas()
//     res.json(pessoas)
// })

// app.get('/pessoa', async (req, res)=> {
//     let pessoa = await getPessoa(req.body.id)
//     res.json(pessoa)
// })
    
// app.post('/pessoa', (req, res)=> {
//     insertPessoa(req.body)
//     res.json({
//         "statusCode": 200
//     })
// })

// app.put('/pessoa', (req, res)=> {
//     if(req.body && !req.body.id) {
//        res.json({
//            "statusCode": 400,
//            "message": "Precisa informar um id"
//         })
//     } else{
//         updatePessoa(req.body)
//         res.json({
//             "statusCode": 200
//         })
//     }
// })

// app.delete('/pessoa', async (req, res)=> {
//     let pessoa = await deletePessoa(req.body.id)
//     res.json(pessoa)
// })

app.listen(3000, ()=> console.log("Aplicaçao rodando na porta 3000"))