import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';

async function bootstrap() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const url = new URL(redisUrl);

  // Create a hybrid application (HTTP + Microservice)
  const app = await NestFactory.create(AppModule);

  // Connect to Redis as a microservice
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  // Start all microservices
  await app.startAllMicroservices();

  // Start HTTP server on a port (for health checks)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`User Service connecting to Redis at ${url.hostname}:${url.port || 6379}`);
  console.log(`User Service HTTP server running on port ${port}`);
  console.log('User Service is running (Redis microservice)');
}
bootstrap();
