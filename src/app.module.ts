import { Module } from '@nestjs/common';
import { HeroesModule } from './heroes/heroes.module';

@Module({
  imports: [HeroesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
