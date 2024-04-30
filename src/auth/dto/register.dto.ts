import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterForm {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsNotEmpty()
  password: string;
}
