import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Mail, 
  Instagram, 
  ShoppingBag, 
  Send,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { StoreCustomizationSettings } from '../../types';
import { 
  getStoreName, 
  getStoreWhatsapp, 
  buildWhatsappUrl, 
  cascadeStoreIdentityUpdate,
  buildRealisticWhatsappOrderMessage,
  SAMPLE_REALISTIC_ORDER_ITEMS,
  RealisticOrderItem
} from '../../utils/storeIdentity';
import { saveStoreSettingsToSupabase } from '../../lib/supabase';

interface ContactWhatsAppPageProps {
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  onNavigateHome?: () => void;
}

export const ContactWhatsAppPage: React.FC<ContactWhatsAppPageProps> = ({
  settings,
  onUpdateSettings,
  onNavigateHome
}) => {
  const storeName = getStoreName(settings);
  const [whatsappNumber, setWhatsappNumber] = useState(getStoreWhatsapp(settings));
  const [whatsappMessage, setWhatsappMessage] = useState(
    settings.general?.whatsappDefaultMessage || 
    'Olá! Vim pelo site da {storeName} e gostaria de informações sobre os produtos e encomendas.'
  );
  const [supportEmail, setSupportEmail] = useState(
    settings.general?.supportEmail || 'atendimento@maisonentrelaco.com.br'
  );
  const [instagramHandle, setInstagramHandle] = useState(
    settings.general?.instagramHandle || '@maisonentrelaço'
  );

  // Estados de Simulação do Atendimento Premium de Pedidos
  const [simulatedCustomerName, setSimulatedCustomerName] = useState('Helena Valença');
  const [simulatedItems, setSimulatedItems] = useState<RealisticOrderItem[]>(SAMPLE_REALISTIC_ORDER_ITEMS);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('Para a querida Beatriz, com muito afeto.');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    setWhatsappNumber(getStoreWhatsapp(settings));
    if (settings.general?.whatsappDefaultMessage) {
      setWhatsappMessage(settings.general.whatsappDefaultMessage);
    }
    if (settings.general?.supportEmail) setSupportEmail(settings.general.supportEmail);
    if (settings.general?.instagramHandle) setInstagramHandle(settings.general.instagramHandle);
  }, [settings]);

  const cleanPhone = whatsappNumber.replace(/\D/g, '') || '5511987654321';

  // Mensagem realista de pedido gerada pelo sistema (como o usuário explicou)
  const realisticOrderMessage = buildRealisticWhatsappOrderMessage({
    storeName,
    items: simulatedItems,
    discountAmount: 40,
    shippingAmount: 0,
    isGiftWrap: includeGiftWrap,
    giftNote: includeGiftWrap ? giftNote : undefined,
    customerName: simulatedCustomerName
  });

  const liveOrderWhatsappUrl = buildWhatsappUrl(cleanPhone, realisticOrderMessage);

  // Mensagem simples de atendimento institucional
  const simpleSupportMessage = whatsappMessage.replace('{storeName}', storeName);
  const simpleSupportWhatsappUrl = buildWhatsappUrl(cleanPhone, simpleSupportMessage);

  const handleSave = async () => {
    setSaveStatus('saving');

    const updated = cascadeStoreIdentityUpdate(settings, {
      whatsappNumber: cleanPhone,
      whatsappDefaultMessage: whatsappMessage.trim(),
      supportEmail: supportEmail.trim(),
      instagramHandle: instagramHandle.trim()
    });

    // Garante que o cabeçalho fique sempre sem o botão de WhatsApp conforme solicitado
    updated.header.actions.showWhatsapp = false;
    if (updated.header.actions.whatsappNumber !== undefined) {
      updated.header.actions.whatsappNumber = cleanPhone;
    }

    onUpdateSettings(updated);

    try {
      await saveStoreSettingsToSupabase(updated);
    } catch {
      // Salva localmente com segurança
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleCopyOrderMessage = () => {
    navigator.clipboard.writeText(realisticOrderMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Banner Superior Nobre */}
      <div className="bg-[#2C231C] text-[#FAF8F5] p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/30 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fechamento de Pedidos via WhatsApp</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
            WhatsApp para Recebimento de Pedidos do Carrinho
          </h3>
          <p className="text-xs sm:text-sm text-[#D7C9BA] max-w-2xl font-light leading-relaxed">
            O WhatsApp funciona como o canal exclusivo de atendimento e fechamento de pedidos: quando a pessoa adiciona os itens na sacola de compras e clica em <strong>Iniciar Pedido</strong>, o sistema cria automaticamente a lista completa com todas as peças selecionadas, quantidades e valores, e coloca esse texto diretamente na barra de conversa do WhatsApp do atelier.
          </p>
        </div>
      </div>

      {/* Grid: Configuração de Contatos + Sistema de Pedidos WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna 1: Dados de Contato e WhatsApp */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/40 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#BFAE9C]/30">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h4 className="font-serif text-base text-[#2C231C] font-semibold tracking-wide">
              WhatsApp para Receber os Pedidos
            </h4>
          </div>

          <div className="space-y-4">
            {/* Número do WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#3D3229] flex items-center justify-between">
                <span>Número do WhatsApp (com DDD)</span>
                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  +{cleanPhone}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: 5511987654321"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-sm sm:text-base font-mono text-[#2C231C] focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                />
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#7A5B43]/80">
                Informe o código do país e DDD (ex: 55 11 98765-4321). Todos os pedidos iniciados no carrinho serão enviados para este número.
              </p>
            </div>

            {/* Teste Rápido do Número */}
            <div className="pt-1">
              <a
                href={simpleSupportWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Testar Conversa no WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            </div>

            {/* Como o fluxo funciona */}
            <div className="p-3 bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs text-xs text-[#3D3229] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#241E1A]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fluxo do Pedido no Carrinho:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-[#5A4839]">
                <li>O cliente adiciona os produtos ao carrinho de compras.</li>
                <li>Ao abrir a sacola e clicar em <strong>"Iniciar Pedido"</strong>, o sistema monta a lista de itens.</li>
                <li>O WhatsApp abre com a mensagem completa na barra de chat, pronta para o cliente enviar.</li>
              </ol>
            </div>

            {/* Mensagem Padrão de Acolhimento Geral */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#3D3229]">
                Mensagem Padrão de Contato Geral
              </label>
              <textarea
                rows={3}
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Olá! Vim pelo site da {storeName}..."
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/60 rounded-xs text-xs sm:text-sm text-[#2C231C] focus:outline-none focus:border-[#7A5B43] focus:bg-white transition-all"
              />
              <p className="text-[10px] text-[#7A5B43]">
                Dica: O termo <code className="bg-amber-100/60 px-1 py-0.5 rounded text-[#2C231C]">{'{storeName}'}</code> é substituído pelo nome atual da loja.
              </p>
            </div>

            {/* Outros Canais de Contato */}
            <div className="space-y-3 pt-3 border-t border-[#BFAE9C]/30">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7A5B43] block">
                Outros Canais Institucionais
              </span>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#3D3229] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>E-mail de Atendimento</span>
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="atendimento@loja.com.br"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-xs text-[#2C231C] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#3D3229] flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Perfil do Instagram</span>
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@nomedaloja"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#BFAE9C]/50 rounded-xs text-xs text-[#2C231C] focus:outline-none focus:border-[#7A5B43]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Coluna 2: Sistema de Atendimento Premium & Lista de Pedidos via WhatsApp */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-xs border border-[#BFAE9C]/40 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#BFAE9C]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="font-serif text-base text-[#2C231C] font-semibold tracking-wide">
                Atendimento Premium • Pedidos Automatizados no WhatsApp
              </h4>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto font-medium">
              Checkout Inteligente
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#5A4839] leading-relaxed">
              No e-Commerce, quando o cliente finaliza as compras pelo <strong>Atendimento Premium</strong>, 
              o sistema compila a sacola em uma lista clara e estruturada, enviando diretamente para o WhatsApp da loja para que você ou sua equipe prestem um atendimento exclusivo e personalizado.
            </p>

            {/* Simulador da Lista de Pedidos */}
            <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#BFAE9C]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5B43] flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Simulador em Tempo Real do Pedido</span>
                </span>
                <span className="text-[10px] text-[#7A5B43]">
                  3 itens selecionados
                </span>
              </div>

              {/* Controles do Simulador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#7A5B43]">
                    Nome do Cliente:
                  </label>
                  <input
                    type="text"
                    value={simulatedCustomerName}
                    onChange={(e) => setSimulatedCustomerName(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-[#BFAE9C]/40 rounded-xs text-xs text-[#2C231C]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3 sm:pt-4">
                  <input
                    type="checkbox"
                    id="giftSim"
                    checked={includeGiftWrap}
                    onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="giftSim" className="text-xs text-[#2C231C] cursor-pointer">
                    Incluir Embalagem de Presente (+ R$ 15)
                  </label>
                </div>
              </div>

              {/* Caixa de Texto da Mensagem Formatada para WhatsApp */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#3D3229]">
                    Mensagem que chegará no seu WhatsApp:
                  </span>
                  <button
                    onClick={handleCopyOrderMessage}
                    className="text-[10px] text-[#7A5B43] hover:text-[#2C231C] flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedMessage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMessage ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <pre className="p-3.5 bg-[#1C1714] text-emerald-300 rounded-xs font-mono text-[11px] leading-relaxed max-w-full overflow-x-auto whitespace-pre-wrap border border-[#BFAE9C]/25 shadow-inner">
                  {realisticOrderMessage}
                </pre>
              </div>

              {/* Botão de Teste Real de Disparo do Pedido */}
              <div className="pt-2">
                <a
                  href={liveOrderWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Testar Envio Real da Lista de Pedido no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
                <p className="text-[10.5px] text-[#7A5B43] text-center mt-1.5">
                  Abre o WhatsApp com todos os itens, quantidades e valores calculados para demonstração imediata.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xs border border-amber-200/60 text-xs text-[#7A5B43] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#2C231C]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Integração com a Sacola e Checkout:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Essa mesma lógica já está ativa na sacola do e-Commerce: quando o visitante clica em 
                <strong> "Finalizar Pedido via Concierge"</strong>, o carrinho monta a lista personalizada e abre o WhatsApp configurado nesta tela.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Barra de Ação Inferior (100% RESPONSIVA, SEM QUEBRAS NO MOBILE) */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xs border border-[#BFAE9C]/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#7A5B43]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium truncate">Canais de contato configurados para a loja</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-4 py-2 border border-[#BFAE9C]/70 text-[#3D3229] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver na Loja Virtual</span>
              <ExternalLink className="w-3 h-3 text-[#7A5B43]" />
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {saveStatus === 'saving' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{saveStatus === 'saved' ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
