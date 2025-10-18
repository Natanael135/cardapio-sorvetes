import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { Flower } from "lucide-react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-yellow-200 to-orange-200 p-6 text-center">
        <Flower className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold text-orange-800 mb-1">Bem-vindo ao Geladinho Gourmet da Fabi!</h2>
        <p className="text-sm text-orange-700">Deliciosos sorvetes feitos com amor, como um campo de girassóis</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-full border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm placeholder:text-orange-400 focus:ring-2 focus:ring-yellow-400"
          placeholder="Buscar doces, sabores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          <option value="TRADICIONAIS">Tradicionais</option>
          <option value="PREMIUM">Premium</option>
        </select>
      </div>

      <ProductGrid searchTerm={searchTerm} category={selectedCategory} />
    </section>
  );
}
