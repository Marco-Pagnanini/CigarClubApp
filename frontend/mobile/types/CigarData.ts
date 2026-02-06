export type StackType = 'bundle' | 'box';

export type ProductCategory = 'sigaretto' | 'sigaro';

export interface Cigar {
  id: string;
  code: string;
  description: string;
  category: ProductCategory;
  barcodes: string[];
  priceKg: number;
  stackPrice: number;
  stackType: StackType;
  currentPricingValidity: string; // ISO 8601 date string
  nextPrice: number;
  nextPricingValidity: string; // ISO 8601 date string
  nextStackPrice: number;
  panelId: string | null;
}
