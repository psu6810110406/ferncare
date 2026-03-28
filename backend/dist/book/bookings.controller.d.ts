import { BookingsService } from '../book/bookings.service';
import { CreateBookingDto } from '../book/dto/create-booking.dto';
import { BookingEntity } from './booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    getAllBookings(): Promise<BookingEntity[]>;
    createBooking(bookingData: CreateBookingDto): Promise<BookingEntity>;
}
