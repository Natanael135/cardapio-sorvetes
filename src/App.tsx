import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader";
import BottomNav from "./components/layout/BottomNav";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh bg-gradient-to-b from-yellow-50 to-orange-50">
      <AppHeader />

      <main className="container-app py-4 pb-24">
        <Outlet />
      </main>

      <BottomNav activePath={pathname} />
    </div>
  );
}
