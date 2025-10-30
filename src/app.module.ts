import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TopicsModule } from "./topics/topics.module";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Document } from "./entities/document.entity";
import { Topic } from "./entities/topic.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      entities: [Document, Topic],
      synchronize: true,
    }),
    TopicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
