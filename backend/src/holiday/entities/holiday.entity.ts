// src/holiday/entities/holiday.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('holidays') // ชื่อตารางใน Database
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  startDate: string; // เก็บวันเริ่มต้น (YYYY-MM-DD)

  @Column({ type: 'varchar' })
  endDate: string; // เก็บวันสิ้นสุด (YYYY-MM-DD)

  @Column({ type: 'boolean', default: true })
  isAllDay: boolean; // เช็คว่าหยุดทั้งวันไหม

  @Column({ type: 'varchar', nullable: true })
  startTime: string; // เวลาเริ่ม

  @Column({ type: 'varchar', nullable: true })
  endTime: string; // เวลาสิ้นสุด

  @Column({ type: 'varchar', nullable: true, default: '' })
  reason: string;

  // 🌟 เพิ่มคอลัมน์นี้: เพื่อเช็คว่าให้ทำซ้ำทุกปีหรือไม่
  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @CreateDateColumn()
  createdAt: Date;
}