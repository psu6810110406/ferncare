import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  username: string;
  password: string;
  role?: UserRole; // ใส่ ? แปลว่าไม่ส่งมาก็ได้ (ถ้าไม่ส่งมาจะถูกตั้งเป็น USER อัตโนมัติจาก Entity)
}