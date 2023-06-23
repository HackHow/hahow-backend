export interface Hero {
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

export type AllHeroes = {
  readonly heroes: (HeroWithProfile | Hero)[];
};
