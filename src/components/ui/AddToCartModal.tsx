import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus, ShoppingCart, CheckCircle, Flower } from "lucide-react";
import { type Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

interface AddToCartModalProps {
  product: Product;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddToCartModal({ product, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: AddToCartModalProps) {
  const navigate = useNavigate();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const handleAddToCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(
      (item) => item.product._id === product._id
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].notes = notes || cart[existingItemIndex].notes;
    } else {
      cart.push({ product, quantity, notes });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Close the main modal first
    setIsOpen(false);
    
    // Show confirmation modal after a brief delay to ensure smooth transition
    setTimeout(() => {
      setShowConfirmation(true);
    }, 300);
    
    // Reset form
    setQuantity(1);
    setNotes("");
  };

  const handleContinueShopping = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  const handleCheckout = () => {
    setShowConfirmation(false);
    // Navigate to cart
    window.location.href = "/cart";
  };

  return (
    <>
      {/* Modal de adicionar ao carrinho */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {externalIsOpen === undefined && (
          <DialogTrigger asChild>
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Flower className="h-5 w-5" />
              Adicionar ao Carrinho
            </button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-white">
            <DialogHeader className="p-5 pb-3">
              <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
                Adicionar ao Carrinho
              </DialogTitle>
            </DialogHeader>

            <div className="px-5 pb-5 space-y-5">
              {/* Produto */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight truncate">
                    {product.name}
                  </h3>
                  <p className="text-orange-600 font-semibold text-base mt-1">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantidade */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-200"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="bg-white border border-gray-300 rounded-md px-4 py-2 min-w-[60px] text-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-colors border border-orange-200"
                  >
                    <Plus className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Observações (opcional)
                </label>
                <textarea
                  placeholder="Ex: Sem lactose, menos açúcar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Total e botão */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-medium text-gray-700">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    R$ {(product.price * quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-white text-center">
            <DialogHeader className="p-5 pb-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-800">
                Produto Adicionado!
              </DialogTitle>
            </DialogHeader>

            <div className="px-5 pb-5">
              <p className="text-gray-600 text-sm mb-5">
                <strong>{product.name}</strong> foi adicionado ao seu carrinho.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors text-sm"
                >
                  Continuar Comprando
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold transition-colors text-sm"
                >
                  Ir para o Carrinho
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
