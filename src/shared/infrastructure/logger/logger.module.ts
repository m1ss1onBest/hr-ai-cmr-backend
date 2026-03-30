import { Module } from '@nestjs/common';
import { EventHandlerLogger } from './handler-logger.service';

@Module({
  imports: [],
  exports: [EventHandlerLogger],
  providers: [EventHandlerLogger],
})
export class LoggerModule {}
