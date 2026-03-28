import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// ประกาศ Role ที่เราจะมีในระบบ
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users') // ตั้งชื่อตารางว่า users
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // ค่าเริ่มต้นให้เป็น user ธรรมดา
  })
  role: UserRole;

  // 🌟 --- ข้อมูลส่วนตัวพื้นฐาน --- 🌟
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  age: string; // เก็บเป็น string เผื่อกรอกเป็นข้อความ

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // 🏥 --- ข้อมูลด้านสุขภาพ (Health Information) --- 🏥
  @Column({ nullable: true })
  congenitalDisease: string; // โรคประจำตัว (เช่น เบาหวาน, ความดัน)

  @Column({ nullable: true })
  allergies: string; // ประวัติการแพ้ยา หรือ แพ้อาหาร

  @Column({ nullable: true })
  bloodType: string; // กรุ๊ปเลือด (เช่น A, B, O, AB)

  // ♿️ --- ข้อมูลด้านกายภาพ (Physical Info) --- ♿️
  @Column({ type: 'float', nullable: true })
  weight: number; // น้ำหนัก (กิโลกรัม) แนะนำเป็น number เพื่อเอาไปคำนวณง่ายๆ

  @Column({ type: 'float', nullable: true })
  height: number; // ส่วนสูง (เซนติเมตร)

  @Column({ nullable: true })
  defaultMobilityStatus: string; // การเคลื่อนไหว (เช่น walk, wheelchair, bedridden)

  // 📞 --- บุคคลติดต่อฉุกเฉิน (Emergency Contact) --- 📞
  @Column({ nullable: true })
  emergencyContactName: string; // ชื่อบุคคลติดต่อฉุกเฉิน

  @Column({ nullable: true })
  emergencyContactPhone: string; // เบอร์โทรศัพท์ฉุกเฉิน

  @Column({ nullable: true })
  emergencyContactRelation: string; // ความสัมพันธ์ (เช่น บิดา, มารดา, บุตร)
}