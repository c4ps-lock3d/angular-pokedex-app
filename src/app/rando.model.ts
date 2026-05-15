export interface Rando {
  id: number;
  slug: string;
  title: string;
  cat_difficulty_name: string;
  cat_layout_name: string;
  cat_dogfriendly_name: string;
  tags: {
    id: number;
    name: string;
  }[];
}

export type RandoList = Rando[];

export const RANDO_RULES = {
  SLUG: /^[a-zA-Z]+$/,
} as const;