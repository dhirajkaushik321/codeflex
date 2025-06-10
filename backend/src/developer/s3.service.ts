import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { createS3Client, getS3BucketName } from '../config/s3.config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = createS3Client(configService);
    this.bucketName = getS3BucketName(configService);
    this.logger.log(`S3Service initialized with bucket: ${this.bucketName}`);
    
    // Test bucket connectivity
    this.testBucketAccess();
  }

  private async testBucketAccess(): Promise<void> {
    try {
      this.logger.log(`Testing access to S3 bucket: ${this.bucketName}`);
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1,
      });
      
      await this.s3Client.send(command);
      this.logger.log(`Successfully connected to S3 bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error(`Failed to access S3 bucket ${this.bucketName}: ${error.message}`, error.stack);
    }
  }

  async generatePresignedUrl(
    fileName: string,
    contentType: string,
    userId: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    this.logger.log(`Generating presigned URL for user ${userId}, file: ${fileName}, type: ${contentType}`);
    
    const key = `profile-pictures/${userId}/${Date.now()}-${fileName}`;
    this.logger.log(`Generated S3 key: ${key}`);
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      // ACL: 'public-read', // Temporarily removed to test if this is causing issues
    });

    try {
      this.logger.log(`Creating presigned URL for bucket: ${this.bucketName}, key: ${key}`);
      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      
      this.logger.log(`Successfully generated presigned URL for key: ${key}`);
      this.logger.log(`Upload URL: ${uploadUrl.substring(0, 100)}...`);
      this.logger.log(`File URL: ${fileUrl}`);
      this.logger.log(`Full upload URL length: ${uploadUrl.length} characters`);

      return { uploadUrl, fileUrl };
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    this.logger.log(`Attempting to delete file: ${fileUrl}`);
    
    try {
      const key = fileUrl.replace(`https://${this.bucketName}.s3.amazonaws.com/`, '');
      this.logger.log(`Extracted S3 key for deletion: ${key}`);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file with key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${error.message}`, error.stack);
      throw new Error('Failed to delete file from S3');
    }
  }

  async uploadFileDirectly(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    this.logger.log(`Direct upload for user ${userId}, file: ${file.originalname}, size: ${file.size} bytes`);
    
    const key = `profile-pictures/${userId}/${Date.now()}-${file.originalname}`;
    this.logger.log(`Generated S3 key for direct upload: ${key}`);
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Temporarily removed to test if this is causing issues
    });

    try {
      await this.s3Client.send(command);
      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      
      this.logger.log(`Successfully uploaded file directly to S3: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file directly to S3: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateSignedViewUrl(fileUrl: string): Promise<string> {
    this.logger.log(`Generating signed view URL for: ${fileUrl}`);
    
    try {
      // Extract the key from the file URL
      const key = fileUrl.replace(`https://${this.bucketName}.s3.amazonaws.com/`, '');
      this.logger.log(`Extracted S3 key for signed URL: ${key}`);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      this.logger.log(`Successfully generated signed view URL for key: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed view URL: ${error.message}`, error.stack);
      throw error;
    }
  }
} 