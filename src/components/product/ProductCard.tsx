import { useState } from "react";
import { type Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartModal from "@/components/ui/AddToCartModal";


export default function ProductCard({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 shadow-soft border border-yellow-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
        <Link to={`/product/${product._id}`} className="block group">
          <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            {product.tags && product.tags.length > 0 && (
              <div className="absolute top-3 -left-1">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-2 border-white shadow-md -rotate-45 group-hover:scale-110 transition-transform duration-200">
                  {product.tags[0]}
                </Badge>
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div className="min-h-[3rem]">
              <h3 className="font-bold leading-tight text-gray-800 group-hover:text-orange-700 transition-colors duration-200 line-clamp-2">{product.name}</h3>
            </div>
            <p
              className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.description}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-orange-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {!product.available && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    Indisponível
                  </span>
                )}
              </div>
              <Button
                size="sm"
                disabled={!product.available}
                className={`w-full border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                  product.available
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (!product.available) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                {product.available ? "Adicionar" : "Indisponível"}
              </Button>
            </div>
          </div>
        </Link>
      </div>

      <AddToCartModal 
        product={product} 
        isOpen={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
}
