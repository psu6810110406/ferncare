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
var BookingsCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
let BookingsCronService = BookingsCronService_1 = class BookingsCronService {
    bookingRepo;
    logger = new common_1.Logger(BookingsCronService_1.name);
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }
    async autoCompletePastBookings() {
        this.logger.log('เริ่มตรวจสอบคิวที่ตกค้างเพื่อเปลี่ยนสถานะเป็น completed...');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        const overdueBookings = await this.bookingRepo.find({
            where: {
                status: 'confirmed',
                date: (0, typeorm_2.LessThan)(yesterdayString),
            },
        });
        if (overdueBookings.length > 0) {
            for (const booking of overdueBookings) {
                booking.status = 'completed';
                await this.bookingRepo.save(booking);
            }
            this.logger.log(`อัปเดตสถานะอัตโนมัติสำเร็จจำนวน ${overdueBookings.length} รายการ`);
        }
        else {
            this.logger.log('ไม่มีคิวตกค้างที่ต้องอัปเดต');
        }
    }
};
exports.BookingsCronService = BookingsCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsCronService.prototype, "autoCompletePastBookings", null);
exports.BookingsCronService = BookingsCronService = BookingsCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.BookingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingsCronService);
//# sourceMappingURL=bookings.cron.js.map