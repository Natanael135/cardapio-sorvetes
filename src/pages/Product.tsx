import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flower } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartModal from "@/components/ui/AddToCartModal";
import { fetchProduct, type Product, API_BASE_URL } from "@/api";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        // Se id for ObjectId (_id), buscar por _id, senão por id
        const isObjectId = id.length === 24 && /^[a-f\d]+$/i.test(id);
        const url = isObjectId ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Flower className="h-12 w-12 text-yellow-600 mx-auto animate-pulse" />
          <p className="text-orange-700">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Flower className="h-12 w-12 text-yellow-600 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-orange-800">Produto não encontrado</h2>
          <p className="text-orange-700">Volte para a página inicial e explore nossos deliciosos geladinhos!</p>
          <Link to="/" className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-800 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-orange-50 py-2">
      <div className="container mx-auto px-4 max-w-sm md:max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-800 mb-2 transition-colors duration-200 text-sm"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 lg:w-2/5">
              <div className="aspect-[4/3] md:aspect-square bg-neutral-100 relative overflow-hidden rounded-lg">
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

            </div>

            <div className="md:w-1/2 lg:w-3/5 p-3 md:p-6 lg:p-8 space-y-4">
              <div className="space-y-2">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">{product.name}</h1>
                <p className="text-xs md:text-sm text-orange-600 font-medium uppercase tracking-wide">Categoria: {product.category}</p>
              </div>

              <p className="text-gray-700 leading-relaxed text-xs md:text-sm lg:text-base">
                {product.description}
              </p>

              <div className="pt-4">
                <p className="text-xl md:text-3xl lg:text-4xl font-bold text-orange-600 mb-4 md:mb-6">
                  R$ {product.price.toFixed(2)}
                </p>
                <AddToCartModal product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}