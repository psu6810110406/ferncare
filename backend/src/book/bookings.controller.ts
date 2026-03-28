import { Controller, Get, Post, Body, Query, Delete, Param, Patch, UseGuards, Request as NestRequest } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express'; // ใช้ Request จาก express สำหรับ Type
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  // ✅ ใช้ UseGuards และระบุ Type ให้ req: Request
  @UseGuards(AuthGuard('jwt')) 
  @Post()
  async create(@NestRequest() req: Request, @Body() createBookingDto: CreateBookingDto) {
    // ใช้ as any เพื่อดึง userId จาก user object ที่ Passport ยัดใส่มาให้
    const user = req.user as any;
    const userId = user.userId; 
    
    const bookingDataToSave = {
      ...createBookingDto,
      userId: userId,
    };
    
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

  // ✅ ดึงเฉพาะการจองของตัวเอง
  @UseGuards(AuthGuard('jwt'))
  @Get('my-bookings')
  async getMyBookings(@NestRequest() req: Request) {
    const user = req.user as any;
    const userId = user.userId; 
    return this.bookingsService.findMyBookings(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(+id);
    return { message: 'ลบข้อมูลสำเร็จเรียบร้อย' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() updateData: any) {
    return this.bookingsService.updateBooking(+id, updateData);
  }
}