import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Developer, DeveloperDocument } from './schemas/developer.schema';
import { S3Service } from './s3.service';
import { GenerateUploadUrlDto, UpdateProfilePictureDto } from './dto/upload-profile-picture.dto';

@Injectable()
export class DeveloperService {
  private readonly logger = new Logger(DeveloperService.name);

  constructor(
    @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
    private s3Service: S3Service,
  ) {}

  async generateUploadUrl(
    userId: string,
    generateUploadUrlDto: GenerateUploadUrlDto,
  ) {
    this.logger.log(`Generating upload URL for user ${userId}`);
    this.logger.log(`Request data: ${JSON.stringify(generateUploadUrlDto)}`);

    try {
      const result = await this.s3Service.generatePresignedUrl(
        generateUploadUrlDto.fileName,
        generateUploadUrlDto.contentType,
        userId,
      );

      this.logger.log(`Successfully generated upload URL for user ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate upload URL for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateProfilePicture(
    userId: string,
    updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    this.logger.log(`Updating profile picture for user ${userId}`);
    this.logger.log(`New profile picture URL: ${updateProfilePictureDto.profilePicture}`);

    const developer = await this.developerModel.findById(userId);
    
    if (!developer) {
      this.logger.error(`Developer not found for user ID: ${userId}`);
      throw new NotFoundException('Developer not found');
    }

    this.logger.log(`Found developer: ${developer.firstName} ${developer.lastName}`);

    // Delete old profile picture if it exists
    if (developer.profilePicture) {
      this.logger.log(`Deleting old profile picture: ${developer.profilePicture}`);
      try {
        await this.s3Service.deleteFile(developer.profilePicture);
        this.logger.log(`Successfully deleted old profile picture`);
      } catch (error) {
        this.logger.error(`Error deleting old profile picture: ${error.message}`, error.stack);
      }
    } else {
      this.logger.log(`No existing profile picture to delete`);
    }

    // Update with new profile picture URL
    developer.profilePicture = updateProfilePictureDto.profilePicture;
    await developer.save();

    this.logger.log(`Successfully updated profile picture for user ${userId}`);
    this.logger.log(`New profile picture URL: ${developer.profilePicture}`);

    return { profilePicture: developer.profilePicture };
  }

  async getDeveloperProfile(userId: string) {
    this.logger.log(`Getting developer profile for user ${userId}`);

    const developer = await this.developerModel.findById(userId);
    
    if (!developer) {
      this.logger.error(`Developer not found for user ID: ${userId}`);
      throw new NotFoundException('Developer not found');
    }

    this.logger.log(`Successfully retrieved developer profile for user ${userId}`);
    return developer;
  }

  async deleteProfilePicture(userId: string) {
    this.logger.log(`Deleting profile picture for user ${userId}`);

    const developer = await this.developerModel.findById(userId);
    
    if (!developer) {
      this.logger.error(`Developer not found for user ID: ${userId}`);
      throw new NotFoundException('Developer not found');
    }

    if (developer.profilePicture) {
      this.logger.log(`Deleting profile picture from S3: ${developer.profilePicture}`);
      try {
        await this.s3Service.deleteFile(developer.profilePicture);
        this.logger.log(`Successfully deleted profile picture from S3`);
      } catch (error) {
        this.logger.error(`Error deleting profile picture from S3: ${error.message}`, error.stack);
      }
    } else {
      this.logger.log(`No profile picture to delete`);
    }

    developer.profilePicture = undefined;
    await developer.save();

    this.logger.log(`Successfully deleted profile picture for user ${userId}`);
    return { message: 'Profile picture deleted successfully' };
  }

  async generateSignedViewUrl(fileUrl: string) {
    this.logger.log(`Generating signed view URL for: ${fileUrl}`);
    
    try {
      const signedUrl = await this.s3Service.generateSignedViewUrl(fileUrl);
      this.logger.log(`Successfully generated signed view URL`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed view URL: ${error.message}`, error.stack);
      throw error;
    }
  }
}
