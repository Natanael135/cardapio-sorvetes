import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-full border px-4 py-2 text-sm"
          placeholder="Buscar doces, sabores..."
        />
        <button className="rounded-full border px-3 py-2 text-sm">
          Categorias
        </button>
      </div>

      <ProductGrid />
    </section>
  );
}
