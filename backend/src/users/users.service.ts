import { Injectable, ConflictException } from '@nestjs/common';
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

  // ปรับให้รับค่าเป็นก้อน Object (CreateUserDto) เพียง 1 argument
  async create(createUserDto: CreateUserDto): Promise<User> {
    // แตกค่าออกมาใช้งาน
    const { username, password, role } = createUserDto;

    // เช็คว่ามี username นี้ในระบบหรือยัง
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username นี้ถูกใช้งานแล้ว');
    }

    // เข้ารหัสผ่าน
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // สร้าง User ใหม่
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    // บันทึกลง Database
    return this.usersRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
}