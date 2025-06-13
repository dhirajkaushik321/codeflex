import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { S3Service } from './s3.service';
import { GenerateUploadUrlDto, UpdateProfilePictureDto } from './dto/upload-profile-picture.dto';
import { UpdateUserProfileDto, CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private s3Service: S3Service,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Finding user by email: ${email}`);
    const user = await this.userModel.findOne({ email });
    if (user) {
      this.logger.log(`Found user: ${user.firstName} ${user.lastName}`);
    } else {
      this.logger.log(`No user found with email: ${email}`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    const user = new this.userModel(createUserDto);
    await user.save();
    this.logger.log(`Successfully created user: ${user.firstName} ${user.lastName}`);
    return user;
  }

  async generateUploadUrl(generateUploadUrlDto: GenerateUploadUrlDto) {
    this.logger.log(`Generating upload URL for file: ${generateUploadUrlDto.fileName}`);
    const result = await this.s3Service.generatePresignedUrl(
      generateUploadUrlDto.fileName,
      generateUploadUrlDto.contentType,
      'temp-user-id' // This will be replaced with actual user ID when needed
    );
    this.logger.log(`Successfully generated upload URL for file: ${generateUploadUrlDto.fileName}`);
    return result;
  }

  async updateProfilePicture(userId: string, updateProfilePictureDto: UpdateProfilePictureDto) {
    this.logger.log(`Updating profile picture for user ${userId}`);
    this.logger.log(`New profile picture URL: ${updateProfilePictureDto.profilePicture}`);

    const user = await this.userModel.findById(userId);
    
    if (!user) {
      this.logger.error(`User not found for user ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Found user: ${user.firstName} ${user.lastName}`);

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      this.logger.log(`Deleting old profile picture: ${user.profilePicture}`);
      try {
        await this.s3Service.deleteFile(user.profilePicture);
        this.logger.log(`Successfully deleted old profile picture`);
      } catch (error) {
        this.logger.error(`Failed to delete old profile picture: ${error.message}`);
        // Continue with update even if deletion fails
      }
    }

    // Update with new profile picture URL
    user.profilePicture = updateProfilePictureDto.profilePicture;
    await user.save();

    this.logger.log(`Successfully updated profile picture for user ${userId}`);
    this.logger.log(`New profile picture URL: ${user.profilePicture}`);

    return { profilePicture: user.profilePicture };
  }

  async getUserProfile(userId: string) {
    this.logger.log(`Getting user profile for user ${userId}`);

    const user = await this.userModel.findById(userId);
    
    if (!user) {
      this.logger.error(`User not found for user ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Successfully retrieved user profile for user ${userId}`);
    return user;
  }

  async deleteProfilePicture(userId: string) {
    this.logger.log(`Deleting profile picture for user ${userId}`);

    const user = await this.userModel.findById(userId);
    
    if (!user) {
      this.logger.error(`User not found for user ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    if (user.profilePicture) {
      this.logger.log(`Deleting profile picture from S3: ${user.profilePicture}`);
      try {
        await this.s3Service.deleteFile(user.profilePicture);
        this.logger.log(`Successfully deleted profile picture from S3`);
      } catch (error) {
        this.logger.error(`Failed to delete profile picture from S3: ${error.message}`);
        // Continue with update even if deletion fails
      }
    }

    user.profilePicture = undefined;
    await user.save();

    this.logger.log(`Successfully deleted profile picture for user ${userId}`);
    return { message: 'Profile picture deleted successfully' };
  }

  async updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
    this.logger.log(`Updating user profile for user ${userId}`);
    this.logger.log(`Update data: ${JSON.stringify(updateUserProfileDto)}`);

    const user = await this.userModel.findById(userId);
    
    if (!user) {
      this.logger.error(`User not found for user ID: ${userId}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Found user: ${user.firstName} ${user.lastName}`);

    // Update all fields from the DTO
    Object.assign(user, updateUserProfileDto);
    
    // Mark profile as complete
    user.isProfileComplete = true;

    await user.save();

    this.logger.log(`Successfully updated user profile for user ${userId}`);
    return user;
  }

  async generateSignedUrl(generateUploadUrlDto: GenerateUploadUrlDto) {
    this.logger.log(`Generating signed URL for file: ${generateUploadUrlDto.fileName}`);
    const result = await this.s3Service.generateSignedViewUrl(generateUploadUrlDto.fileName);
    this.logger.log(`Successfully generated signed URL for file: ${generateUploadUrlDto.fileName}`);
    return result;
  }
}
