import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Topic } from '../entities/topic.entity';
import { Document } from '../entities/document.entity';
import { Repository } from 'typeorm';

describe('TopicsService', () => {
  let service: TopicsService;
  let topicRepository: Repository<Topic>;
  let documentRepository: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: getRepositoryToken(Topic),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Document),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    topicRepository = module.get<Repository<Topic>>(getRepositoryToken(Topic));
    documentRepository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have topic repository injected', () => {
    expect(topicRepository).toBeDefined();
  });

  it('should have document repository injected', () => {
    expect(documentRepository).toBeDefined();
  });
});