import { connect } from 'amqplib'
import { pool } from '../src/config.js'

export const consumeQueue = async () => {
  try {
    const connection = await connect('amqp://rabbitmq')
    const channel = await connection.createChannel()
    const queue = 'pessoa_queue'
    await channel.assertQueue(queue, { durable: true })
    console.log(`Aguardando mensagens na fila: ${queue}`)

    channel.consume(queue, async (msg) => {
      if (msg) {
        const pessoa = JSON.parse(msg.content.toString())
        console.log('Mensagem recebida:', pessoa)

        await addPessoa(pessoa)
        channel.ack(msg)
      }
    })
  } catch (error) {
    console.error('Erro no consumidor:', error)
  }
}

const addPessoa = async (pessoa) => {
  try {
    const query = 'INSERT INTO pessoa (nome, idade, cargo) VALUES ($1, $2, $3)'
    await pool.query(query, [pessoa.nome, pessoa.idade, pessoa.cargo])
    console.log('Pessoa inserida no banco:', pessoa)
  } catch (error) {
    console.error('Erro ao inserir pessoa no banco:', error)
  }
}
