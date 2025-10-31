import { fetchShippingRates, type Shipping } from "@/api";

// Fallback para desenvolvimento - será substituído pelos dados do backend
const FALLBACK_SHIPPING_RATES = {
  "Retirar na loja": 0,
  "Junco": 5,
  "Campo dos Velhos": 5,
  "Alto do Cristo": 5,
  "Domingo Olímpio": 5,
  "Centro": 6,
  "Dom José 1": 6,
  "Dom José 2": 6,
  "Sumaré": 6,
  "Padre Palhano": 6,
  "Paraíso das Flores": 6,
  "Alto da Brasília": 6,
  "Derby": 6,
  "Pedrinha": 6,
  "Terrenos": 6,
  "Vila União": 6,
  "Dom Expedito": 7,
  "COHAB 1": 7,
  "COHAB 2": 7,
  "COHAB 3": 7,
  "Renato Parente": 7,
  "Boa Vizinhança": 7,
} as const;

export type Neighborhood = keyof typeof FALLBACK_SHIPPING_RATES;

// Cache para evitar múltiplas requisições
let shippingCache: Record<string, number> | null = null;

export const getShippingRates = async (): Promise<Record<string, number>> => {
  if (shippingCache) {
    return shippingCache;
  }

  try {
    const shippingData = await fetchShippingRates();
    shippingCache = shippingData.reduce((acc, rate) => ({
      ...acc,
      [rate.neighborhood]: rate.rate
    }), {} as Record<string, number>);
    return shippingCache;
  } catch (error) {
    console.warn('Failed to fetch shipping rates from backend, using fallback:', error);
    shippingCache = { ...FALLBACK_SHIPPING_RATES };
    return shippingCache;
  }
};

// Função para limpar cache quando rates são atualizados
export const clearShippingCache = () => {
  shippingCache = null;
};

// Para compatibilidade, manter export do tipo
export type NeighborhoodType = Neighborhood;
