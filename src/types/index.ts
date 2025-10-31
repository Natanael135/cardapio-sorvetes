export type Category =
  | "TRADICIONAIS"
  | "PREMIUM"
  | "OUTROS";

export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
  description: string;
  tags?: string[];
  available: boolean;
}

export interface Shipping {
  _id: string;
  neighborhood: string;
  rate: number;
}
