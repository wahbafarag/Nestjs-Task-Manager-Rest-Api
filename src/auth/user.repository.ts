/* eslint-disable prettier/prettier */
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(createUserDto: CreateUserDto): Promise<string> {
    const { username, password } = createUserDto;
    const user = await this.findOne({ where: { username: username } });
    if (user && (await user.validatePassword(password))) return username;
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
