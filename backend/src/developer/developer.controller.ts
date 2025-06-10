import { 
  Controller, 
  Post, 
  Put, 
  Get, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { 
  GenerateUploadUrlDto, 
  UpdateProfilePictureDto,
  UploadProfilePictureResponseDto 
} from './dto/upload-profile-picture.dto';
import { UpdateDeveloperProfileDto } from './dto/create-developer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('developer')
@UseGuards(JwtAuthGuard)
export class DeveloperController {
  private readonly logger = new Logger(DeveloperController.name);

  constructor(private readonly developerService: DeveloperService) {}

  @Post('upload-url')
  async generateUploadUrl(
    @Request() req,
    @Body() generateUploadUrlDto: GenerateUploadUrlDto,
  ): Promise<UploadProfilePictureResponseDto> {
    this.logger.log(`POST /developer/upload-url - User ID: ${req.user.userId}`);
    this.logger.log(`Request body: ${JSON.stringify(generateUploadUrlDto)}`);

    try {
      const result = await this.developerService.generateUploadUrl(
        req.user.userId,
        generateUploadUrlDto,
      );

      this.logger.log(`Successfully generated upload URL for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate upload URL for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put('profile-picture')
  async updateProfilePicture(
    @Request() req,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    this.logger.log(`PUT /developer/profile-picture - User ID: ${req.user.userId}`);
    this.logger.log(`Request body: ${JSON.stringify(updateProfilePictureDto)}`);

    try {
      const result = await this.developerService.updateProfilePicture(
        req.user.userId,
        updateProfilePictureDto,
      );

      this.logger.log(`Successfully updated profile picture for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update profile picture for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('profile')
  async getProfile(@Request() req) {
    this.logger.log(`GET /developer/profile - User ID: ${req.user.userId}`);

    try {
      const result = await this.developerService.getDeveloperProfile(req.user.userId);
      this.logger.log(`Successfully retrieved profile for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get profile for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete('profile-picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfilePicture(@Request() req) {
    this.logger.log(`DELETE /developer/profile-picture - User ID: ${req.user.userId}`);

    try {
      const result = await this.developerService.deleteProfilePicture(req.user.userId);
      this.logger.log(`Successfully deleted profile picture for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete profile picture for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateDeveloperProfileDto: UpdateDeveloperProfileDto,
  ) {
    this.logger.log(`PUT /developer/profile - User ID: ${req.user.userId}`);
    this.logger.log(`Request body: ${JSON.stringify(updateDeveloperProfileDto)}`);

    try {
      const result = await this.developerService.updateDeveloperProfile(
        req.user.userId,
        updateDeveloperProfileDto,
      );

      this.logger.log(`Successfully updated profile for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update profile for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('signed-url')
  async generateSignedUrl(
    @Request() req,
    @Body() body: { fileUrl: string },
  ) {
    this.logger.log(`POST /developer/signed-url - User ID: ${req.user.userId}`);
    this.logger.log(`Request body: ${JSON.stringify(body)}`);

    try {
      const result = await this.developerService.generateSignedViewUrl(body.fileUrl);
      this.logger.log(`Successfully generated signed URL for user ${req.user.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for user ${req.user.userId}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
