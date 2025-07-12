
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Импортируем
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 2. Подключаем ConfigModule. isGlobal: true делает его доступным везде.
    ConfigModule.forRoot({
      isGlobal: true,
      cache:true,
    }),

    // 3. Изменяем TypeOrmModule для асинхронной конфигурации
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule сюда, чтобы использовать ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService], // Внедряем ConfigService в useFactory
    }),

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}