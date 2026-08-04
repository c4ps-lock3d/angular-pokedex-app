export interface Rando {
  id: number;
  slug: string;
  title: string;
  date: string;
  distance: number;
  ele_asc: number;
  ele_dsc: number;
  dist_eff: number;
  ele_start: number;
  ele_max: number;
  duration: number;
  gpxpath: string;
  canton: string;
  commune: string;
  hut: string | null;
  comments: string | null;
  created_at: string;
  updated_at: string;
  cat_difficulty_id: number;
  cat_layout_id: number;
  cat_dogfriendly_id: number;
  image: string;
  latstart: number;
  lonstart: number;
  latend: number;
  lonend: number;
  latelemax: number;
  lonelemax: number;
  cat_difficulty_name: string;
  cat_dogfriendly_name: string;
  cat_layout_name: string;
  trails: [
    {
      id: number;
      ele: number;
      dis: number;
      lat: number;
      lon: number;
    }
  ]
}

export type RandoList = Rando[];

export const RANDO_RULES = {
  SLUG: /^[a-zA-Z]+$/,
} as const;