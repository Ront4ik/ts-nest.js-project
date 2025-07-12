// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: any): Promise<Omit<User, 'password_hash'>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { password_hash, ...result } = savedUser;
    return result;
  }

  // ВАЖНО: Метод должен быть async и использовать await
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  // Этот метод мы не использовали, но он тоже должен быть async
  async findOneById(id: number): Promise<User | null> {
    console.log(`SERVICE: Ищу пользователя с ID: ${id}`); // Добавим лог
    const user = await this.usersRepository.findOneBy({ id });
    console.log(`SERVICE: Результат поиска в БД:`, user ? user.email : 'null'); // Добавим лог
    return user;
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return result;
  }
}