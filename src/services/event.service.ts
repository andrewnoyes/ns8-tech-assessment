import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { Event } from '../interfaces';
import { unixTimestamp } from '../utils';
import { UserService } from './user.service';

@Injectable()
export class EventService {
  private readonly _events: Event[] = [];

  public constructor(private readonly _userService: UserService) {}

  /**
   * Gets all events created by the user.
   * @param userId - ID of the user
   */
  public getEventsByUser(userId: string): Event[] {
    this.validateUserAndThrow(userId);
    return this._events.filter(e => e.userId === userId);
  }

  /**
   * Gets a collection of all the events.
   */
  public getAllEvents(): Event[] {
    return [...this._events];
  }

  /**
   * Gets a collection of events created in the past number of days.
   * @param days - Number of past days to retrieve events for
   */
  public getEventsByPastDays(days: number = 1): Event[] {
    if (!Number.isInteger(days) || days <= 0) {
      throw new BadRequestException('Days must be an integer greater than 0');
    }

    const now = new Date();
    now.setDate(now.getDate() - days);
    const unixTs = unixTimestamp(now);

    return this._events.filter(e => e.created >= unixTs);
  }

  /**
   * Creates a new event and returns its ID if successful.
   * @param type - Type of event, eg LOGIN
   * @param userId - ID of the user who created the event
   */
  public createEvent(type: string, userId: string): string {
    const trimmed = type && type.trim();
    if (!trimmed) {
      throw new BadRequestException('Type cannot be empty');
    }

    this.validateUserAndThrow(userId);

    const id = (this._events.length + 1).toString();
    this._events.push({
      id,
      created: unixTimestamp(),
      type: trimmed,
      userId,
    });

    return id;
  }

  private validateUserAndThrow(userId: string) {
    if (!this._userService.userExists(userId)) {
      throw new NotFoundException('User not found');
    }
  }
}
