import { PRODUCTS } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
}

export default function ProductGrid({ searchTerm = "", category = "" }: ProductGridProps) {
  // Filtrar produtos baseado na pesquisa e categoria
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = category === "" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  );
}
