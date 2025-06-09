import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Developer, DeveloperDocument } from '../developer/schemas/developer.schema';
import { CreateDeveloperDto } from '../developer/dto/create-developer.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(createDeveloperDto: CreateDeveloperDto) {
    const { email, password, ...rest } = createDeveloperDto;
    const existing = await this.developerModel.findOne({ email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const developer = new this.developerModel({
      ...rest,
      email,
      password: hashedPassword,
      role: 'developer',
      isProfileComplete: false,
    });
    await developer.save();
    return this.generateJwt(developer);
  }

  async validateDeveloper(email: string, password: string): Promise<Developer | null> {
    const developer = await this.developerModel.findOne({ email });
    if (!developer) return null;
    const isMatch = await bcrypt.compare(password, developer.password);
    if (!isMatch) return null;
    return developer;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const developer = await this.developerModel.findOne({ email });
    if (!developer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, developer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateJwt(developer);
  }

  private generateJwt(developer: DeveloperDocument) {
    const payload = {
      sub: developer._id,
      email: developer.email,
      role: developer.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: developer._id,
        email: developer.email,
        firstName: developer.firstName,
        lastName: developer.lastName,
        role: developer.role,
        isProfileComplete: developer.isProfileComplete,
      },
    };
  }
}
