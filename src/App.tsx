import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader";
import BottomNav from "./components/layout/BottomNav";
import Footer from "./components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh bg-gradient-to-b from-yellow-50 to-orange-50">
      <ScrollRestoration getKey={(location) => location.pathname} />
      <AppHeader />

      <main className="container-app py-4 pb-12">
        <Outlet />
        <Footer />
      </main>

      <BottomNav activePath={pathname} />
      <Toaster />
    </div>
  );
}
