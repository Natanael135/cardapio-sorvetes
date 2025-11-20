import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Product, type Category, type Shipping } from "@/types";
import { fetchProducts, fetchShippingRates, createShippingRate, updateShippingRate, deleteShippingRate, API_BASE_URL, updateStoreStatus } from "@/api";
import { Plus, Edit, Trash2, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { isAuthenticated, token, logout } = useAuth();
  const { isOpen, refreshStatus } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingRates, setShippingRates] = useState<Shipping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingShipping, setEditingShipping] = useState<Shipping | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadProducts();
    loadShippingRates();
  }, [isAuthenticated, navigate]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadShippingRates = async () => {
    try {
      const data = await fetchShippingRates();
      setShippingRates(data);
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
    }
  };

  const handleToggleStore = async () => {
    try {
      await updateStoreStatus(!isOpen, token!);
      await refreshStatus();
      toast({
        title: "Sucesso",
        description: `Loja ${!isOpen ? 'aberta' : 'fechada'} com sucesso!`,
      });
    } catch (error) {
      console.error("Error updating store status:", error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da loja.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete");
      setProducts(products.filter((p) => p._id !== id));
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso! 🗑️",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto. ❌",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (product: Partial<Product>) => {
    try {
      const method = editingProduct ? "PATCH" : "POST";
      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct._id}`
        : `${API_BASE_URL}/products`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to save");
      await loadProducts();
      setIsDialogOpen(false);
      setEditingProduct(null);
      toast({
        title: "Sucesso",
        description: editingProduct ? "Produto atualizado com sucesso! ✏️" : "Produto adicionado com sucesso! ➕",
      });
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto. ❌",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShipping = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta taxa de frete?")) return;
    try {
      await deleteShippingRate(id, token);
      setShippingRates(shippingRates.filter((s) => s._id !== id));
      toast({
        title: "Sucesso",
        description: "Taxa de frete removida com sucesso! 🚚",
      });
    } catch (error) {
      console.error("Error deleting shipping rate:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover taxa de frete. ❌",
        variant: "destructive",
      });
    }
  };

  const handleSaveShipping = async (shipping: Partial<Shipping>) => {
    try {
      if (editingShipping) {
        await updateShippingRate(editingShipping._id, shipping, token);
      } else {
        await createShippingRate(shipping, token);
      }
      await loadShippingRates();
      setIsShippingDialogOpen(false);
      setEditingShipping(null);
      toast({
        title: "Sucesso",
        description: editingShipping ? "Taxa de frete atualizada com sucesso! ✏️" : "Taxa de frete adicionada com sucesso! ➕",
      });
    } catch (error) {
      console.error("Error saving shipping rate:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar taxa de frete. ❌",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-8">
      <div className="max-w-full sm:max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin - Gerenciar Produtos
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Loja:</span>
              <Button
                onClick={handleToggleStore}
                className={isOpen ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
              >
                {isOpen ? "Fechar Loja" : "Abrir Loja"}
              </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingProduct(null)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto overflow-x-hidden mx-auto">
                <DialogTitle className="text-lg sm:text-xl">
                  {editingProduct ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Preencha os campos para{" "}
                  {editingProduct ? "atualizar" : "criar"} um produto no
                  catálogo.
                </DialogDescription>
                <ProductForm
                  product={editingProduct}
                  onSave={handleSave}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button
              onClick={logout}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </div>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-soft border border-yellow-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponível
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.available ? "Sim" : "Não"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4 sm:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-2xl shadow-soft border border-yellow-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.available ? "Disponível" : "Indisponível"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white flex-1 sm:flex-none"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-50 flex-1 sm:flex-none"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Shipping Rates Section */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Taxas de Frete
            </h2>
            <Dialog open={isShippingDialogOpen} onOpenChange={setIsShippingDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditingShipping(null)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white w-full sm:w-auto"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Nova Taxa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-md w-full">
                <DialogTitle className="text-lg sm:text-xl">
                  {editingShipping ? "Editar Taxa" : "Nova Taxa"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Configure a taxa de frete para um bairro.
                </DialogDescription>
                <ShippingForm
                  shipping={editingShipping}
                  onSave={handleSaveShipping}
                  onCancel={() => setIsShippingDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-yellow-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bairro
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa (R$)
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shippingRates.map((shipping) => (
                  <tr key={shipping._id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipping.neighborhood}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {shipping.rate.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => {
                          setEditingShipping(shipping);
                          setIsShippingDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteShipping(shipping._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shippingRates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma taxa de frete cadastrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (p: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
    category: product?.category || ("TRADICIONAIS" as Category),
    description: product?.description || "",
    tags: product?.tags?.join(", ") || "",
    available: product?.available ?? true,
  });
  const [priceInput, setPriceInput] = useState(
    product ? product.price.toFixed(2).replace(".", ",") : "0,00"
  );

  useEffect(() => {
    setForm({
      name: product?.name || "",
      price: product?.price || 0,
      imageUrl: product?.imageUrl || "",
      category: product?.category || ("TRADICIONAIS" as Category),
      description: product?.description || "",
      tags: product?.tags?.join(", ") || "",
      available: product?.available ?? true,
    });
    setPriceInput(
      product ? product.price.toFixed(2).replace(".", ",") : "0,00"
    );
  }, [product]);

  const handlePriceInput = (raw: string) => {
    if (!raw || raw === "0" || raw === "0,00") {
      setPriceInput("0,00");
      setForm((prev) => ({ ...prev, price: 0 }));
      return;
    }

    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) {
      setPriceInput("0,00");
      setForm((prev) => ({ ...prev, price: 0 }));
      return;
    }

    const numericValue = parseInt(digits, 10);
    const reais = Math.floor(numericValue / 100);
    const centavos = numericValue % 100;

    let formatted;
    if (reais === 0) {
      formatted = `0,${centavos.toString().padStart(2, "0")}`;
    } else {
      formatted = `${reais},${centavos.toString().padStart(2, "0")}`;
    }

    setPriceInput(formatted);
    setForm((prev) => ({
      ...prev,
      price: parseFloat(formatted.replace(",", ".")),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    onSave({ ...form, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Nome do Produto
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Sorvete de Chocolate"
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Preço (R$)
          </label>
          <input
            type="text"
            value={priceInput}
            onChange={(e) => handlePriceInput(e.target.value)}
            placeholder="0,00"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          URL da Imagem
        </label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://exemplo.com/imagem.jpg"
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Categoria
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Category })
            }
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
          >
            <option value="TRADICIONAIS">Tradicionais</option>
            <option value="PREMIUM">Premium</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Promo, Novo, Popular"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Descrição
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descreva o produto..."
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={form.available}
          onChange={(e) => setForm({ ...form, available: e.target.checked })}
          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-800">
          Produto disponível
        </label>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-4 py-2 w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium w-full sm:w-auto"
        >
          {product ? "Atualizar Produto" : "Criar Produto"}
        </Button>
      </div>
    </form>
  );
}

function ShippingForm({
  shipping,
  onSave,
  onCancel,
}: {
  shipping: Shipping | null;
  onSave: (s: Partial<Shipping>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    neighborhood: shipping?.neighborhood || "",
    rate: shipping?.rate || 0,
  });
  const [rateInput, setRateInput] = useState(
    shipping ? shipping.rate.toFixed(2).replace(".", ",") : "0,00"
  );

  useEffect(() => {
    setForm({
      neighborhood: shipping?.neighborhood || "",
      rate: shipping?.rate || 0,
    });
    setRateInput(
      shipping ? shipping.rate.toFixed(2).replace(".", ",") : "0,00"
    );
  }, [shipping]);

  const handleRateInput = (raw: string) => {
    if (!raw || raw === "0" || raw === "0,00") {
      setRateInput("0,00");
      setForm((prev) => ({ ...prev, rate: 0 }));
      return;
    }

    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) {
      setRateInput("0,00");
      setForm((prev) => ({ ...prev, rate: 0 }));
      return;
    }

    const numericValue = parseInt(digits, 10);
    const reais = Math.floor(numericValue / 100);
    const centavos = numericValue % 100;

    let formatted;
    if (reais === 0) {
      formatted = `0,${centavos.toString().padStart(2, "0")}`;
    } else {
      formatted = `${reais},${centavos.toString().padStart(2, "0")}`;
    }

    setRateInput(formatted);
    setForm((prev) => ({
      ...prev,
      rate: parseFloat(formatted.replace(",", ".")),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Bairro
        </label>
        <input
          type="text"
          value={form.neighborhood}
          onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          placeholder="Ex: Centro"
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Taxa (R$)
        </label>
        <input
          type="text"
          value={rateInput}
          onChange={(e) => handleRateInput(e.target.value)}
          placeholder="0,00"
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-4 py-2 w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium w-full sm:w-auto"
        >
          {shipping ? "Atualizar Taxa" : "Criar Taxa"}
        </Button>
      </div>
    </form>
  );
}
