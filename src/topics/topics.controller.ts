import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topics: TopicsService) {}

  @Get()
  getTopics() {
    return this.topics.getTopics();
  }

  @Post(':id/ask')
  ask(@Param('id') id: string, @Body('question') question: string) {
    if (!question)
      return { error: 'Please provide a question in the request body.' };
    const res = this.topics.ask(id, question);
    return res;
  }
}
