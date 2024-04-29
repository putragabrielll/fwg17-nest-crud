import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.insert(createUserDto);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = new User();
    user.id = id;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    const results = await this.dataSource.manager.save(user);

    return results;
  }

  remove(id: number) {
    const user = this.userRepository.findOneBy({ id });
    if (user) {
      this.userRepository.delete({ id });
      return user;
    }
    return null;
  }
}
