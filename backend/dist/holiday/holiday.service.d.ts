import { Repository } from 'typeorm';
import { Holiday } from './entities/holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
export declare class HolidayService {
    private readonly holidayRepository;
    constructor(holidayRepository: Repository<Holiday>);
    findAll(): Promise<Holiday[]>;
    create(createHolidayDto: CreateHolidayDto): Promise<Holiday>;
    remove(id: string): Promise<{
        message: string;
    }>;
    isHoliday(date: string): Promise<boolean>;
}
