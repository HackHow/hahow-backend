import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroesController } from './heroes/heroes.controller';
import { HeroesService } from './heroes/heroes.service';
import { HeroesModule } from './heroes/heroes.module';

@Module({
  imports: [HeroesModule],
  controllers: [AppController, HeroesController],
  providers: [AppService, HeroesService],
})
export class AppModule {}
