// src/holiday/dto/create-holiday.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty({ message: 'กรุณาระบุวันที่เริ่มต้น' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'รูปแบบวันที่เริ่มต้นต้องเป็น YYYY-MM-DD' })
  startDate: string;

  @IsNotEmpty({ message: 'กรุณาระบุวันที่สิ้นสุด' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'รูปแบบวันที่สิ้นสุดต้องเป็น YYYY-MM-DD' })
  endDate: string;

  @IsBoolean()
  isAllDay: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  // 🌟 เพิ่มฟิลด์นี้: เพื่อรองรับการตั้งค่า "ทำซ้ำทุกปี"
  @IsOptional()
  @IsBoolean({ message: 'ค่าการทำซ้ำต้องเป็น true หรือ false' })
  isRecurring?: boolean;
}