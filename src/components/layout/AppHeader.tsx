import { Flower, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-yellow-200 bg-gradient-to-r from-white via-yellow-50 to-orange-50 backdrop-blur shadow-sm">
      <div className="container-app flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-4 group">
          <Flower className="h-10 w-10 text-yellow-500 animate-spin transition-transform duration-300" style={{ animationDuration: '5s' }} />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Geladinho Gourmet da Faby
            </h1>
            <div className="text-xs text-neutral-600 flex flex-col sm:flex-row gap-1 sm:gap-3">
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                <span>Delivery e Retirada</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Terça a Sábado de 9h às 14h</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
