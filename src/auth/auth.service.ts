// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Проверяет email и пароль пользователя и возвращает JWT токен, если все верно.
   */
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    console.log('--- ЛОГИН ---');
    console.log('Попытка входа для email:', email);
    console.log('Присланный пароль:', pass);
    // 1. Находим пользователя по email
    const user = await this.usersService.findOneByEmail(email);

    // 2. Если пользователя нет или пароль не совпадает, кидаем ошибку
    if (!user || !(await bcrypt.compare(pass, user.password_hash))) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }
    console.log('Найден пользователь:', user.email);
    console.log('Хеш из БД:', user.password_hash);
    // 3. Если все хорошо, создаем "полезную нагрузку" для токена
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    
    console.log('Результат bcrypt.compare:', isMatch); // true или false
    console.log('--------------------');

    if (!isMatch) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    };
  }
