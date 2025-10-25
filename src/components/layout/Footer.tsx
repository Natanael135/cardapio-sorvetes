import { Heart, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-yellow-100 via-orange-50 to-yellow-50 border-t border-yellow-200 mt-12">
      <div className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-orange-800 mb-2">
              Geladinho Gourmet da Faby
            </h3>
            <p className="text-sm text-gray-600">
              Deliciosos Geladinhos Gourmet feitos com amor, Alegria e Gratidão!
            </p>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-orange-700 mb-2">Contato</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-1">
                <Phone className="h-4 w-4" />
                <span>(88) 98125-9978</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Alto do Cristo - Sobral - CE</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-semibold text-orange-700 mb-2">Horário</h4>
            <div className="flex items-center justify-center md:justify-end gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Terça-Sábado: 9h às 14h</span>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-200 pt-4">
          <div className="text-center space-y-2">
            <a
              href="https://wa.me/5588996559305"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors duration-200 hover:scale-105 transform"
            >
              <span className="font-medium">
                Desenvolvido por: Natanael Melo
              </span>
            </a>
            <p className="text-xs text-gray-500">
              © 2025 Geladinho Gourmet da Faby. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
