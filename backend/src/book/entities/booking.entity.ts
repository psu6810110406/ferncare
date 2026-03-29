import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bookings') // ชื่อตารางใน Database
export class BookingEntity { // ใช้ชื่อ BookingEntity ให้ตรงกับ Service ของคุณ
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number; // เก็บ ID ของคนที่ล็อกอิน

  @Column()
  date: string; // เก็บวันที่

  @Column()
  timeSlot: string; // เก็บช่วงเวลา

  @Column({ nullable: true })
  pickupAddress: string;

  @Column({ nullable: true })
  hospitalName: string;

  @Column({ nullable: true })
  patientName: string;

  @Column({ nullable: true })
  patientAge: number;

  // 👇 🌟 เพิ่ม 4 ฟิลด์ใหม่ตรงนี้ครับ (ให้เป็น nullable: true ไว้ เผื่อบางคนไม่ได้กรอก) 👇
  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ nullable: true })
  bloodType: string;

  @Column({ nullable: true })
  allergies: string;
  // 👆 ---------------------------------------------------------------- 👆

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