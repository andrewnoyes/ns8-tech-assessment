import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { EventService, UserService } from './services';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [UserService, EventService],
})
export class AppModule {}
