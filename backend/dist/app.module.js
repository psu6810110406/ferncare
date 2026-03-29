"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bookings_controller_1 = require("./book/bookings.controller");
const bookings_service_1 = require("./book/bookings.service");
const booking_entity_1 = require("./book/entities/booking.entity");
const bookings_cron_1 = require("./book/bookings.cron");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./users/entities/user.entity");
const holiday_module_1 = require("./holiday/holiday.module");
const holiday_entity_1 = require("./holiday/entities/holiday.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'admin',
                password: 'password123',
                database: 'ferncare',
                entities: [booking_entity_1.BookingEntity, user_entity_1.User, holiday_entity_1.Holiday],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.BookingEntity]),
            schedule_1.ScheduleModule.forRoot(),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            holiday_module_1.HolidayModule,
        ],
        controllers: [app_controller_1.AppController, bookings_controller_1.BookingsController],
        providers: [
            app_service_1.AppService,
            bookings_service_1.BookingsService,
            bookings_cron_1.BookingsCronService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map