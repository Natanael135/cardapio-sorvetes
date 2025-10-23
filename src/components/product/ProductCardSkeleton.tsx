import { Skeleton } from "@/components/ui/skeleton"
import { Flower } from "lucide-react"

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-25 to-yellow-50 shadow-soft border border-yellow-200/60 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Imagem do produto com overlay sofisticado */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
        <Skeleton className="h-full w-full" />

        {/* Overlay com gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

        {/* Badge skeleton no canto superior direito */}
        <div className="absolute top-3 right-3">
          <Skeleton variant="rounded" className="h-6 w-16" />
        </div>

        {/* Ícone decorativo sutil */}
        <div className="absolute bottom-3 left-3 opacity-20">
          <Flower className="h-6 w-6 text-yellow-600" />
        </div>
      </div>

      <div className="p-3 space-y-2">
        {/* Header com título e badge */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="rounded" className="h-5 w-16" />
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <Skeleton variant="text" className="h-3 w-full" />
          <Skeleton variant="text" className="h-3 w-5/6" />
        </div>

        {/* Preço */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-6 w-20" />
        </div>
      </div>

      {/* Efeito de brilho sutil na borda */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}