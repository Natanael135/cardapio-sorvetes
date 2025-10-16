import { Link } from "react-router-dom";
import { Home, ListChecks, ShoppingCart } from "lucide-react";

export default function BottomNav({ activePath }: { activePath: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="mx-auto max-w-3xl grid grid-cols-3">
        <NavItem to="/" icon={<Home className="h-5 w-5" />} label="Início" active={activePath === "/"} />
        <NavItem to="/orders" icon={<ListChecks className="h-5 w-5" />} label="Pedidos" disabled />
        <NavItem to="/cart" icon={<ShoppingCart className="h-5 w-5" />} label="Carrinho" />
      </div>
    </nav>
  );
}

function NavItem({
  to, icon, label, active, disabled
}: { to: string; icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  const className = [
    "flex items-center justify-center gap-1 py-3 text-sm",
    active ? "text-primary" : "text-neutral-600",
    disabled ? "opacity-50 pointer-events-none" : ""
  ].join(" ");
  return (
    <Link to={to} className={className}>
      {icon} {label}
    </Link>
  );
}
