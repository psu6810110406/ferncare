import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
export declare class HolidayController {
    private readonly holidayService;
    constructor(holidayService: HolidayService);
    findAll(): Promise<import("./entities/holiday.entity").Holiday[]>;
    create(createHolidayDto: CreateHolidayDto): Promise<import("./entities/holiday.entity").Holiday>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
