import express from 'express'
import { createTable, createUserTable } from './controller/pessoa.js'
import router from './routes.js'
import { createClient } from 'redis'

const app = express()
app.use(express.json())

export const redisClient = createClient({
  url: 'redis://redis:6379'
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

await redisClient.connect()

app.use(router)

createTable()
createUserTable()

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Aplicação rodando na porta ${PORT}`);
})
createTable()
createUserTable()

app.listen(3000, ()=> console.log("Aplicaçao rodando na porta 3000"))

