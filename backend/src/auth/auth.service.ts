import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../developer/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../developer/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, password, role, ...rest } = createUserDto;
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      ...rest,
      email,
      password: hashedPassword,
      role: role || 'learner',
    };

    const user = await this.userService.create(userData);
    const { password: _, ...userResult } = user.toObject();
    
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isProfileComplete: user.isProfileComplete || false,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isProfileComplete: user.isProfileComplete || false,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`Validating user with email: ${email}`);
    
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log(`Registering new user with email: ${createUserDto.email}`);
    
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'learner',
    };

    const newUser = await this.userService.create(userData);
    const { password, ...result } = newUser.toObject();
    
    this.logger.log(`Successfully registered user: ${newUser.email}`);
    return result;
  }
}
