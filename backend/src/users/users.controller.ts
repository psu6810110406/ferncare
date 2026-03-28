import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  UseGuards, 
  Request as NestRequest,
  ForbiddenException // 🌟 เพิ่มตัวจัดการ Error ของ NestJS
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // 🌟 Import DTO ตัวใหม่ที่เราสร้างไว้

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user; 
    return {
      message: 'สมัครสมาชิกสำเร็จ',
      user: result
    };
  }

  // --- 🌟 ส่วนที่เพิ่มใหม่สำหรับใช้ Postman ---

  @Get()
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('make-admin/:id')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(+id); 
  }

  // --- 🛡️ ส่วน Profile (อัปเกรดความปลอดภัยแล้ว) 🛡️ ---

  @UseGuards(AuthGuard('jwt')) 
  @Get(':id')
  async getProfile(@Param('id') id: string, @NestRequest() req: Request) {
    const userIdFromToken = (req.user as any).userId;
    
    // 🔒 ปรับมาใช้ ForbiddenException เวลายิง API ผิดคน จะได้แจ้งเตือน 403 แทน 500
    if (userIdFromToken !== +id) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลของผู้อื่น');
    }

    return this.usersService.findOneById(+id);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, // 🌟 เปลี่ยนมาใช้ UpdateUserDto
    @NestRequest() req: Request
  ) {
    const userIdFromToken = (req.user as any).userId;
    
    if (userIdFromToken !== +id) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น');
    }

    // 🔒 กรองข้อมูลขยะ/ป้องกันการแฮ็กเปลี่ยนสิทธิ์
    delete (updateUserDto as any).password;
    delete (updateUserDto as any).role;
    delete (updateUserDto as any).username;
    delete (updateUserDto as any).id;

    return this.usersService.updateProfile(+id, updateUserDto);
  }
}