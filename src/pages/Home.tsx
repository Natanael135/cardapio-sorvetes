import { useState, useEffect } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { Flower } from "lucide-react";
import { fetchProducts, type Product } from "@/api";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Flower className="h-16 w-16 text-yellow-600 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-orange-800 mb-2">Bem-vindo ao Geladinho Gourmet da Faby!</h2>
        <p className="text-base text-orange-700 font-medium">Deliciosos Geladinhos feitos com Amor, Alegria e Gratidão, como um campo de girassóis</p>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-3">
        <input
          className="min-w-0 flex-1 rounded-full border-2 border-yellow-300 bg-yellow-50 px-4 py-3 text-base placeholder:text-orange-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 hover:shadow-md"
          placeholder="Buscar doces, sabores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="rounded-full border-2 border-yellow-300 bg-yellow-50 px-3 py-3 text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 hover:shadow-md min-w-[120px] md:min-w-[180px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          <option value="TRADICIONAIS">Tradicionais</option>
          <option value="PREMIUM">Premium</option>
        </select>
      </div>

      <ProductGrid searchTerm={searchTerm} category={selectedCategory} products={products} isLoading={isLoading} />
    </section>
  );
}
