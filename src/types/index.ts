export type Category =
  | "TRADICIONAIS"
  | "PREMIUM"
  | "OUTROS";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
  description: string;
  tags?: ("Promo" | "Novo" | "Popular")[];
}
