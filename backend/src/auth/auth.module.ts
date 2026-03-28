import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // ดึง UsersModule มาใช้เพื่อค้นหา User
    PassportModule,
    JwtModule.register({
      secret: 'MY_SUPER_SECRET_KEY', // ในใช้งานจริงควรเก็บในไฟล์ .env นะครับ
      signOptions: { expiresIn: '1d' }, // Token มีอายุ 1 วัน
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}