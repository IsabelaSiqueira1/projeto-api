import { connectRabbitMQ } from '../services/rabbitmqService.js';

export async function sendMessageToQueue(message) {
    const channel = await connectRabbitMQ();
    await channel.sendToQueue('pessoa_queue', Buffer.from(JSON.stringify(message)));
    console.log('Mensagem enviada para a fila:', message);
}
