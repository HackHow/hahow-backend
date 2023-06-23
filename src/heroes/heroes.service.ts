import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface Hero {
  readonly id: string;
  readonly name: string;
  readonly image: string;
}

export interface HeroWithProfile {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly profile: {
    readonly str: number;
    readonly int: number;
    readonly agi: number;
    readonly luk: number;
  };
}

interface BackendErrorResponse {
  code: number;
  message: string;
}

@Injectable()
export class HeroesService {
  private readonly hahowHeroesAPIUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.hahowHeroesAPIUrl = configService.get<string>('HAHOW_HEROES_API_URL');
  }

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

  async getHeroById(heroId: number): Promise<Hero> {
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

  async getAllHeroesWithProfiles(): Promise<{ heroes: HeroWithProfile[] }> {
    const { heroes } = await this.getAllHeroes();
    const heroesCount = heroes.length;
    const result: HeroWithProfile[] = [];

    for (let i = 0; i < heroesCount; i++) {
      const heroId = heroes[i].id;
      try {
        const hahowHeroProfileAPIUrl = `${this.hahowHeroesAPIUrl}/${heroId}/profile`;
        const { data } = await firstValueFrom(
          this.httpService.get(hahowHeroProfileAPIUrl),
        );
        result.push({ ...heroes[i], profile: data });
      } catch (err) {
        console.log('getAllHeroesWithProfiles Service:', err.message);
        throw new HttpException(err.response.data, err.response.status);
      }
    }
    return { heroes: result };
  }

  async getHeroWithProfilesById(heroId: number): Promise<HeroWithProfile> {
    const hero = await this.getHeroById(heroId);
    const hahowHeroProfileAPIUrl = `${this.hahowHeroesAPIUrl}/${heroId}/profile`;
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(hahowHeroProfileAPIUrl),
      );
      return { ...hero, profile: data };
    } catch (err) {
      console.error('getHeroWithProfilesById Service:', err.message);
      throw err;
    }
  }
}
