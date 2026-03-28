import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. ฟังก์ชันสมัครสมาชิก (ของเดิมที่คุณเขียนไว้)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username นี้ถูกใช้งานแล้ว');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: role || ('user' as any), // 🌟 เพิ่ม ('user' as any) เข้าไปตรงนี้ครับ
    });

    return this.usersRepository.save(newUser);
  }

  // 2. ฟังก์ชันหา user ด้วย username (เอาไว้ให้ระบบ Login ใช้)
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // --- 🌟 ส่วนที่เพิ่มใหม่สำหรับให้ Postman เรียกใช้ ---

  // 3. ฟังก์ชันดึง User ทั้งหมด
  async findAll(): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'role'] // ซ่อน password ไว้ ไม่ให้ใครดึงไปดูได้
    });
  }

  // 4. ฟังก์ชันเสก Admin
  async makeAdmin(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`หา User ID ${id} ไม่เจอครับ`);
    }

    // 🌟 แก้บรรทัดนี้: เติม as any เข้าไปครับ 🌟
    user.role = 'admin' as any; 
    
    await this.usersRepository.save(user);

    return { 
      message: `เสร็จสิ้น! เปลี่ยนบัญชี ${user.username} เป็น Admin แล้ว!`,
      user: { id: user.id, username: user.username, role: user.role }
    };
  }
}