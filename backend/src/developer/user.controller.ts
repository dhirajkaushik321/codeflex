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
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { UpdateUserProfileDto } from './dto/create-user.dto';
import { S3Service } from './s3.service';
import { 
  GenerateUploadUrlDto, 
  UpdateProfilePictureDto,
  UploadProfilePictureResponseDto 
} from './dto/upload-profile-picture.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@Req() req) {
    this.logger.log(`Getting user profile for user ${req.user.userId}`);
    const result = await this.userService.getUserProfile(req.user.userId);
    this.logger.log(`Successfully retrieved user profile for user ${req.user.userId}`);
    return result;
  }

  @Put('profile')
  async updateUserProfile(
    @Req() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    this.logger.log(`Updating user profile for user ${req.user.userId}`);
    this.logger.log(`Request body: ${JSON.stringify(updateUserProfileDto)}`);

    const result = await this.userService.updateUserProfile(
      req.user.userId,
      updateUserProfileDto,
    );

    this.logger.log(`Successfully updated user profile for user ${req.user.userId}`);
    return result;
  }

  @Post('upload-url')
  async generateUploadUrl(@Body() generateUploadUrlDto: GenerateUploadUrlDto) {
    this.logger.log(`Generating upload URL for file: ${generateUploadUrlDto.fileName}`);
    const result = await this.userService.generateUploadUrl(generateUploadUrlDto);
    this.logger.log(`Successfully generated upload URL for file: ${generateUploadUrlDto.fileName}`);
    return result;
  }

  @Put('profile-picture')
  async updateProfilePicture(
    @Req() req,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    this.logger.log(`Updating profile picture for user ${req.user.userId}`);
    this.logger.log(`New profile picture URL: ${updateProfilePictureDto.profilePicture}`);

    const result = await this.userService.updateProfilePicture(
      req.user.userId,
      updateProfilePictureDto,
    );

    this.logger.log(`Successfully updated profile picture for user ${req.user.userId}`);
    return result;
  }

  @Delete('profile-picture')
  async deleteProfilePicture(@Req() req) {
    this.logger.log(`Deleting profile picture for user ${req.user.userId}`);

    const result = await this.userService.deleteProfilePicture(req.user.userId);

    this.logger.log(`Successfully deleted profile picture for user ${req.user.userId}`);
    return result;
  }

  @Post('signed-url')
  async generateSignedUrl(@Body() generateUploadUrlDto: GenerateUploadUrlDto) {
    this.logger.log(`Generating signed URL for file: ${generateUploadUrlDto.fileName}`);
    const result = await this.userService.generateSignedUrl(generateUploadUrlDto);
    this.logger.log(`Successfully generated signed URL for file: ${generateUploadUrlDto.fileName}`);
    return result;
  }
}
