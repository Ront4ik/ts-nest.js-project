import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Импортируем TypeOrmModule
import { User } from './entities/user.entity'; // 2. Импортируем нашу сущность

@Module({
  imports: [
    TypeOrmModule.forFeature([User]) // 3. Регистрируем сущность в этом модуле
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService],
})
export class UsersModule {}