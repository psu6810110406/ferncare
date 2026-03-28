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
}