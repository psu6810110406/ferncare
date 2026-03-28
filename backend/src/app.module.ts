import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- นำเข้าส่วนของการจอง (ของเดิมที่คุณมี) ---
import { BookingsController } from './book/bookings.controller';
import { BookingsService } from './book/bookings.service';
import { BookingEntity } from './book/booking.entity';

// --- นำเข้าส่วนของระบบ User และ Auth (ที่เราเพิ่งสร้าง) ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity'; // นำเข้า Entity ของ User

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'ferncare',
      // เพิ่ม User เข้าไปใน array entities เพื่อให้ TypeORM สร้างตาราง users ให้
      entities: [BookingEntity, User], 
      synchronize: true, // For development only
    }),
    TypeOrmModule.forFeature([BookingEntity]),
    
    // ลงทะเบียน Module ใหม่ทั้ง 2 ตัวที่นี่
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, BookingsController],
  providers: [AppService, BookingsService],
})
export class AppModule {}