import amqp from 'amqplib'

export async function sendToQueue(pessoaData) {
  try {
    const connection = await amqp.connect('amqp://rabbitmq')
    const channel = await connection.createChannel()
    
    const queue = 'pessoa_queue'
    const msg = JSON.stringify(pessoaData)

    await channel.assertQueue(queue, {
      durable: true
    })

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true 
    })

    console.log('Mensagem enviada para a fila:', msg)
    setTimeout(() => {
      connection.close();
    }, 500)

  } catch (err) {
    console.error('Erro ao enviar para a fila RabbitMQ:', err)
  }
}
