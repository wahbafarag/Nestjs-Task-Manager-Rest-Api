import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  // @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.authService.singUp(createUserDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signIn(createUserDto);
  }
}
