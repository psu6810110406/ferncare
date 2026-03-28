import { Repository } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private readonly bookingRepository;
    constructor(bookingRepository: Repository<BookingEntity>);
    findAll(): Promise<BookingEntity[]>;
    create(createBookingDto: CreateBookingDto): Promise<BookingEntity>;
    findMyBookings(userId: number): Promise<BookingEntity[]>;
    checkAvailability(date: string, timeSlot: string): Promise<boolean>;
    remove(id: number): Promise<void>;
}
