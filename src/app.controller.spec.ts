import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AppController } from './app.controller';
import { EventService, UserService } from './services';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [EventService, UserService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('users', () => {
    it('should return ID 1 after creating the user', () => {
      expect(
        appController.createUser({
          email: 'andrew@noyes.io',
          password: 'blahblah',
        }),
      ).toBe('1');
    });

    it('should throw when email is empty', () => {
      expect(() =>
        appController.createUser({
          email: '',
          password: 'blahblah',
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw when password is empty', () => {
      expect(() =>
        appController.createUser({
          email: 'andrew@noyes.io',
          password: '',
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw when phone number is invalid', () => {
      expect(() =>
        appController.createUser({
          email: 'andrew@noyes.io',
          password: 'blahblah',
          phone: '123',
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw when email already in use', () => {
      appController.createUser({
        email: 'andrew@noyes.io',
        password: 'first-user',
      });
      expect(() =>
        appController.createUser({
          email: 'andrew@noyes.io',
          password: 'second-user',
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('events', () => {
    let userId: string = '';
    beforeEach(async () => {
      userId = appController.createUser({
        email: 'andrew@noyes.io',
        password: 'blahblah',
      });
    });

    it('should return number 1 as event ID after creating', () => {
      expect(appController.createEvent(userId, { type: 'LOGIN' })).toBe('1');
    });

    it('should throw when event type is empty', () => {
      expect(() => appController.createEvent(userId, { type: '' })).toThrow(
        BadRequestException,
      );
    });

    it('should throw not found  when user does not exist when trying to create', () => {
      expect(() => appController.createEvent('123', { type: 'LOGIN' })).toThrow(
        NotFoundException,
      );
    });

    it('should throw not found when user does not exist when trying to get events', () => {
      expect(() => appController.getUserEvents('123')).toThrow(
        NotFoundException,
      );
    });

    it('should return the events created by the user', () => {
      appController.createEvent(userId, { type: 'LOGIN' });
      expect(appController.getUserEvents(userId).length).toBe(1);
    });

    it('should return all events within past day', () => {
      appController.createEvent(userId, { type: 'LOGIN' });
      expect(appController.getEvents({ days: 1 }).length).toBe(1);
    });

    it('should throw if past day is <= 0', () => {
      expect(() => appController.getEvents({ days: -5 })).toThrow(
        BadRequestException,
      );
    });
  });
});
