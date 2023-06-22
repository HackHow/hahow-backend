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
  private readonly apiUrl = 'https://hahow-recruit.herokuapp.com/heroes';

  constructor(private readonly httpService: HttpService) {}

  async getAllHeroes(): Promise<{ heroes: Hero[] }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Hero[]>(this.apiUrl),
      );
      return { heroes: data };
    } catch (err) {
      console.error('getAllHeroes:', err.message);
      throw new HttpException(err.response.data, err.response.status);
    }
  }
}
