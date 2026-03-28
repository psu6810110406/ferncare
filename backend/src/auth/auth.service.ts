import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    // เช็ครหัสผ่านตอน Login ยังต้องใช้ bcrypt.compare อยู่เหมือนเดิม
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, pass: string) {
    // โยนข้อมูลเป็น Object ให้ตรงกับรูปแบบ CreateUserDto 
    // ที่ usersService.create() รอรับอยู่
    return this.usersService.create({
      username: username,
      password: pass,
    });
  }
}