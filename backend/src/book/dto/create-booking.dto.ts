import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  timeSlot: string;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  hospitalName: string;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsNumber()
  @IsNotEmpty()
  patientAge: number;

  @IsString()
  @IsNotEmpty()
  mobilityStatus: string;

  @IsString()
  @IsNotEmpty()
  relativeName: string;

  @IsString()
  @IsNotEmpty()
  relativePhone: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;

  // 🌟 เพิ่มฟิลด์ใหม่ 4 ตัวที่เราเพิ่งทำใน Frontend ลงไปตรงนี้ครับ
  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsString()
  @IsOptional()
  allergies?: string;
}