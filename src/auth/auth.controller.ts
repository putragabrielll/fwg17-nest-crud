import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginForm } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterForm } from './dto/register.dto';
import * as argon from 'argon2';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('01 - Authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  async authByEmail(@Body() form: LoginForm) {
    const user = await this.authService.login(form.email, form.password);
    const token = this.jwtService.sign({ id: user.id });
    return {
      success: true,
      message: 'Login success',
      results: {
        token,
      },
    };
  }

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded')
  async registerByEmail(@Body() form: RegisterForm) {
    if (form.password) {
      form.password = await argon.hash(form.password);
    }
    const user = await this.authService.register(form);
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'Failed',
      });
    }
    return {
      success: true,
      message: 'Register success',
    };
  }
}
