import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) successfully', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'andrew@noyes.io', password: 'super-secret-123' })
      .expect(201)
      .expect('1');
  });

  it('/users/:userId/events (POST) fail when user not found', () => {
    return request(app.getHttpServer())
      .post('/users/123/events')
      .send({ type: 'LOGIN' })
      .expect(404);
  });

  it('/users/:userId/events (GET) fail when user not found', () => {
    return request(app.getHttpServer())
      .get('/users/123/events')
      .expect(404);
  });

  it('/events (GET) successfully', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect([]);
  });
});
