"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const holiday_entity_1 = require("./entities/holiday.entity");
let HolidayService = class HolidayService {
    holidayRepository;
    constructor(holidayRepository) {
        this.holidayRepository = holidayRepository;
    }
    async findAll() {
        return this.holidayRepository.find({
            order: { startDate: 'ASC' },
        });
    }
    async create(createHolidayDto) {
        const newHoliday = this.holidayRepository.create({
            ...createHolidayDto,
            reason: createHolidayDto.reason || ''
        });
        return this.holidayRepository.save(newHoliday);
    }
    async remove(id) {
        const holiday = await this.holidayRepository.findOne({ where: { id } });
        if (!holiday) {
            throw new common_1.NotFoundException('ไม่พบข้อมูลวันหยุดที่ต้องการลบ');
        }
        await this.holidayRepository.remove(holiday);
        return { message: 'ลบวันหยุดเรียบร้อยแล้ว' };
    }
    async isHoliday(date) {
        const holidays = await this.holidayRepository.find();
        for (const holiday of holidays) {
            if (holiday.isRecurring) {
                const bookingMD = date.substring(5);
                const holidayStartMD = holiday.startDate.substring(5);
                const holidayEndMD = holiday.endDate.substring(5);
                if (bookingMD >= holidayStartMD && bookingMD <= holidayEndMD) {
                    return true;
                }
            }
            else {
                if (date >= holiday.startDate && date <= holiday.endDate) {
                    return true;
                }
            }
        }
        return false;
    }
};
exports.HolidayService = HolidayService;
exports.HolidayService = HolidayService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HolidayService);
//# sourceMappingURL=holiday.service.js.map