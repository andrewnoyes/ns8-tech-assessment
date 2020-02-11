import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

import { EventService, UserService } from './services';
import { Event } from './interfaces';

@Controller()
export class AppController {
  public constructor(
    private readonly _eventService: EventService,
    private readonly _userService: UserService,
  ) {}

  @Post('users')
  public createUser(
    @Body() body: { email: string; password: string; phone?: string },
  ): string {
    const { email, password, phone } = body;

    return this._userService.createUser(email, password, phone);
  }

  @Post('users/:userId/events')
  public createEvent(
    @Param('userId') userId: string,
    @Body() body: { type: string },
  ): string {
    return this._eventService.createEvent(body.type, userId);
  }

  @Get('users/:userId/events')
  public getUserEvents(@Param('userId') userId: string): Event[] {
    return this._eventService.getEventsByUser(userId);
  }

  @Get('events')
  public getEvents(@Query() query?: { days: number }): Event[] {
    if (query.days) {
      return this._eventService.getEventsByPastDays(
        // TODO: Nest keeps turning `days` into a string >_< might need to have query type definitions in a class
        Number.parseInt(query.days as any),
      );
    }

    return this._eventService.getAllEvents();
  }
}
