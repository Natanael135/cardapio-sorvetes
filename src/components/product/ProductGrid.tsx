import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { type Product } from "@/api";

interface ProductGridProps {
  searchTerm?: string;
  category?: string;
  products?: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ searchTerm = "", category = "", products = [], isLoading = false }: ProductGridProps) {
  const productList = products;

  // Filtrar produtos baseado na pesquisa e categoria
  const filteredProducts = productList
    .filter((product) => {
      const matchesSearch = searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = category === "" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    // Ordenar: disponíveis primeiro, indisponíveis por último
    .sort((a, b) => {
      if (a.available && !b.available) return -1; // a disponível, b indisponível -> a vem primeiro
      if (!a.available && b.available) return 1;  // a indisponível, b disponível -> b vem primeiro
      return 0; // ambos têm o mesmo status de disponibilidade
    });

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {isLoading ? (
        // Renderizar skeletons enquanto carrega
        Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))
      ) : (
        <>
          {filteredProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </>
      )}
    </div>
  );
}
