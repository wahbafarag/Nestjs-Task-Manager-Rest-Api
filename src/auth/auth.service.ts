/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async singUp(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.signUp(createUserDto);
  }

  async signIn(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      createUserDto,
    );
    if (!username) throw new UnauthorizedException('Invalid Credentials');
    
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
