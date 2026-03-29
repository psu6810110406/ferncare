import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  UseGuards, 
  Request as NestRequest,
  ForbiddenException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; 

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

  @Get()
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('make-admin/:id')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(+id); 
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get(':id')
  async getProfile(@Param('id') id: string, @NestRequest() req: Request) {
    const userIdFromToken = (req.user as any).userId;
    
    if (userIdFromToken !== +id) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลของผู้อื่น');
    }

    return this.usersService.findOneById(+id);
  }

  // 🌟 API เส้นนี้จะรับผิดชอบการอัปเดตข้อมูล "ทั้งหมด" รวมถึงรูปโปรไฟล์ Base64 ด้วย
  @UseGuards(AuthGuard('jwt')) 
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto, 
    @NestRequest() req: Request
  ) {
    const userIdFromToken = (req.user as any).userId;
    
    if (userIdFromToken !== +id) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น');
    }

    // ลบข้อมูลสำคัญทิ้ง ป้องกันคนแฮ็กยัดข้อมูลมาเปลี่ยนสิทธิ์ตัวเอง
    delete (updateUserDto as any).password;
    delete (updateUserDto as any).role;
    delete (updateUserDto as any).username;
    delete (updateUserDto as any).id;

    // 🌟 ส่งข้อมูลที่เหลือ (รวมถึง profileImageUrl ที่เป็นตัวอักษร Base64) ไปให้ Service เซฟลง Database
    return this.usersService.updateProfile(+id, updateUserDto);
  }
}