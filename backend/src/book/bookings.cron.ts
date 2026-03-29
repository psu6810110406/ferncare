import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingsCronService {
  private readonly logger = new Logger(BookingsCronService.name);

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  // 🌟 ฟังก์ชันนี้จะทำงานอัตโนมัติ ทุกๆ เที่ยงคืน
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoCompletePastBookings() {
    this.logger.log('เริ่มตรวจสอบคิวที่ตกค้างเพื่อเปลี่ยนสถานะเป็น completed...');
    
    // หาวันที่ของเมื่อวาน (แปลงเป็น YYYY-MM-DD แบบง่ายๆ)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    // ค้นหาคิวที่สถานะยังเป็น 'confirmed' และวันที่นัดหมายผ่านไปแล้ว
    const overdueBookings = await this.bookingRepo.find({
      where: {
        status: 'confirmed',
        date: LessThan(yesterdayString), // หาวันที่น้อยกว่าเมื่อวาน
      },
    });

    if (overdueBookings.length > 0) {
      for (const booking of overdueBookings) {
        booking.status = 'completed';
        await this.bookingRepo.save(booking);
      }
      this.logger.log(`อัปเดตสถานะอัตโนมัติสำเร็จจำนวน ${overdueBookings.length} รายการ`);
    } else {
      this.logger.log('ไม่มีคิวตกค้างที่ต้องอัปเดต');
    }
  }
}