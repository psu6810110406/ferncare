import { Repository } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';
export declare class BookingsCronService {
    private readonly bookingRepo;
    private readonly logger;
    constructor(bookingRepo: Repository<BookingEntity>);
    autoCompletePastBookings(): Promise<void>;
}
