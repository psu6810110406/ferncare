import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bookings') // ชื่อตารางใน Database
export class BookingEntity { // ใช้ชื่อ BookingEntity ให้ตรงกับ Service ของคุณ
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number; // เก็บ ID ของคนที่ล็อกอิน

  // --- 2 ตัวนี้คือตัวที่ทำให้เกิด Error ถ้าไม่มีครับ ---
  @Column()
  date: string; // เก็บวันที่

  @Column()
  timeSlot: string; // เก็บช่วงเวลา
  // ----------------------------------------

  @Column({ nullable: true })
  pickupAddress: string;

  @Column({ nullable: true })
  hospitalName: string;

  @Column({ nullable: true })
  patientName: string;

  @Column({ nullable: true })
  patientAge: number;

  @Column({ nullable: true })
  mobilityStatus: string;

  @Column({ nullable: true })
  relativeName: string;

  @Column({ nullable: true })
  relativePhone: string;

  @Column({ type: 'text', nullable: true })
  additionalNotes: string;

  @Column({ default: 'pending' }) 
  status: string; // สถานะคิว เช่น pending, confirmed, cancelled

  @CreateDateColumn()
  createdAt: Date;
}