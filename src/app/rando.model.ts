export interface Rando {
  id: number;
  slug: string;
  title: string;
}

export type RandoList = Rando[];

export const RANDO_RULES = {
  SLUG: /^[a-zA-Z]+$/,
} as const;