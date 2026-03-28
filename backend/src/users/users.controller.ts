import { Controller, Post, Body } from '@nestjs/common';
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
}