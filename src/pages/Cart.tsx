import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, User, Phone, MapPin, Truck, MessageSquare, Flower } from "lucide-react";
import { z } from "zod";
import { type Product } from "@/types";
import { fetchShippingRates } from "@/api";

interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

interface DeliveryInfo {
  name: string;
  whatsapp: string;
  neighborhood: string;
  address: string;
  generalNotes: string;
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  changeAmount: string; // exemplo: "0,00"
}

const deliverySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().regex(
    /^(\+?55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4}|\d{8,9})$/,
    "WhatsApp deve estar no formato: (11) 99999-9999, 11999999999 ou +5511999999999"
  ),
  neighborhood: z.string().min(1, "Selecione um bairro"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  generalNotes: z.string().optional(),
  paymentMethod: z.enum(['pix', 'cartao_credito', 'cartao_debito', 'dinheiro']),
  changeAmount: z.string().optional(),
});

// Validação condicional para changeAmount quando pagamento for em dinheiro
const deliverySchemaRefined = deliverySchema.superRefine((data, ctx) => {
  if (data.paymentMethod === 'dinheiro') {
    const currencyRegex = /^\d+,\d{2}$/;
    if (!data.changeAmount || !currencyRegex.test(data.changeAmount)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe um valor de troco válido (ex: 0,00)',
        path: ['changeAmount'],
      });
    }
  }
});

