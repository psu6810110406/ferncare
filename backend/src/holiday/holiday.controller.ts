// src/holiday/holiday.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto'; 

@Controller('admin/holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  findAll() {
    return this.holidayService.findAll();
  }

  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    // 🌟 แก้ตรงนี้: โยน createHolidayDto ไปทั้งก้อนเลยครับ ไม่ต้องแกะทีละฟิลด์แล้ว
    return this.holidayService.create(createHolidayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayService.remove(id);
  }
}