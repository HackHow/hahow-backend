import { Module } from '@nestjs/common';
import { HeroesModule } from './heroes/heroes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HeroesModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
