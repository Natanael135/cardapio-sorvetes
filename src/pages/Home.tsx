import { useState } from "react";
import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-full border px-4 py-2 text-sm"
          placeholder="Buscar doces, sabores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="rounded-full border px-3 py-2 text-sm"
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
