import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryColumn({ length: 16 })
  id: string;

  @Column({ length: 1024 })
  originalUrl: string;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  expireAt: Date;
}
