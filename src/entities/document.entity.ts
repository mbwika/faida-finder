import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Topic } from './topic.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Topic, (t) => t.documents, { onDelete: 'CASCADE' })
  topic: Topic;

  @Column('text')
  text: string;

  @Column({ type: 'datetime', nullable: true })
  fetchedAt?: Date;

  @Column({ default: 0 })
  rank?: number;
}
