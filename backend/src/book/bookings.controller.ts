import { Controller, Get, Post, Body, Query, Delete, Param, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  // 📝 แก้ไขฟังก์ชันนี้: เพิ่ม userId ลงไปตอนบันทึกข้อมูล
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    // กำหนด userId เป็น 1 ชั่วคราว (mock) เพื่อให้ตรงกับตอนดึง my-bookings
    const bookingDataToSave = {
      ...createBookingDto,
      userId: 1, 
    };
    
    // ส่งข้อมูลที่มี userId=1 ไปให้ Service บันทึกลงฐานข้อมูล
    return this.bookingsService.create(bookingDataToSave);
  }

  @Get('check-availability')
  async checkAvailability(
    @Query('date') date: string, 
    @Query('timeSlot') timeSlot: string
  ) {
    const isAvailable = await this.bookingsService.checkAvailability(date, timeSlot);
    return { isAvailable }; 
  }

  @Get('my-bookings')
  async getMyBookings() {
    // ตอนนี้จะหาเจอแล้ว เพราะตอนบันทึกเราเซฟเป็น userId = 1 แล้ว
    const mockUserId = 1; 
    return this.bookingsService.findMyBookings(mockUserId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // ใช้เครื่องหมาย + เพื่อแปลง id จากตัวอักษรเป็นตัวเลข
    await this.bookingsService.remove(+id);
    return { message: 'ลบข้อมูลสำเร็จเรียบร้อย' };
  }

  // --- API สำหรับดึงข้อมูล 1 รายการ ---
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  // --- API สำหรับอัปเดตข้อมูลทั่วไป ---
  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() updateData: any) {
    return this.bookingsService.updateBooking(+id, updateData);
  }
}