import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon from 'argon2';
import { RegisterForm } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Wrong email or password',
      });
    }
    const confirm = await argon.verify(user.password, password);
    if (!confirm) {
      throw new UnauthorizedException({
        success: false,
        message: 'Wrong email or password',
      });
    }

    return user;
  }

  async register(registerForm: RegisterForm) {
    const user = await this.userService.create(registerForm);
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to register',
      });
    }
    return user;
  }
}
