import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pickup: string;

  @Column()
  dropoff: string;

  @Column()
  time: string;

  @Column({ default: 'Pending' })
  status: string;
}
