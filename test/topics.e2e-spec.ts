import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Topics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /topics returns configured topics', async () => {
    const res = await request(
      app.getHttpServer() as unknown as import('http').Server,
    )
      .get('/topics')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (Array.isArray(res.body)) {
      const found = res.body.some((t) => {
        if (t && typeof t === 'object') {
          const obj = t as Record<string, unknown>;
          return typeof obj['id'] === 'string' && obj['id'] === 'nssf';
        }
        return false;
      });
      expect(found).toBe(true);
    }
  });

  it('POST /topics/:id/refresh triggers a refresh', async () => {
    const res = await request(
      app.getHttpServer() as unknown as import('http').Server,
    ).post('/topics/nssf/refresh');
    // Accept either 200 or 201
    expect([200, 201]).toContain(res.status);
    // If body present, expect the refreshed flag
    if (res.body && typeof res.body === 'object') {
      const obj = res.body as Record<string, unknown>;
      expect(obj['refreshed']).toBeDefined();
    }
  });
});
