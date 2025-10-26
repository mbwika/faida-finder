import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Document } from '../entities/document.entity';
import { Topic } from '../entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Topic])],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
