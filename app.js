//import { openDb } from './config.js'
import { createTable, createUserTable } from './controller/pessoa.js'
import express from 'express'

const app = express()
app.use(express.json())

import router from './routes.js'
app.use(router)

createTable()
createUserTable()

app.listen(3000, ()=> console.log("Aplicaçao rodando na porta 3000"))
