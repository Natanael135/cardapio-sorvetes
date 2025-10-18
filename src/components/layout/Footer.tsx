import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-yellow-100 to-orange-50 border-t border-yellow-200 mt-8">
      <div className="container-app py-6">
        <div className="text-center space-y-3">
          <a
            href="https://wa.me/5588996559305"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
          >
            <span>Desenvolvido por: Natanael Melo</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
