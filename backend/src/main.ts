import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load .env file explicitly
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS with dynamic origin
  const corsOrigin = configService.get<string>('cors.origin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Get port from config
  const port = configService.get<number>('port') || 3001;
  const nodeEnv = configService.get<string>('nodeEnv');
  
  // Debug logging (only in development)
  if (nodeEnv === 'development') {
    console.log('🚀 Environment:', nodeEnv);
    console.log('🌐 CORS Origin:', corsOrigin);
    console.log('🔗 MongoDB URI:', configService.get('database.uri') ? '***' : 'undefined');
    console.log('🔐 JWT Secret:', configService.get('jwt.secret') ? '***' : 'undefined');
    console.log('☁️ AWS S3 Bucket:', configService.get('aws.s3BucketName') || 'undefined');
    console.log('🌍 AWS Region:', configService.get('aws.region') || 'undefined');
    console.log('🔑 AWS Access Key:', configService.get('aws.accessKeyId') ? 'Set' : 'Not set');
    console.log('🔐 AWS Secret Key:', configService.get('aws.secretAccessKey') ? 'Set' : 'Not set');
  }
  
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
}
bootstrap();
