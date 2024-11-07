import express from 'express'
import { createTable, createUserTable } from './controller/pessoa.js'
import router from './routes.js'
import { createClient } from 'redis'
import amqp from 'amqplib'
import { consumeQueue } from './consumer.js'

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

const PORT = 3000

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://rabbitmq')
  const channel = await connection.createChannel()

  await channel.assertQueue('pessoa_queue');
  
  return channel
}
consumeQueue()

app.listen(PORT, () => {
  console.log(`Aplicação rodando na porta ${PORT}`);
})