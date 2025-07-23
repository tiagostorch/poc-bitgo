import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  bitgoId: string;

  @Column()
  label: string;

  @Column()
  coin: string;

  @CreateDateColumn()
  createdAt: Date;
}
