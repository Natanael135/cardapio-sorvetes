import { type Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 shadow-soft border border-yellow-200 hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/3] bg-neutral-100 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.tags && product.tags.length > 0 && (
            <div className="absolute top-3 -left-1">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-2 border-white shadow-md -rotate-45">
                {product.tags[0]}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
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
