import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import { type Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

interface AddToCartModalProps {
  product: Product;
}

export default function AddToCartModal({ product }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddToCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].notes = notes || cart[existingItemIndex].notes;
    } else {
      cart.push({ product, quantity, notes });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsOpen(false);
    setShowConfirmation(true);
    // Reset form
    setQuantity(1);
    setNotes("");
  };

  const handleContinueShopping = () => {
    setShowConfirmation(false);
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
        <DialogTrigger asChild>
          <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Adicionar ao Carrinho
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
                Adicionar ao Carrinho
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 space-y-6">
              {/* Produto */}
              <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-primary font-bold text-xl">R$ {product.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Quantidade */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Quantidade</label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="bg-white border-2 border-gray-200 rounded-lg px-6 py-3 min-w-[80px] text-center">
                    <span className="text-xl font-bold text-gray-800">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-5 w-5 text-yellow-600" />
                  </button>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Observações (opcional)</label>
                <textarea
                  placeholder="Ex: Sem lactose, menos açúcar, mais calda..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Total e botão */}
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {(product.price * quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-white text-center">
            <DialogHeader className="p-6 pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Produto Adicionado! 🎉
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-6">
                <strong>{product.name}</strong> foi adicionado ao seu carrinho com sucesso!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Continuar Comprando
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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