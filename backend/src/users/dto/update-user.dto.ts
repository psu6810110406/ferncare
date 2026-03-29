import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator'; // 🌟 1. นำเข้าตัวตรวจสอบ

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // 🌟 2. เพิ่มฟิลด์นี้เข้าไป เพื่อบอกด่านตรวจว่า "อนุญาตให้รับรูปภาพ Base64 ผ่านเข้ามาได้เลยนะ"
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}