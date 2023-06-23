import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface Hero {
  readonly id: number;
  readonly name: string;
  readonly image: number;
}

interface BackendErrorResponse {
  code: number;
  message: string;
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
        this.httpService.get<Hero | BackendErrorResponse>(hahowHeroAPIUrl),
      );

      // When status code == 200, but did not get the data, need to return the message
      if ('code' in data) {
        throw new HttpException('Try it again', HttpStatus.OK);
      }

      return <Hero>data;
    } catch (err) {
      console.error('getHeroById Service:', err.message);
      throw err;
    }
  }
}
