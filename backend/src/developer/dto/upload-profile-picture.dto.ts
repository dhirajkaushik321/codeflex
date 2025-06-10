import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}

export class UploadProfilePictureResponseDto {
  uploadUrl: string;
  fileUrl: string;
}

export class UpdateProfilePictureDto {
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
} 