import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule'; // 👈 1. Import ตัวจัดตารางเวลา
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- นำเข้าส่วนของการจอง ---
import { BookingsController } from './book/bookings.controller';
import { BookingsService } from './book/bookings.service';
import { BookingEntity } from './book/entities/booking.entity';
import { BookingsCronService } from './book/bookings.cron'; // 👈 2. Import ไฟล์ Cron ที่เราเพิ่งสร้าง

// --- นำเข้าส่วนของระบบ User และ Auth ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';

// --- นำเข้าส่วนของวันหยุด ---
import { HolidayModule } from './holiday/holiday.module';
import { Holiday } from './holiday/entities/holiday.entity'; // 🌟 1. นำเข้า Holiday Entity

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'ferncare',
      // 🌟 2. เพิ่ม Holiday เข้าไปในวงเล็บนี้ครับ
      entities: [BookingEntity, User, Holiday], 
      synchronize: true, // 🌟 ดีมากครับที่เปิดไว้ 4 ฟิลด์ใหม่ที่เราเพิ่มไปจะได้ถูกสร้างออโต้!
    }),
    TypeOrmModule.forFeature([BookingEntity]),
    
    ScheduleModule.forRoot(), // 👈 3. เปิดใช้งานระบบตั้งเวลาตรงนี้
    
    // ลงทะเบียน Module ใหม่ทั้ง 2 ตัว
    UsersModule,
    AuthModule,
    HolidayModule,
  ],
  controllers: [AppController, BookingsController],
  providers: [
    AppService, 
    BookingsService,
    BookingsCronService // 👈 4. ลงทะเบียนตัวรัน Cron Job ในนี้
  ],
})
export class AppModule {}