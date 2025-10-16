import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
