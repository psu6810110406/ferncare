// src/book/bookings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
// 🌟 1. Import HolidayService เข้ามา
import { HolidayService } from '../holiday/holiday.service'; 

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    // 🌟 2. Inject HolidayService เข้ามาใน Constructor
    private readonly holidayService: HolidayService, 
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
      where: { userId: userId },
      order: { id: 'DESC' },
    });
  }

  // --- 🌟 อัปเดตฟังก์ชันตรวจสอบคิวว่างที่นี่ครับ ---
  async checkAvailability(date: string, timeSlot: string): Promise<boolean> {
    
    // 🌟 3. เช็คก่อนเป็นอันดับแรก: วันนี้ตรงกับวันหยุดที่แอดมินตั้งไว้หรือไม่?
    const isHoliday = await this.holidayService.isHoliday(date);
    if (isHoliday) {
      // ถ้าเป็นวันหยุด คืนค่า false ทันที (บอกระบบว่า "ไม่ว่าง")
      return false; 
    }

    // --- ถ้าไม่ใช่วันหยุด ค่อยมาเช็คคิวปกติของคุณ ---
    // 1. ดึงคิวของ "วันที่เลือก" ที่ "ไม่ได้ถูกยกเลิก" ออกมาทั้งหมด
    const bookingsOnDate = await this.bookingRepository.find({
      where: { 
        date: date,
        status: Not('cancelled') // มองข้ามคิวที่โดนยกเลิกไปแล้ว จะได้จองทับได้
      }
    });

    // ถ้าไม่มีคิวในระบบเลย = ว่างแน่นอน 100%
    if (bookingsOnDate.length === 0) {
      return true;
    }

    // 2. เช็คเงื่อนไขการชนกันของเวลา (Overlap)
    let isConflict = false;

    if (timeSlot === 'fullday') {
      // กรณีลูกค้าอยากจอง "เต็มวัน"
      isConflict = bookingsOnDate.length > 0;
    } 
    else if (timeSlot === 'morning') {
      // กรณีลูกค้าอยากจอง "เช้า"
      isConflict = bookingsOnDate.some(b => b.timeSlot === 'morning' || b.timeSlot === 'fullday');
    } 
    else if (timeSlot === 'afternoon') {
      // กรณีลูกค้าอยากจอง "บ่าย"
      isConflict = bookingsOnDate.some(b => b.timeSlot === 'afternoon' || b.timeSlot === 'fullday');
    }

    return !isConflict;
  }

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  async findOne(id: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    
    if (!booking) {
      throw new NotFoundException(`ไม่พบข้อมูลการจองรหัส ${id}`);
    }
    
    return booking;
  }

  async updateBooking(id: number, updateData: any): Promise<BookingEntity> {
    await this.bookingRepository.update(id, updateData);
    return this.findOne(id);
  }
}