import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // เวลาส่งกลับไปที่ Frontend เราไม่ควรส่งรหัสผ่าน (ที่ hash แล้ว) กลับไปด้วย
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user; 
    return {
      message: 'สมัครสมาชิกสำเร็จ',
      user: result
    };
  }

  // --- 🌟 ส่วนที่เพิ่มใหม่สำหรับใช้ Postman ---

  // 1. API ดึงข้อมูลผู้ใช้ทั้งหมด (ยิง GET /users)
  @Get()
  async findAllUsers() {
    return this.usersService.findAll();
  }

  // 2. API ลับสำหรับเปลี่ยนสิทธิ์เป็น Admin (ยิง GET /users/make-admin/1)
  @Get('make-admin/:id')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(+id); // ใส่เครื่องหมาย + เพื่อแปลง string เป็น number
  }
}