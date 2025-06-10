import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeveloperService } from './developer.service';
import { DeveloperController } from './developer.controller';
import { Developer, DeveloperSchema } from './schemas/developer.schema';
import { S3Service } from './s3.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Developer.name, schema: DeveloperSchema }])],
  controllers: [DeveloperController],
  providers: [DeveloperService, S3Service],
  exports: [MongooseModule],
})
export class DeveloperModule {}
