import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // e.g., 'nssf'

  @Column()
  name: string;

  @OneToMany(() => Document, (d) => d.topic, { cascade: true })
  documents: Document[];
}
