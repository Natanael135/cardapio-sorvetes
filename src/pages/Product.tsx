import { useParams } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartModal from "@/components/ui/AddToCartModal";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="bg-white rounded-2xl shadow-soft border overflow-hidden">
        <div className="aspect-[4/3] bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.tags?.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <p className="text-gray-600">Categoria: {product.category}</p>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600">
            R$ {product.price.toFixed(2)}
          </p>
          <AddToCartModal product={product} />
        </div>
      </div>
    </div>
  );
}