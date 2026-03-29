import { Repository } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HolidayService } from '../holiday/holiday.service';
export declare class BookingsService {
    private readonly bookingRepository;
    private readonly holidayService;
    constructor(bookingRepository: Repository<BookingEntity>, holidayService: HolidayService);
    findAll(): Promise<BookingEntity[]>;
    create(createBookingDto: CreateBookingDto): Promise<BookingEntity>;
    findMyBookings(userId: number): Promise<BookingEntity[]>;
    checkAvailability(date: string, timeSlot: string): Promise<boolean>;
    remove(id: number): Promise<void>;
    findOne(id: number): Promise<BookingEntity>;
    updateBooking(id: number, updateData: any): Promise<BookingEntity>;
}
