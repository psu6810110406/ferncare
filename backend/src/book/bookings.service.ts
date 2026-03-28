import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findMyBookings(userId: number): Promise<BookingEntity[]> {
    return this.bookingRepository.find({
      where: { userId: userId }, // หาเฉพาะคิวที่เป็นของ User คนนี้
      order: { id: 'DESC' }, // เรียงจากคิวที่จองล่าสุดขึ้นก่อน
    });
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

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  async findOne(id: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    
    // ถ้าหาไม่เจอ ให้โยน Error 404 Not Found กลับไป
    if (!booking) {
      throw new NotFoundException(`ไม่พบข้อมูลการจองรหัส ${id}`);
    }
    
    return booking;
  }

  async updateBooking(id: number, updateData: any): Promise<BookingEntity> {
    await this.bookingRepository.update(id, updateData);
    return this.findOne(id); // คืนค่าข้อมูลที่อัปเดตแล้วกลับไป
  }
}