import React, { useState, useEffect } from 'react';
import { Product, StoreCustomizationSettings } from '../../types';
import { getStoreName } from '../../utils/storeIdentity';
import { safeStorage } from '../../utils/safeStorage';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  MessageCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  Gift,
  User,
  MapPin,
  X,
  Check,
  Sparkles
} from 'lucide-react';

export interface BoutiqueOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  status: 'pending' | 'crafting' | 'shipped' | 'delivered';
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  totalAmount: number;
  giftMessage?: string;
  createdAt: string;
}

const DEFAULT_ORDERS: BoutiqueOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ME-2026-084',
    customerName: 'Helena Visconti',
    customerPhone: '+55 11 98765-4321',
    customerEmail: 'helena.visconti@example.com',
    address: 'Alameda Gabriel Monteiro da Silva, 1420',
    city: 'São Paulo - SP',
    status: 'crafting',
    items: [
      {
        productId: 'prod-1',
        productName: 'Vela Versailles Imperiale • Cera Vegetal & Figo',
        price: 240,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80'
      },
      {
        productId: 'prod-2',
        productName: 'Sabonete Botânico Prensado a Frio • Flor de Laranjeira',
        price: 85,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 735,
    giftMessage: 'Para celebrar seu novo refúgio com as memórias olfativas da Maison. Com todo meu carinho.',
    createdAt: '2026-03-28T14:30:00.000Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'ME-2026-085',
    customerName: 'Eduardo Fontes',
    customerPhone: '+55 21 99123-8899',
    customerEmail: 'eduardo.fontes@example.com',
    address: 'Av. Vieira Souto, 380 - Apto 601',
    city: 'Rio de Janeiro - RJ',
    status: 'pending',
    items: [
      {
        productId: 'prod-3',
        productName: 'Caminho de Mesa em Fios de Algodão Nobre',
        price: 490,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 490,
    giftMessage: 'Presente especial de aniversário de casamento.',
    createdAt: '2026-03-29T10:15:00.000Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'ME-2026-083',
    customerName: 'Camila de Orleans',
    customerPhone: '+55 31 98456-1122',
    customerEmail: 'camila.orleans@example.com',
    address: 'Rua Tomé de Souza, 800',
    city: 'Belo Horizonte - MG',
    status: 'delivered',
    items: [
      {
        productId: 'prod-1',
        productName: 'Vela Versailles Imperiale',
        price: 240,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalAmount: 240,
    createdAt: '2026-03-25T16:00:00.000Z'
  }
];

export const AdminOrdersManager: React.FC<{ storeSettings?: StoreCustomizationSettings }> = ({ storeSettings }) => {
  const storeName = getStoreName(storeSettings);
  const [orders, setOrders] = useState<BoutiqueOrder[]>(() => {
    try {
      const stored = safeStorage.getItem('maison_boutique_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignore parse error
    }
    return DEFAULT_ORDERS;
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<BoutiqueOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New order form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newOrderTotal, setNewOrderTotal] = useState(240);
  const [newGiftMessage, setNewGiftMessage] = useState('');

  // Persist orders on change
  useEffect(() => {
    safeStorage.setItem('maison_boutique_orders', JSON.stringify(orders));
  }, [orders]);

  // Update order status
  const handleUpdateStatus = (orderId: string, status: BoutiqueOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  // Add new order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const newOrder: BoutiqueOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ME-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim() || '+55 11 99999-0000',
      customerEmail: 'cliente@maison.com',
      address: newCustomerAddress.trim() || 'Endereço registrado na boutique',
      city: 'Brasil',
      status: 'pending',
      items: [
        {
          productId: 'item-custom',
          productName: 'Encomenda Sob Medida do Atelier',
          price: newOrderTotal,
          quantity: 1
        }
      ],
      totalAmount: newOrderTotal,
      giftMessage: newGiftMessage.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setNewGiftMessage('');
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BoutiqueOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-amber-50 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pendente</span>
          </span>
        );
      case 'crafting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-blue-50 text-blue-900 border border-blue-300">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Em Produção Artesanal</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-purple-50 text-purple-900 border border-purple-300">
            <Truck className="w-3 h-3 text-purple-600" />
            <span>Enviado</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Entregue</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xs border border-[#BFAE9C]/35 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#7A5B43] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Boutique Online & Encomendas
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#2C231C] font-normal">
            Pedidos da Boutique
          </h3>
          <p className="text-xs text-[#7A5B43] mt-0.5">
            Gerencie encomendas, confira mensagens de presentes afetivos e atualize o status de produção das peças.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="px-4 py-2.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Encomenda Manual</span>
        </button>
      </div>

      {/* Cards de Métricas de Vendas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#7A5B43] block">
            Total de Pedidos
          </span>
          <span className="font-serif text-2xl font-semibold text-[#2C231C] block mt-1">
            {orders.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-amber-800 block">
            Pendentes
          </span>
          <span className="font-serif text-2xl font-semibold text-amber-900 block mt-1">
            {orders.filter(o => o.status === 'pending').length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-blue-800 block">
            Em Produção
          </span>
          <span className="font-serif text-2xl font-semibold text-blue-900 block mt-1">
            {orders.filter(o => o.status === 'crafting').length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/30 shadow-2xs">
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800 block">
            Volume Total
          </span>
          <span className="font-serif text-2xl font-semibold text-emerald-900 block mt-1">
            R$ {orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-xs border border-[#BFAE9C]/35 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A5B43] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número do pedido (#ME-...), cliente ou cidade..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A5B43] hover:text-[#2C231C]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Abas de Status */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'crafting', label: 'Em Produção' },
            { id: 'shipped', label: 'Enviados' },
            { id: 'delivered', label: 'Entregues' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-xs border transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#3D3229] text-white border-[#3D3229] font-medium shadow-xs'
                  : 'bg-[#FAF8F5] text-[#3D3229] border-[#BFAE9C]/50 hover:bg-[#E8E0D4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xs border border-[#BFAE9C]/35 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-[#BFAE9C]" />
            <h4 className="font-serif text-base text-[#3D3229]">Nenhum pedido encontrado</h4>
            <p className="text-xs text-[#7A5B43]">
              Tente redefinir o filtro de status ou cadastre uma nova encomenda manual.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-xs border border-[#BFAE9C]/35 shadow-xs hover:border-[#7A5B43] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BFAE9C]/20 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-[#3D3229]">
                    #{order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#7A5B43]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="font-serif font-bold text-[#2C231C] text-sm">
                    R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Informações do Cliente & Itens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Cliente */}
                <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xs border border-[#BFAE9C]/30">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Cliente & Destino</span>
                  </span>
                  <p className="font-serif font-semibold text-[#2C231C] text-sm">
                    {order.customerName}
                  </p>
                  <p className="text-[11px] text-[#7A5B43] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{order.address} • {order.city}</span>
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${order.customerName}, tudo bem? Sou do Atelier ${storeName} referente ao seu pedido #${order.orderNumber}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs text-[10.5px] uppercase tracking-wider font-medium shadow-2xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Conversar no WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Itens Comprados */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A5B43] block">
                    Obras Solicitadas ({order.items.length})
                  </span>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#FAF8F5] rounded-xs border border-[#BFAE9C]/25 text-xs">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-8 h-10 object-cover rounded-xs"
                            />
                          )}
                          <div>
                            <span className="font-medium text-[#2C231C] block">
                              {item.productName}
                            </span>
                            <span className="text-[10.5px] text-[#7A5B43]">
                              Quantidade: {item.quantity} un.
                            </span>
                          </div>
                        </div>
                        <span className="font-serif font-semibold text-[#2C231C]">
                          R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mensagem de Presente se houver */}
                  {order.giftMessage && (
                    <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xs text-[11px] text-amber-900 flex items-start gap-2">
                      <Gift className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-[10px] uppercase tracking-wider text-amber-800">
                          Mensagem de Afeto Gravada no Cartão:
                        </span>
                        <p className="italic font-serif mt-0.5">
                          “{order.giftMessage}”
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Barra de Atualização de Status Rápido */}
              <div className="pt-2 border-t border-[#BFAE9C]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[10.5px] text-[#7A5B43] uppercase tracking-wider">
                  Alterar Status do Pedido:
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as BoutiqueOrder['status'])}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs text-[#2C231C] focus:outline-none focus:border-[#7A5B43] font-medium cursor-pointer"
                  >
                    <option value="pending">Pendente (Aguardando)</option>
                    <option value="crafting">Em Produção Artesanal</option>
                    <option value="shipped">Enviado com Rastreio</option>
                    <option value="delivered">Entregue com Sucesso</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nova Encomenda Manual */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrder}
            className="bg-[#FAF8F5] text-[#3D3229] w-full max-w-lg rounded-xs border border-[#BFAE9C]/60 shadow-2xl p-6 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#BFAE9C]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#7A5B43]">
                  Registro Manual
                </span>
                <h4 className="font-serif text-lg text-[#2C231C] font-semibold">
                  Nova Encomenda Sob Medida
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded-full text-[#7A5B43] hover:bg-[#E8E0D4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Ex: Beatriz Albuquerque"
                  className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                    Valor Total (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderTotal}
                    onChange={(e) => setNewOrderTotal(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                  Endereço de Entrega
                </label>
                <input
                  type="text"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs"
                />
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                  Mensagem de Presente Afetivo (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={newGiftMessage}
                  onChange={(e) => setNewGiftMessage(e.target.value)}
                  placeholder="Texto que acompanhará o cartão perfumado..."
                  className="w-full p-2.5 bg-white border border-[#BFAE9C]/60 rounded-xs font-serif"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#BFAE9C]/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#7A5B43]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Encomenda</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
