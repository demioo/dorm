import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('text')
  password!: string;

  @BeforeInsert()
  addId(): void {
    this.id = uuid();
  }
}
