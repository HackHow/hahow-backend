import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface Hero {
  readonly id: number;
  readonly name: string;
  readonly image: number;
}

@Injectable()
export class HeroesService {
  private readonly hahowHeroesAPIUrl: string =
    'https://hahow-recruit.herokuapp.com/heroes';

  constructor(private readonly httpService: HttpService) {}

  async getAllHeroes(): Promise<{ heroes: Hero[] }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Hero[]>(this.hahowHeroesAPIUrl),
      );
      return { heroes: data };
    } catch (err) {
      console.error('getAllHeroes:', err.message);
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async getHeroById(heroId: string): Promise<Hero> {
    try {
      const hahowHeroAPIUrl = `${this.hahowHeroesAPIUrl}/${heroId}`;
      const { data } = await firstValueFrom(
        this.httpService.get<Hero>(hahowHeroAPIUrl),
      );

      return data;
    } catch (err) {
      console.error('getHeroById Service:', err.message);
      throw err;
    }
  }
}
