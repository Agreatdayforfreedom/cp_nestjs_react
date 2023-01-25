import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInputError } from 'apollo-server-core';
import { GraphQLError } from 'graphql';
import { UserCreateArgs, UserLoginArgs } from '../../users/dtos/user.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(args: UserCreateArgs) {
    const userExists = await this.userService.find(args);

    if ([args.email, args.username, args.password].includes(''))
      throw new UserInputError('All fields are required');
    if (userExists) throw new HttpException('Username already exists', 400);

    // const {password: _, ...rest} =
    const { password: _, ...rest } = await this.userService.create(args);
    return {
      user: rest,
      token: this.jwtService.sign(
        {
          id: rest.id,
          username: rest.username,
          email: rest.email,
        },
        { secret: 'secret' },
      ),
    };
  }

  async login(args: UserLoginArgs) {
    const user = await this.userService.find(args);
    if (!user) throw new UserInputError('User not found');
    if (user.password !== args.password)
      throw new UserInputError('Invalid username or password');

    const { password: _, ...rest } = user;
    return {
      user: rest,
      token: this.jwtService.sign(
        {
          id: rest.id,
          username: rest.username,
          email: rest.email,
        },
        { secret: 'secret' },
      ),
    };
  }
}
