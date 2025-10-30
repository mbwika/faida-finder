import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { Topic } from '../entities/topic.entity';

type TopicConfig = {
  id: string;
  name: string;
  urls: string[]; // internal only
  suggestedQuestions: string[];
};

@Injectable()
export class TopicsService implements OnModuleInit {
  private readonly logger = new Logger(TopicsService.name);
  private readonly topics: TopicConfig[] = [
    {
      id: 'nssf',
      name: 'NSSF Benefits & Grants',
      urls: ['https://www.nssf.or.ke/benefits'],
      suggestedQuestions: [
        'Age/Retirement Benefit',
        'Withdrawal Benefit',
        'Survivors Benefit',
        'Invalidity Benefit',
        'Emigration Benefit',
      ],
    },
    {
      id: 'disability',
      name: 'Disability Services',
      urls: [
        'https://www.kenyadisabilityresource.org/Kenya-Government-Disability-Services',
        'https://ncpwd.go.ke/',
      ],
      suggestedQuestions: [
        'Government policies, procedures and practices regarding disability services, benefits and grants',
        'Assistive devices',
        'Economic empowerment',
        'Education assistance',
        'Infrastructure and Equipment Grants',
        'Cash Transfer',
        'Albinism Sunscreen and Support Program',
        'Legal Advisory Services',
      ],
    },
    {
      id: 'inua',
      name: 'Inua Jamii (Social Protection)',
      urls: [
        'https://www.socialprotection.go.ke/services-dsa',
        'https://www.socialprotection.go.ke/services-dsd',
        'https://www.socialprotection.go.ke/services-nsps',
      ],
      suggestedQuestions: [
        'The Older Persons Cash Transfer Programme (OP-CT)',
        'The Person with Severe Disability Cash Transfer Programme (PwSD-CT)',
        '1533 Toll free Line',
        'KSEIP -Economic Inclusion Programme (EIP)',
        'Community Group Registration',
        'Social Risk and Impact Management',
        'Vocational Rehabilitation Centres',
        "Kenya's Single Registry",
        'Universal Child Benefit (UCB)',
      ],
    },
  ];

  // in-memory cache for quick access
  private readonly cache = new Map<string, string[]>();

  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'Initializing TopicsService and scraping configured URLs...',
    );

    // ensure topics exist in DB
    for (const t of this.topics) {
      let rec = await this.topicRepo.findOneBy({ key: t.id });
      if (!rec) {
        rec = this.topicRepo.create({ key: t.id, name: t.name });
        await this.topicRepo.save(rec);
      }
    }

    // perform initial scrape in background (don't block boot too long)
    for (const t of this.topics) {
      this.scrapeTopic(t).catch((err) =>
        this.logger.warn('Initial scrape failed: ' + String(err)),
      );
    }

    this.logger.log('TopicsService initialization scheduled scrapes.');
  }

  getTopics() {
    return this.topics.map((t) => ({
      id: t.id,
      name: t.name,
      suggestedQuestions: t.suggestedQuestions,
    }));
  }

  // Synchronous interface: returns best-matching blocks from DB cache
  ask(topicId: string, question: string) {
    const docs = this.cache.get(topicId) ?? [];
    if (docs.length === 0)
      return {
        answer: 'No information available for that topic yet.',
        referencesCount: 0,
      };

    const words = question
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean);

    const scored = docs
      .map((text) => {
        const lc = text.toLowerCase();
        let score = 0;
        for (const w of words) if (lc.includes(w)) score++;
        return { text, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      const fallback = docs.slice(0, 3).join('\n\n');
      return {
        answer: fallback || 'No relevant information found.',
        referencesCount: docs.length,
      };
    }

    const top = scored
      .slice(0, 3)
      .map((s) => s.text)
      .join('\n\n');
    return { answer: top, referencesCount: scored.length };
  }

  // Re-scrape a single topic and update DB and cache
  async refreshTopic(topicId: string) {
    const cfg = this.topics.find((t) => t.id === topicId);
    if (!cfg) throw new Error('Unknown topic');
    await this.scrapeTopic(cfg, { persist: true });
    return { refreshed: true };
  }

  private async scrapeTopic(topic: TopicConfig, opts?: { persist?: boolean }) {
    const blocks: string[] = [];
    for (const url of topic.urls) {
      try {
        const res = await axios.get(url, {
          timeout: 10_000,
          headers: { 'User-Agent': 'faida-finder-bot/1.0' },
        });
        const html = res.data as string;
        const $ = cheerio.load(html);
        const texts: string[] = [];
        $('h1,h2,h3,h4,p,li').each((_, el) => {
          const t = $(el).text().trim();
          if (t.length > 40) texts.push(t);
        });
        blocks.push(...texts);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Failed to scrape ${url}: ${msg}`);
      }
    }

    // save to cache
    this.cache.set(topic.id, blocks);

    if (opts?.persist) {
      // persist to DB: clear old docs for topic and insert new ones
      const topicRec = await this.topicRepo.findOneBy({ key: topic.id });
      if (!topicRec) return;
      // delete old docs by topic foreign key column (topicId)
      await this.docRepo
        .createQueryBuilder()
        .delete()
        .where('topicId = :id', { id: topicRec.id })
        .execute();
      for (const t of blocks) {
        const doc = this.docRepo.create({
          topic: topicRec,
          text: t,
          fetchedAt: new Date(),
        });
        await this.docRepo.save(doc);
      }
    }
  }
}
