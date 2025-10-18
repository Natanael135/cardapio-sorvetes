import { Flower } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="container-app flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Flower className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-lg font-semibold">Sorvete da Fabiana</h1>
            <div className="text-xs text-neutral-500 flex gap-2">
              <span>Entrega a partir das XX horas</span>
              <span>Sem pedido mínimo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
