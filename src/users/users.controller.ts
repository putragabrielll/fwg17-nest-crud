import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { instanceToPlain } from 'class-transformer';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('CRUD Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = await argon.hash(createUserDto.password);
    }
    const data = await this.usersService.create(createUserDto);
    if (data) {
      const user = await this.usersService.findOne(data.identifiers[0].id);
      return {
        success: true,
        message: 'Create user success',
        results: instanceToPlain(user),
      };
    } else {
      throw new BadRequestException({
        success: false,
        message: 'User exists',
      });
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        message: 'List all users',
        results: instanceToPlain(users),
      };
    } catch (err) {
      console.log(err);
      return 'Error';
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return {
      success: true,
      message: 'Detail user',
      results: instanceToPlain(user),
    };
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return {
      success: true,
      message: 'Update success',
      results: instanceToPlain(user),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(+id);
    if (user) {
      return {
        success: true,
        message: 'Delete success',
        results: user,
      };
    }
    throw new BadRequestException({
      success: false,
      message: 'Failed',
    });
  }
}
