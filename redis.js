import { createClient } from 'redis';

let redisClient;

const connectToRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: 'redis://redis:6379',
    });
    
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
  }
  
  return redisClient;
};

export default connectToRedis;
