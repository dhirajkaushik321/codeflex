import { S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('S3Config');

export const createS3Client = (configService: ConfigService): S3Client => {
  const region = configService.get<string>('aws.region') || 'us-east-1';
  const accessKeyId = configService.get<string>('aws.accessKeyId');
  const secretAccessKey = configService.get<string>('aws.secretAccessKey');

  // Log S3 configuration (without exposing sensitive data)
  logger.log(`S3 Configuration:`);
  logger.log(`- Region: ${region}`);
  logger.log(`- Bucket: ${configService.get<string>('aws.s3BucketName')}`);
  logger.log(`- Access Key ID: ${accessKeyId ? 'Set' : 'Not set'}`);
  logger.log(`- Secret Access Key: ${secretAccessKey ? 'Set' : 'Not set'}`);

  return new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId || '',
      secretAccessKey: secretAccessKey || '',
    },
  });
};

export const getS3BucketName = (configService: ConfigService): string => {
  return configService.get<string>('aws.s3BucketName') || 'codeveer-profile-pictures';
};

export const getS3Region = (configService: ConfigService): string => {
  return configService.get<string>('aws.region') || 'us-east-1';
}; 