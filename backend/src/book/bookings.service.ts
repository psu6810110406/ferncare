import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async findAll(): Promise<BookingEntity[]> {
    return this.bookingRepository.find({
      order: { id: 'DESC' },
    });
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const booking = this.bookingRepository.create(createBookingDto);
    return this.bookingRepository.save(booking);
  }

  // --- เพิ่มฟังก์ชันตรวจสอบคิวว่างตรงนี้ครับ ---
  async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
    const existingBooking = await this.bookingRepository.findOne({
      where: [
        { date: date, timeSlot: timeSlot }, // กรณีที่ 1: ชนกับเวลาที่เลือกเป๊ะๆ
        { date: date, timeSlot: 'fullday' } // กรณีที่ 2: วันนั้นมีคนจองแบบเหมา "เต็มวัน" ไปแล้ว
      ]
    });

    // ถ้า existingBooking มีค่า (หาเจอในฐานข้อมูล) แปลว่า ไม่ว่าง (return false)
    // ถ้า existingBooking เป็น null (หาไม่เจอ) แปลว่า ว่าง (return true)
    return !existingBooking;
  }
}