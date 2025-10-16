import { type Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sorvete de Chocolate",
    price: 12.9,
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop",
    category: "TRADICIONAIS",
    description:
      "Delicioso sorvete cremoso de chocolate belga, feito com cacau premium e leite fresco.",
    tags: ["Novo"],
  },
  {
    id: "2",
    name: "Sorvete de Morango",
    price: 13.9,
    imageUrl:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800&auto=format&fit=crop",
    category: "TRADICIONAIS",
    description:
      "Sorvete suave de morango natural, com pedaços reais de frutas frescas e suculentas.",
    tags: ["Promo"],
  },
  {
    id: "3",
    name: "Sorvete de Baunilha",
    price: 11.9,
    imageUrl:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop",
    category: "TRADICIONAIS",
    description:
      "Clássico sorvete de baunilha Bourbon Madagascar, cremoso e aromático.",
    tags: ["Popular"],
  },
  {
    id: "4",
    name: "Sorvete de Pistache",
    price: 15.9,
    imageUrl:
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=800&auto=format&fit=crop",
    category: "PREMIUM",
    description:
      "Sorvete premium de pistache italiano, com nozes crocantes e sabor intenso.",
  },
  {
    id: "5",
    name: "Sorvete de Caramelo",
    price: 14.9,
    imageUrl:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop",
    category: "PREMIUM",
    description:
      "Irresistível sorvete de caramelo salgado, com pedaços de caramelo crocante.",
  },
];
