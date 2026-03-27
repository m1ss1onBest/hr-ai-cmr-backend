import { Module } from '@nestjs/common';
import { HandlerLogger } from './handler-logger.service';

@Module({
  imports: [],
  exports: [HandlerLogger],
  providers: [HandlerLogger],
})
export class ServicesModule {}
