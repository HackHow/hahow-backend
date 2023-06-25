import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly hahowAuthAPIUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.hahowAuthAPIUrl = configService.get<string>('HAHOW_AUTH_API_URL');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    const { name, password } = headers;

    try {
      await firstValueFrom(
        this.httpService.post(this.hahowAuthAPIUrl, {
          name: name,
          password: password,
        }),
      );
    } catch (err) {
      console.error('Guard:', err.message);
      request.isAuthorized = false;
      return true;
    }

    request.isAuthorized = true;
    return true;
  }
}
