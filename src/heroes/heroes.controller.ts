import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { AllHeroes, Hero } from './interfaces/heroes.interface';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllHeroes(@Req() req: Request): Promise<AllHeroes> {
    try {
      if (req.isAuthorized) {
        return await this.heroesService.getAllHeroesWithProfiles();
      }
      return await this.heroesService.getAllHeroes();
    } catch (err) {
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':heroId')
  @UseGuards(AuthGuard)
  async getHeroById(
    @Req() req: Request,
    @Param('heroId') heroId: string,
  ): Promise<Hero> {
    try {
      if (req.isAuthorized) {
        return await this.heroesService.getHeroWithProfilesById(heroId);
      }
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
