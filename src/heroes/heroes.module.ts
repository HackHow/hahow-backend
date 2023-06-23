import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [HeroesController],
  providers: [HeroesService],
})
export class HeroesModule {}