const NEIGHBORHOODS = [] as string[]; // Será preenchido dinamicamente

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: "",
    whatsapp: "",
    neighborhood: "",
    address: "",
    generalNotes: "",
    paymentMethod: 'pix',
    changeAmount: '0,00',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({});

  useEffect(() => {
    const loadShippingRates = async () => {
      try {
        const shippingData = await fetchShippingRates();
        const rates = shippingData.reduce((acc, rate) => ({
          ...acc,
          [rate.neighborhood]: rate.rate
        }), {} as Record<string, number>);
        setShippingRates(rates);
        setNeighborhoods(Object.keys(rates));
      } catch (error) {
        console.error('Failed to load shipping rates:', error);
      }
    };
    loadShippingRates();
  }, []);

  // Formatação automática do WhatsApp
  const formatWhatsapp = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    // Aplica a formatação brasileira
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  // Validação em tempo real para WhatsApp
  const validateWhatsapp = (value: string) => {
    // Para validação, usa apenas dígitos
    const digitsOnly = value.replace(/\D/g, '');
    try {
      deliverySchema.shape.whatsapp.parse(digitsOnly);
      setValidationErrors(prev => ({ ...prev, whatsapp: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(prev => ({ ...prev, whatsapp: error.issues[0].message }));
      }
    }
  };

  // Formatar valor monetário simples (entrada do usuário permite vírgula ou ponto)
  const formatCurrencyInput = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '0,00';
    if (digits.length === 1) return `0,0${digits}`;
    if (digits.length === 2) return `0,${digits}`;

    // Para 3+ dígitos, coloca vírgula antes dos últimos 2 dígitos
    const intPart = digits.slice(0, -2);
    const decPart = digits.slice(-2);
    return `${intPart},${decPart}`;
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleInputChange = (field: keyof DeliveryInfo, value: string) => {
    let processedValue = value;

    // Aplicar formatação para WhatsApp
    if (field === 'whatsapp') {
      processedValue = formatWhatsapp(value);
    }

    setDeliveryInfo(prev => ({ ...prev, [field]: processedValue }));

    // Validação em tempo real para WhatsApp
    if (field === 'whatsapp') {
      if (processedValue.replace(/\D/g, '').length === 0) {
        setValidationErrors(prev => ({ ...prev, whatsapp: undefined }));
      } else {
        validateWhatsapp(processedValue);
      }
    } else {
      // Limpar erro do campo quando o usuário começa a digitar (para outros campos)
      if (validationErrors[field]) {
        setValidationErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  // Validação e formatação em tempo real para changeAmount
  const handleChangeAmountInput = (raw: string) => {
    // Se o valor for vazio ou só zeros, volta para padrão
    if (!raw || raw === '0' || raw === '0,00') {
      setDeliveryInfo(prev => ({ ...prev, changeAmount: '0,00' }));
      setValidationErrors(prev => ({ ...prev, changeAmount: undefined }));
      return;
    }

    // Pega apenas dígitos e formata como centavos
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) {
      setDeliveryInfo(prev => ({ ...prev, changeAmount: '0,00' }));
      setValidationErrors(prev => ({ ...prev, changeAmount: undefined }));
      return;
    }

    // Converte para centavos: "5" -> 5 centavos = "0,05"
    const numericValue = parseInt(digits, 10);
    const reais = Math.floor(numericValue / 100);
    const centavos = numericValue % 100;

    let formatted;
    if (reais === 0) {
      formatted = `0,${centavos.toString().padStart(2, '0')}`;
    } else {
      formatted = `${reais},${centavos.toString().padStart(2, '0')}`;
    }

    setDeliveryInfo(prev => ({ ...prev, changeAmount: formatted }));

    // Validação
    if (numericValue === 0) {
      setValidationErrors(prev => ({ ...prev, changeAmount: 'Troco deve ser maior que zero' }));
    } else {
      setValidationErrors(prev => ({ ...prev, changeAmount: undefined }));
    }
  };

  const handleFinalizeOrder = () => {
    try {
      // Validar os dados com Zod (schema refinado para troco)
      deliverySchemaRefined.parse(deliveryInfo as any);
      setValidationErrors({});

      // Aqui você pode enviar os dados para um backend ou WhatsApp
      const orderMessage = generateOrderMessage();
      const whatsappUrl = `https://wa.me/5588981259978?text=${encodeURIComponent(orderMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Limpar carrinho após pedido
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof DeliveryInfo, string>> = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof DeliveryInfo;
          errors[field] = err.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const generateOrderMessage = () => {
    let message = `🍦 *NOVO PEDIDO DE GELADINHO GOURMET* 🍦\n\n`;
    message += `*👤 Cliente:* ${deliveryInfo.name}\n`;
    message += `*📱 WhatsApp:* ${deliveryInfo.whatsapp}\n`;
    message += `*📍 Endereço:* ${deliveryInfo.address}, ${deliveryInfo.neighborhood}\n`;
    if (deliveryInfo.generalNotes.trim()) {
      message += `*📝 Observações gerais:* ${deliveryInfo.generalNotes}\n`;
    }
    // Forma de pagamento
    message += `\n*💳 Forma de pagamento:* ${deliveryInfo.paymentMethod === 'pix' ? 'Pix' : deliveryInfo.paymentMethod === 'cartao_credito' ? 'Cartão de Crédito' : deliveryInfo.paymentMethod === 'cartao_debito' ? 'Cartão de Débito' : 'Dinheiro'}`;
    if (deliveryInfo.paymentMethod === 'dinheiro') {
      message += `\n*💵 Troco para:* R$ ${deliveryInfo.changeAmount}`;
    }
    message += `\n`;
    message += `*🛒 ITENS DO PEDIDO:*\n`;

    cart.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Quantidade: ${item.quantity}x\n`;
      message += `   Valor unitário: R$ ${item.product.price.toFixed(2)}\n`;
      message += `   Valor total: R$ ${itemTotal.toFixed(2)}\n`;
      if (item.notes) {
        message += `   *📝 Obs:* ${item.notes}\n`;
      }
      message += `\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const frete = deliveryInfo.neighborhood ? shippingRates[deliveryInfo.neighborhood] || 0 : 0;
    const total = subtotal + frete;

    message += `*💰 RESUMO DO PEDIDO:*\n`;
    message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    message += `Frete (${deliveryInfo.neighborhood}): R$ ${frete.toFixed(2)}\n`;
    message += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    message += `✅ *Pedido realizado via catálogo online*\n`;
    message += `⏰ *Aguarde confirmação do pedido*`;

    return message;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const frete = deliveryInfo.neighborhood ? shippingRates[deliveryInfo.neighborhood] || 0 : 0;
  const total = subtotal + frete;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl animate-bounce">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio</h2>
          <p className="text-gray-600">Que tal adicionar alguns Geladinhos deliciosos?</p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-lg"
          >
            Ver Sorvetes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 py-6">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Seu Carrinho</h1>
          <p className="text-orange-600 font-medium">{cart.length} item{cart.length > 1 ? 's' : ''} delicioso{cart.length > 1 ? 's' : ''}</p>
        </div>

        {/* Itens do carrinho */}
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={item.product._id} className="bg-white rounded-2xl shadow-soft border border-yellow-200 p-4 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-orange-600 font-bold">R$ {item.product.price.toFixed(2)} cada</p>
                  {item.notes && (
                    <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-xl border-l-4 border-yellow-300">
                      <strong className="text-yellow-700">Observação:</strong> {item.notes}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Controles de quantidade */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Total do item</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do pedido */}
        <div className="bg-white rounded-2xl shadow-soft border border-yellow-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            <Flower className="h-5 w-5 text-yellow-600" />
            Resumo do Pedido
          </h3>

          {/* Seletor de bairro */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              Bairro para entrega
            </label>
            <select
              value={deliveryInfo.neighborhood}
              onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50"
            >
              <option value="">
                {!deliveryInfo.neighborhood ? 'Selecione o bairro' : 'Selecione o bairro'}
              </option>
              {neighborhoods.map((neighborhood) => {
                const rate = shippingRates[neighborhood];
                return (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood} - R$ {rate?.toFixed(2) || '0.00'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-3 bg-yellow-50 p-4 rounded-xl">
            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-2">
                <span className="text-lg">🛒</span>
                Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})
              </span>
              <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <span className="flex items-center gap-2">
                <span className="text-lg">🚚</span>
                Frete {deliveryInfo.neighborhood ? `(${deliveryInfo.neighborhood})` : ''}
              </span>
              <span>
                {!deliveryInfo.neighborhood ? (
                  <span className="text-orange-600 font-medium">Selecione o bairro</span>
                ) : (
                  `R$ ${frete.toFixed(2)}`
                )}
              </span>
            </div>

            <hr className="border-yellow-200" />

            <div className="flex justify-between items-center font-bold text-xl text-gray-800">
              <span className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                Total
              </span>
              <span className="text-orange-600">
                {!deliveryInfo.neighborhood ? (
                  <span>A calcular</span>
                ) : (
                  `R$ ${total.toFixed(2)}`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Formulário de entrega */}
        <div className="bg-white rounded-2xl shadow-soft border border-yellow-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <Truck className="h-5 w-5 text-yellow-600" />
              Informações de Entrega
            </h3>
            {/* Indicador de progresso simples */}
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${deliveryInfo.name && deliveryInfo.whatsapp ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${deliveryInfo.neighborhood && deliveryInfo.address ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${deliveryInfo.paymentMethod ? 'bg-green-400' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-orange-500" />
                Nome Completo
              </label>
              <input
                type="text"
                value={deliveryInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50 ${
                  validationErrors.name ? 'border-red-300 bg-red-50' : 'border-yellow-200'
                }`}
                placeholder="Digite seu nome completo"
              />
              {validationErrors.name && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ {validationErrors.name}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                WhatsApp
              </label>
              <input
                type="tel"
                value={deliveryInfo.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50 ${
                  validationErrors.whatsapp ? 'border-red-300 bg-red-50' : 'border-yellow-200'
                }`}
                placeholder="(11) 99999-9999"
              />
              {validationErrors.whatsapp && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ {validationErrors.whatsapp}
                </p>
              )}
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Bairro
              </label>
              <select
                value={deliveryInfo.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50 ${
                  validationErrors.neighborhood ? 'border-red-300 bg-red-50' : 'border-yellow-200'
                }`}
              >
                <option value="">
                  {validationErrors.neighborhood ? '⚠️ Selecione seu bairro' : 'Selecione o bairro'}
                </option>
                {neighborhoods.map((neighborhood) => {
                  const rate = shippingRates[neighborhood];
                  return (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood} - R$ {rate?.toFixed(2) || '0.00'}
                    </option>
                  );
                })}
              </select>
              {validationErrors.neighborhood && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ {validationErrors.neighborhood}
                </p>
              )}
            </div>

            {/* Endereço */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Endereço Completo
              </label>
              <input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50 ${
                  validationErrors.address ? 'border-red-300 bg-red-50' : 'border-yellow-200'
                }`}
                placeholder="Rua, número, complemento"
              />
              {validationErrors.address && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ {validationErrors.address}
                </p>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">💳 Forma de Pagamento</label>
              <select
                value={deliveryInfo.paymentMethod}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, paymentMethod: e.target.value as DeliveryInfo['paymentMethod'] }))}
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50"
              >
                <option value="pix">💰 Pix</option>
                <option value="cartao_credito">💳 Cartão de Crédito</option>
                <option value="cartao_debito">💳 Cartão de Débito</option>
                <option value="dinheiro">💵 Dinheiro</option>
              </select>
            </div>

            {/* Troco */}
            {deliveryInfo.paymentMethod === 'dinheiro' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">💵 Troco para</label>
                <input
                  type="text"
                  value={deliveryInfo.changeAmount}
                  onChange={(e) => handleChangeAmountInput(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all bg-yellow-50 ${validationErrors.changeAmount ? 'border-red-300 bg-red-50' : 'border-yellow-200'}`}
                  placeholder="0,00"
                />
                {validationErrors.changeAmount && (
                  <p className="text-xs text-red-600 mt-1">⚠️ {validationErrors.changeAmount}</p>
                )}
              </div>
            )}

            {/* Observações Gerais */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-500" />
                Observações Gerais
              </label>
              <textarea
                value={deliveryInfo.generalNotes}
                onChange={(e) => handleInputChange('generalNotes', e.target.value)}
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none bg-yellow-50"
                placeholder="Instruções especiais para entrega, preferências, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 py-4 px-6 border-2 border-yellow-300 text-yellow-700 rounded-2xl hover:bg-yellow-50 font-medium transition-all duration-300 hover:scale-105"
          >
            Continuar Comprando
          </Link>
          <button
            onClick={handleFinalizeOrder}
            disabled={!deliveryInfo.neighborhood || !deliveryInfo.name || !deliveryInfo.whatsapp || !deliveryInfo.address}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
              deliveryInfo.neighborhood && deliveryInfo.name && deliveryInfo.whatsapp && deliveryInfo.address
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-soft hover:shadow-lg hover:scale-105 animate-pulse-slow'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Flower className="h-5 w-5" />
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
