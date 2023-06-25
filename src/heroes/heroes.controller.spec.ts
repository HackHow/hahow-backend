import { Test, TestingModule } from '@nestjs/testing';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';

describe('HeroesController', () => {
  let controller: HeroesController;
  let heroesService: HeroesService;
  let authGuard: AuthGuard;

  const mockHeroesService = {
    getAllHeroes: jest.fn().mockResolvedValue({
      heroes: [
        {
          id: 1,
          name: 'Iron Man',
          image: 'ironman.png',
        },
        {
          id: 2,
          name: 'Thor',
          image: 'thor.png',
        },
      ],
    }),
    getAllHeroesWithProfiles: jest.fn().mockResolvedValue({
      heroes: [
        {
          id: 1,
          name: 'Iron Man',
          image: 'ironman.png',
          profile: {
            str: 1,
            int: 2,
            agi: 3,
            luk: 4,
          },
        },
        {
          id: 2,
          name: 'Thor',
          image: 'thor.png',
          profile: {
            str: 1,
            int: 2,
            agi: 3,
            luk: 4,
          },
        },
      ],
    }),
    getHeroById: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Iron Man',
      image: 'ironman.png',
    }),
    getHeroWithProfilesById: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Iron Man',
      image: 'ironman.png',
      profile: {
        str: 1,
        int: 2,
        agi: 3,
        luk: 4,
      },
    }),
  };
  const mockAuthGuard = {
    canActivate: jest.fn().mockResolvedValue(true),
  };
  const mockHttpService = {
    post: jest.fn().mockResolvedValue({ data: {} }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroesController],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: AuthGuard, useValue: mockAuthGuard },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    controller = module.get<HeroesController>(HeroesController);
    heroesService = module.get<HeroesService>(HeroesService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all heroes', async () => {
    const req = { isAuthorized: false } as Request;
    expect(await controller.getAllHeroes(req)).toEqual({
      heroes: [
        {
          id: 1,
          name: 'Iron Man',
          image: 'ironman.png',
        },
        {
          id: 2,
          name: 'Thor',
          image: 'thor.png',
        },
      ],
    });
    expect(mockHeroesService.getAllHeroes).toBeCalled();
  });

  it('should get all heroes with profiles', async () => {
    const req = { isAuthorized: true } as Request;
    expect(await controller.getAllHeroes(req)).toEqual({
      heroes: [
        {
          id: 1,
          name: 'Iron Man',
          image: 'ironman.png',
          profile: {
            str: 1,
            int: 2,
            agi: 3,
            luk: 4,
          },
        },
        {
          id: 2,
          name: 'Thor',
          image: 'thor.png',
          profile: {
            str: 1,
            int: 2,
            agi: 3,
            luk: 4,
          },
        },
      ],
    });
    expect(mockHeroesService.getAllHeroesWithProfiles).toBeCalled();
  });

  it('should get hero with profile by id', async () => {
    const req = { isAuthorized: true } as Request;
    const mockHeroId = 1;
    expect(await controller.getHeroById(req, mockHeroId)).toEqual({
      id: 1,
      name: 'Iron Man',
      image: 'ironman.png',
      profile: {
        str: 1,
        int: 2,
        agi: 3,
        luk: 4,
      },
    });
    expect(mockHeroesService.getHeroWithProfilesById).toBeCalledWith(
      mockHeroId,
    );
  });

  it('should get hero by id', async () => {
    const mockReq = { isAuthorized: false } as Request;
    const mockHeroId = 1;
    expect(await controller.getHeroById(mockReq, mockHeroId)).toEqual({
      id: 1,
      name: 'Iron Man',
      image: 'ironman.png',
    });
    expect(mockHeroesService.getHeroById).toBeCalledWith(mockHeroId);
  });

  it('should not get hero by id but status code equal 200', async () => {
    const mockReq = { isAuthorized: false } as Request;
    const mockHeroId = 1;
    mockHeroesService.getHeroById.mockResolvedValueOnce({
      code: 1000,
      message: 'backend error',
    });
    expect(await controller.getHeroById(mockReq, mockHeroId)).toEqual({
      code: 1000,
      message: 'backend error',
    });
    expect(mockHeroesService.getHeroById).toBeCalledWith(mockHeroId);
  });

  it('should handle hero not found', async () => {
    const mockReq = { isAuthorized: false } as Request;
    const mockHeroId = 999;

    mockHeroesService.getHeroById.mockResolvedValueOnce({
      statusCode: 500,
      message: 'Unexpected error',
    });
    expect(await controller.getHeroById(mockReq, mockHeroId)).toEqual({
      statusCode: 500,
      message: 'Unexpected error',
    });
    expect(mockHeroesService.getHeroById).toBeCalledWith(mockHeroId);
  });
});
