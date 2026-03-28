import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  // นำเข้า User Entity เพื่อให้ Service เรียกใช้งานฐานข้อมูลตารางนี้ได้
  imports: [TypeOrmModule.forFeature([User])], 
  
  controllers: [UsersController],
  providers: [UsersService],
  
  // สำคัญมาก: เราต้อง export UsersService เพื่อให้ระบบ Login (AuthModule) 
  // ที่เรากำลังจะสร้างในขั้นตอนต่อไป สามารถเรียกใช้ฟังก์ชันค้นหาผู้ใช้ได้ครับ
  exports: [UsersService], 
})
export class UsersModule {}