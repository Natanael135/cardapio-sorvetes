import { type Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft border hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/3] bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
            {product.tags?.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <p
            className="text-sm text-gray-600 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
