import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { Hero } from './interfaces/heroes.interface';

@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  async getAllHeroes(): Promise<{ heroes: Hero[] }> {
    try {
      return await this.heroesService.getAllHeroes();
    } catch (err) {
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':heroId')
  async getHeroById(@Param('heroId') heroId: string): Promise<Hero> {
    try {
      return await this.heroesService.getHeroById(heroId);
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      } else {
        throw new HttpException(
          'Unexpected error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
