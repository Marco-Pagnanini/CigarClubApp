export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  country: string;
}

export type WrapperColor = 0 | 1 | 2 | 3; // Puoi definire i valori specifici
export type TobaccoType = 0 | 1 | 2; // Puoi definire i valori specifici
export type Strength = 0 | 1 | 2 | 3; // Mild, Medium, Full, etc.

export interface Panel {
  id: string;
  name: string;
  description: string;
  tobacconistCode: string;
  tobacconistId: string;
  brandId: string;
  brand: Brand;
  origin: string;
  shape: string;
  ring: number;
  smokingTime: number;
  strength: Strength;
  rating: number;
  price: number;
  numberInBox: number;
  rollingType: string;
  type: TobaccoType;
  wrapper: string;
  wrapperColor: WrapperColor;
  binder: string;
  filler: string;
  masterLine: string;
  imageUrl: string;
}
