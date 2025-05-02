import amqplib from 'amqplib';

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    setTimeout(connectToRabbitMQ, 5000);
  }
};
