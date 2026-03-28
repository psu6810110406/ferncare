import type { Request } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(): Promise<import("./entities/booking.entity").BookingEntity[]>;
    create(req: Request, createBookingDto: CreateBookingDto): Promise<import("./entities/booking.entity").BookingEntity>;
    checkAvailability(date: string, timeSlot: string): Promise<{
        isAvailable: boolean;
    }>;
    getMyBookings(req: Request): Promise<import("./entities/booking.entity").BookingEntity[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<import("./entities/booking.entity").BookingEntity>;
    updateBooking(id: string, updateData: any): Promise<import("./entities/booking.entity").BookingEntity>;
}
