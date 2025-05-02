import { connectRabbitMQ } from '../services/rabbitmqService.js';
import { addPessoa } from '../models/pessoaModel.js';

export async function consumeQueue() {
    const channel = await connectRabbitMQ();
    channel.consume('pessoa_queue', async (msg) => {
        const pessoa = JSON.parse(msg.content.toString());
        console.log('Processando pessoa:', pessoa);
        await addPessoa(pessoa);
        channel.ack(msg);
    });
}
