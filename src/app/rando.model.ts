export interface Rando {
  id: number;
  slug: string;
  title: string;
  cat_difficulty_name: string;
  cat_difficulty_id: number;
  latstart: number;
}

export type RandoList = Rando[];

export const RANDO_RULES = {
  SLUG: /^[a-zA-Z]+$/,
} as const;