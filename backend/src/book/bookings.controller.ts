import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingsService } from '../book/bookings.service';
import { CreateBookingDto } from '../book/dto/create-booking.dto';
import { BookingEntity } from './booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAllBookings(): Promise<BookingEntity[]> {
    return this.bookingsService.findAll();
  }

  @Post()
  async createBooking(@Body() bookingData: CreateBookingDto): Promise<BookingEntity> {
    return this.bookingsService.create(bookingData);
  }
}
