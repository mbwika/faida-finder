import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

  // in-memory store: topicId -> array of scraped text blocks
  private readonly store = new Map<string, string[]>();

  async onModuleInit() {
    this.logger.log(
      'Initializing TopicsService and scraping configured URLs...',
    );
    await Promise.all(this.topics.map((t) => this.scrapeTopic(t)));
    this.logger.log('TopicsService initialization complete.');
  }

  getTopics() {
    // return only id, name and suggestedQuestions (do not expose URLs)
    return this.topics.map((t) => ({
      id: t.id,
      name: t.name,
      suggestedQuestions: t.suggestedQuestions,
    }));
  }

  ask(topicId: string, question: string) {
    const docs = this.store.get(topicId) ?? [];
    if (docs.length === 0)
      return {
        answer: 'No information available for that topic yet.',
        referencesCount: 0,
      };

    // Simple relevance: find text blocks containing the most words from the question
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
      // fallback: return a short combined summary (first 2 blocks)
      const fallback = docs.slice(0, 2).join('\n\n');
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

  private async scrapeTopic(topic: TopicConfig) {
    const blocks: string[] = [];
    for (const url of topic.urls) {
      try {
        const res = await axios.get(url, {
          timeout: 10_000,
          headers: { 'User-Agent': 'faida-finder-bot/1.0' },
        });
        const html = res.data as string;
        const $ = cheerio.load(html);
        // collect paragraphs and headings
        const texts: string[] = [];
        $('h1,h2,h3,h4,p,li').each((_, el) => {
          const t = $(el).text().trim();
          if (t.length > 50) texts.push(t);
        });
        // store as blocks
        blocks.push(...texts);
      } catch (err) {
        this.logger.warn(`Failed to scrape ${url}: ${(err as Error).message}`);
      }
    }
    this.store.set(topic.id, blocks);
  }
}
