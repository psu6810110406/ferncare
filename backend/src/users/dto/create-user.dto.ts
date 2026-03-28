import { UserRole } from '../entities/user.entity';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  role?: UserRole; // ใส่ ? แปลว่าไม่ส่งมาก็ได้ (ถ้าไม่ส่งมาจะถูกตั้งเป็น USER อัตโนมัติจาก Entity)

  // 🌟 --- ข้อมูลโปรไฟล์ที่เพิ่มเข้ามาใหม่ --- 🌟
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  congenitalDisease?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  defaultMobilityStatus?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;
}