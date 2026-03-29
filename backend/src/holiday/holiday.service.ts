// src/holiday/holiday.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm'; 
import { Holiday } from './entities/holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  // 1. ดึงวันหยุดทั้งหมด
  async findAll() {
    return this.holidayRepository.find({
      order: { startDate: 'ASC' },
    });
  }

  // 2. เพิ่มช่วงเวลาหยุดใหม่
  async create(createHolidayDto: CreateHolidayDto) { 
    const newHoliday = this.holidayRepository.create({ 
      ...createHolidayDto,
      reason: createHolidayDto.reason || '' 
    });
    
    return this.holidayRepository.save(newHoliday);
  }

  // 3. ลบวันหยุด
  async remove(id: string) {
    const holiday = await this.holidayRepository.findOne({ where: { id } });
    if (!holiday) {
      throw new NotFoundException('ไม่พบข้อมูลวันหยุดที่ต้องการลบ');
    }
    await this.holidayRepository.remove(holiday);
    return { message: 'ลบวันหยุดเรียบร้อยแล้ว' };
  }

  // 4. ฟังก์ชันตรวจสอบวันหยุด (อัปเกรดรองรับการทำซ้ำทุกปี)
  async isHoliday(date: string): Promise<boolean> {
    // 🌟 ดึงข้อมูลวันหยุดทั้งหมดมาตรวจสอบ
    const holidays = await this.holidayRepository.find();

    // ตรวจสอบทีละรายการ
    for (const holiday of holidays) {
      if (holiday.isRecurring) {
        // --- กรณีทำซ้ำทุกปี: เช็คเฉพาะ เดือน และ วัน ---
        // ตัดปีออก เช่น '2026-04-13' -> '04-13'
        const bookingMD = date.substring(5); 
        const holidayStartMD = holiday.startDate.substring(5);
        const holidayEndMD = holiday.endDate.substring(5);

        // เช็คว่า วัน/เดือน ที่จอง อยู่ในช่วง วัน/เดือน ของวันหยุดไหม
        if (bookingMD >= holidayStartMD && bookingMD <= holidayEndMD) {
          return true;
        }
      } else {
        // --- กรณีปกติ: เช็คแบบระบุปี (ตามเดิม) ---
        if (date >= holiday.startDate && date <= holiday.endDate) {
          return true;
        }
      }
    }

    return false; // ถ้าไม่ตรงกับเงื่อนไขไหนเลย แสดงว่าจองได้
  }
}