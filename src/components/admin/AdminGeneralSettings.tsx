import React, { useState, useRef, useEffect } from 'react';
import { StoreCustomizationSettings, Product, DashboardFounderImage } from '../../types';
import { cascadeStoreIdentityUpdate, getStoreName, getStoreWhatsapp } from '../../utils/storeIdentity';
import { uploadImageToSupabase } from '../../lib/supabase';
import {
  Settings,
  Store,
  Phone,
  Mail,
  Instagram,
  Clock,
  Shield,
  Download,
  Upload,
  Check,
  Sparkles,
  AlertCircle,
  Copy,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Trash2,
  UserCheck,
  Home,
  Plus,
  Sliders,
  Quote
} from 'lucide-react';

interface AdminGeneralSettingsProps {
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  products: Product[];
}

export const AdminGeneralSettings: React.FC<AdminGeneralSettingsProps> = ({
  settings,
  onUpdateSettings,
  products
}) => {
  const [activeTab, setActiveTab] = useState<'brand' | 'founder' | 'contact' | 'checkout' | 'backup'>('brand');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local editable form fields
  const [storeName, setStoreName] = useState(getStoreName(settings));
  const [slogan, setSlogan] = useState(settings.general?.tagline || 'Objetos de Memória & Rituais Aristocráticos');
  const [whatsappNumber, setWhatsappNumber] = useState(getStoreWhatsapp(settings));
  const [contactEmail, setContactEmail] = useState(settings.general?.supportEmail || 'atendimento@maisonentrelaco.com.br');
  const [instagramHandle, setInstagramHandle] = useState(settings.general?.instagramHandle || '@maisonentrelaco');
  const [businessHours, setBusinessHours] = useState('Segunda a Sexta, das 09h às 18h');
  const [craftingDays, setCraftingDays] = useState('3 a 5 dias úteis de cura artesanal');
  const [freeShippingNotice, setFreeShippingNotice] = useState('Frete cortesia da Maison para todo o Brasil acima de R$ 350');

  // Founder Data and Management
  const founderData = settings.dashboardFounder || {
    enabled: true,
    ownerName: settings.founder?.name || 'Aline de La Tour',
    ownerRole: settings.founder?.role || 'Fundadora & Diretora Criativa',
    welcomeMessage: 'Mesa de Criação & Atelier da Fundadora',
    quote: settings.founder?.quote || 'O luxo autêntico é o afeto e o tempo lapidados à mão.',
    heroBgImage: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85',
    sidebarAvatarImage: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85',
    gallery: [
      {
        id: 'df-1',
        url: settings.founder?.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
        title: 'Retrato Principal da Criadora',
        caption: 'Fotografia autoral de luz natural da fundadora',
        createdAt: '2025-01-10'
      },
      {
        id: 'df-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
        title: 'No Atelier em Dia de Alquimia',
        caption: 'Seleção botânica e infusões aromáticas artesanais',
        createdAt: '2025-02-14'
      },
      {
        id: 'df-3',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
        title: 'Curadoria de Fios Nobres',
        caption: 'Estudo do entrelaçado manual e embalagens em linho',
        createdAt: '2025-03-01'
      }
    ]
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Editable Founder Info
  const [ownerNameInput, setOwnerNameInput] = useState(founderData.ownerName);
  const [ownerRoleInput, setOwnerRoleInput] = useState(founderData.ownerRole);
  const [ownerQuoteInput, setOwnerQuoteInput] = useState(founderData.quote);

  // Auto-salva campos institucionais e contatos continuamente
  const isInitialGeneralMount = useRef(true);
  useEffect(() => {
    if (isInitialGeneralMount.current) {
      isInitialGeneralMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const updated = cascadeStoreIdentityUpdate(settings, {
        storeName: storeName.trim(),
        tagline: slogan.trim(),
        whatsappNumber: whatsappNumber.replace(/\D/g, ''),
        supportEmail: contactEmail.trim(),
        instagramHandle: instagramHandle.trim()
      });
      onUpdateSettings(updated);
    }, 600);

    return () => clearTimeout(timer);
  }, [storeName, slogan, whatsappNumber, contactEmail, instagramHandle]);

  // Auto-salva campos da fundadora continuamente
  const isInitialFounderMount = useRef(true);
  useEffect(() => {
    if (isInitialFounderMount.current) {
      isInitialFounderMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const updatedFounderSettings = {
        ...founderData,
        ownerName: ownerNameInput.trim() || founderData.ownerName,
        ownerRole: ownerRoleInput.trim() || founderData.ownerRole,
        quote: ownerQuoteInput.trim() || founderData.quote
      };

      onUpdateSettings({
        ...settings,
        founder: {
          ...settings.founder,
          name: ownerNameInput.trim() || settings.founder.name,
          role: ownerRoleInput.trim() || settings.founder.role,
          quote: ownerQuoteInput.trim() || settings.founder.quote
        },
        dashboardFounder: updatedFounderSettings
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [ownerNameInput, ownerRoleInput, ownerQuoteInput]);

  const handleSaveGeneral = () => {
    const updated = cascadeStoreIdentityUpdate(settings, {
      storeName: storeName.trim(),
      tagline: slogan.trim(),
      whatsappNumber: whatsappNumber.replace(/\D/g, ''),
      supportEmail: contactEmail.trim(),
      instagramHandle: instagramHandle.trim()
    });

    onUpdateSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImageToSupabase(file, 'dashboard-founder');
      if (result) {
        setNewImageUrl(result);
        if (!newImageTitle) {
          setNewImageTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar imagem para o Supabase:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPortrait = () => {
    if (!newImageUrl.trim()) return;

    const newPortrait: DashboardFounderImage = {
      id: `portrait-${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || 'Retrato Autoral',
      caption: newImageCaption.trim() || 'Fotografia autoral do atelier',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedGallery = [newPortrait, ...(founderData.gallery || [])];
    const updatedFounderSettings = {
      ...founderData,
      gallery: updatedGallery
    };

    onUpdateSettings({
      ...settings,
      dashboardFounder: updatedFounderSettings
    });

    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageCaption('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSetHeroBg = (url: string) => {
    const updatedFounderSettings = {
      ...founderData,
      heroBgImage: url
    };
    onUpdateSettings({
      ...settings,
      dashboardFounder: updatedFounderSettings
    });
  };

  const handleSetSidebarAvatar = (url: string) => {
    const updatedFounderSettings = {
      ...founderData,
      sidebarAvatarImage: url
    };
    onUpdateSettings({
      ...settings,
      dashboardFounder: updatedFounderSettings
    });
  };

  const handleApplyToHomeFounder = (url: string) => {
    onUpdateSettings({
      ...settings,
      founder: {
        ...settings.founder,
        imageUrl: url
      }
    });
  };

  const handleDeletePortrait = (id: string) => {
    const updatedGallery = (founderData.gallery || []).filter(item => item.id !== id);
    const updatedFounderSettings = {
      ...founderData,
      gallery: updatedGallery
    };
    onUpdateSettings({
      ...settings,
      dashboardFounder: updatedFounderSettings
    });
  };

  const handleSaveFounderTexts = () => {
    const updatedFounderSettings = {
      ...founderData,
      ownerName: ownerNameInput.trim() || founderData.ownerName,
      ownerRole: ownerRoleInput.trim() || founderData.ownerRole,
      quote: ownerQuoteInput.trim() || founderData.quote
    };

    onUpdateSettings({
      ...settings,
      founder: {
        ...settings.founder,
        name: ownerNameInput.trim() || settings.founder.name,
        role: ownerRoleInput.trim() || settings.founder.role,
        quote: ownerQuoteInput.trim() || settings.founder.quote
      },
      dashboardFounder: updatedFounderSettings
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      products
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `maison_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy JSON
  const handleCopyJSON = () => {
    const backupData = { settings, products };
    navigator.clipboard.writeText(JSON.stringify(backupData, null, 2));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5CBB8]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8C4A4D] mb-1">
            <Settings className="w-4 h-4" />
            <span className="text-[10.5px] uppercase tracking-widest font-semibold">
              Configurações do Atelier
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#2B1718] font-normal">
            Parâmetros & Informações Globais
          </h3>
          <p className="text-xs text-[#7A5B43] mt-0.5">
            Personalize a identidade da marca, retratos da fundadora, contatos oficiais e exporte backups.
          </p>
        </div>

        <button
          onClick={activeTab === 'founder' ? handleSaveFounderTexts : handleSaveGeneral}
          className="px-5 py-2.5 bg-[#8C4A4D] hover:bg-[#72393B] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
        >
          <Check className="w-4 h-4" />
          <span>{saveSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5CBB8]/50 pb-2 overflow-x-auto">
        {[
          { id: 'brand', label: 'Identidade da Marca', icon: Store },
          { id: 'founder', label: 'Retratos da Fundadora', icon: Camera },
          { id: 'contact', label: 'Contato & Redes', icon: Phone },
          { id: 'checkout', label: 'Boutique & Rituais', icon: Sparkles },
          { id: 'backup', label: 'Backup & Exportação', icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium flex items-center gap-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2B1718] text-[#FAF5EE] shadow-xs'
                  : 'bg-white text-[#7A5B43] hover:bg-[#FAF6F2] border border-[#E5CBB8]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5CBB8]/70 shadow-xs space-y-6">
        
        {/* Aba 1: Identidade da Marca */}
        {activeTab === 'brand' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                Nome Oficial da Maison / Loja
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl font-serif text-sm text-[#2B1718] focus:outline-none focus:border-[#8C4A4D]"
              />
              <p className="text-[10px] text-[#7A5B43] mt-1">
                Utilizado no cabeçalho, rodapé e títulos das páginas.
              </p>
            </div>

            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                Slogan / Manifesto
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl font-serif text-xs text-[#2B1718] focus:outline-none focus:border-[#8C4A4D]"
              />
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E5CBB8]/50 rounded-2xl space-y-2">
              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#2B1718] block">
                Origens & Autenticidade
              </span>
              <p className="text-[11px] text-[#7A5B43] leading-relaxed">
                Maison Entrelaço • Atelier de Criação Autoral. Inspiração nas residências históricas da França e Itália com matérias-primas botânicas e fios nobres brasileiros.
              </p>
            </div>
          </div>
        )}

        {/* Aba 2: Retratos da Fundadora & Imagens */}
        {activeTab === 'founder' && (
          <div className="space-y-6 text-xs">
            {/* Cabeçalho da Aba */}
            <div>
              <div className="flex items-center gap-2 text-[#8C4A4D] mb-1">
                <span className="font-serif text-sm">✦</span>
                <span className="text-[11px] uppercase tracking-widest font-semibold">
                  Presença Autoral & Menu Lateral
                </span>
              </div>
              <h4 className="font-serif text-lg text-[#2B1718] font-semibold mb-1">
                Identidade da Fundadora & Cabeçalho do Menu Lateral
              </h4>
              <p className="text-[#7A5B43] text-xs">
                Edite a foto, o nome e o cargo exibidos no cabeçalho do menu lateral do sistema, no Dashboard da Criadora e na página inicial da loja.
              </p>
            </div>

            {/* Preview ao Vivo do Cabeçalho do Menu Lateral com Pontinho Prata */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2B1A1B] via-[#231516] to-[#180E0F] text-[#FAF5EE] border border-[#4E3133] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#E5BBA5] via-[#D4AF37] to-[#F7EDE8] shadow-[0_2px_10px_rgba(229,187,165,0.3)] shrink-0">
                  <img
                    src={
                      founderData.sidebarAvatarImage ||
                      settings.founder?.imageUrl ||
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85'
                    }
                    alt={ownerNameInput}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  {/* Pontinho Prata Nobre de Conexão */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-white border-2 border-[#231516] shadow-[0_0_8px_rgba(241,245,249,0.95)] ring-1 ring-slate-300/80"
                    title="Pontinho Prata • Atelier Conectado"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-base tracking-wide text-[#FAF6F2] font-medium">
                      {ownerNameInput || 'Aline de La Tour'}
                    </span>
                    <span className="text-xs text-[#E5BBA5]">✦</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#D8BDB0] font-light">
                    {ownerRoleInput || 'Fundadora & Diretora Criativa'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-black/40 text-[#E5BBA5] text-[10px] uppercase tracking-wider font-medium border border-[#E5BBA5]/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-200 shadow-xs" />
                  <span>Preview Oficial do Menu Lateral</span>
                </span>
              </div>
            </div>

            {/* Informações Textuais da Dona */}
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E5CBB8]/80 space-y-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3229] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#8C4A4D]" />
                <span>Dados Oficiais da Fundadora</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider font-medium text-[#7A5B43] block mb-1">
                    Nome da Fundadora (Menu Lateral e Dashboard)
                  </label>
                  <input
                    type="text"
                    value={ownerNameInput}
                    onChange={(e) => setOwnerNameInput(e.target.value)}
                    placeholder="Ex: Aline de La Tour"
                    className="w-full p-2.5 bg-white border border-[#CBB3A2] rounded-xl text-xs font-medium text-[#2B1718] focus:border-[#8C4A4D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] uppercase tracking-wider font-medium text-[#7A5B43] block mb-1">
                    Cargo / Subtítulo Oficial
                  </label>
                  <input
                    type="text"
                    value={ownerRoleInput}
                    onChange={(e) => setOwnerRoleInput(e.target.value)}
                    placeholder="Ex: Fundadora & Diretora Criativa"
                    className="w-full p-2.5 bg-white border border-[#CBB3A2] rounded-xl text-xs font-medium text-[#2B1718] focus:border-[#8C4A4D] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-medium text-[#7A5B43] block mb-1">
                  Citação Poética / Filosofia da Criadora
                </label>
                <textarea
                  rows={2}
                  value={ownerQuoteInput}
                  onChange={(e) => setOwnerQuoteInput(e.target.value)}
                  placeholder="Frase inspiradora da fundadora exibida no Dashboard e na vitrine..."
                  className="w-full p-2.5 bg-white border border-[#CBB3A2] rounded-xl text-xs text-[#2B1718] resize-none focus:border-[#8C4A4D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveFounderTexts}
                  className="px-5 py-2 bg-[#8C4A4D] hover:bg-[#72393B] text-white text-[11.5px] uppercase tracking-wider font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-102"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Dados da Fundadora</span>
                </button>
              </div>
            </div>

            {/* Upload de Imagem */}
            <div className="p-5 bg-[#FAF6F2] rounded-2xl border border-[#E5CBB8]/70 space-y-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3229] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#8C4A4D]" />
                <span>Adicionar Novo Retrato ou Foto ao Acervo</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4">
                  {newImageUrl ? (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#E5BBA5] shadow-xs">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setNewImageUrl('')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#CBB3A2] bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-[#8C4A4D] transition-colors"
                    >
                      <Camera className="w-6 h-6 text-[#8C4A4D] opacity-80 mb-1" />
                      <span className="text-[11px] text-[#7A5B43] font-medium">Enviar do Celular/PC</span>
                      <span className="text-[9px] text-[#A89080] mt-0.5">JPG, PNG ou WebP</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="sm:col-span-8 space-y-2.5">
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="Título da foto (ex: Retrato Oficial da Fundadora)"
                    className="w-full p-2 text-xs bg-white border border-[#CBB3A2] rounded-xl focus:border-[#8C4A4D] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Ou cole a URL da imagem aqui"
                    className="w-full p-2 text-xs bg-white border border-[#CBB3A2] rounded-xl focus:border-[#8C4A4D] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    placeholder="Legenda poética (opcional)"
                    className="w-full p-2 text-xs bg-white border border-[#CBB3A2] rounded-xl focus:border-[#8C4A4D] focus:outline-none"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleAddPortrait}
                      disabled={!newImageUrl.trim() || isUploading}
                      className="px-4 py-1.5 bg-[#8C4A4D] hover:bg-[#72393B] disabled:opacity-50 text-white text-[11px] uppercase tracking-wider font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3" />
                      <span>Adicionar ao Acervo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeria de Fotos Existentes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#3D3229] block">
                  ✦ Acervo de Retratos Salvos ({founderData.gallery?.length || 0})
                </span>
                <span className="text-[10px] text-[#7A5B43]">
                  Selecione onde cada foto deve ser aplicada
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(founderData.gallery || []).map((item) => {
                  const isHeroBg = founderData.heroBgImage === item.url;
                  const isSidebarAvatar = founderData.sidebarAvatarImage === item.url;
                  const isHomeFounder = settings.founder?.imageUrl === item.url;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 bg-[#FAF6F2] rounded-2xl border flex flex-col justify-between transition-all ${
                        isSidebarAvatar || isHeroBg || isHomeFounder 
                          ? 'border-[#8C4A4D] shadow-sm ring-1 ring-[#8C4A4D]/30' 
                          : 'border-[#E5CBB8]/70'
                      }`}
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeletePortrait(item.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white hover:bg-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Excluir foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        
                        {/* Badges de Ativação */}
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
                          {isSidebarAvatar && (
                            <span className="px-2 py-0.5 rounded-full bg-[#2B1718]/90 text-[#FFD8C7] text-[8.5px] uppercase tracking-wider font-semibold border border-[#E5BBA5]/40 backdrop-blur-xs">
                              Menu Lateral
                            </span>
                          )}
                          {isHeroBg && (
                            <span className="px-2 py-0.5 rounded-full bg-[#8C4A4D]/90 text-white text-[8.5px] uppercase tracking-wider font-semibold border border-white/30 backdrop-blur-xs">
                              Dashboard
                            </span>
                          )}
                          {isHomeFounder && (
                            <span className="px-2 py-0.5 rounded-full bg-stone-900/90 text-amber-200 text-[8.5px] uppercase tracking-wider font-semibold border border-white/30 backdrop-blur-xs">
                              Home
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 mb-2.5">
                        <span className="font-serif text-xs font-semibold text-[#2B1718] block truncate">
                          {item.title}
                        </span>
                        {item.caption && (
                          <span className="text-[10px] text-[#7A5B43] line-clamp-1 block">
                            {item.caption}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[#E5CBB8]/50">
                        {/* Botão de Definir Avatar do Menu Lateral */}
                        <button
                          onClick={() => handleSetSidebarAvatar(item.url)}
                          className={`w-full py-1.5 text-[10px] uppercase tracking-wider rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSidebarAvatar 
                              ? 'bg-[#2B1718] text-[#FFD8C7] font-semibold border border-[#E5BBA5]/40' 
                              : 'bg-white text-[#7A5B43] hover:bg-[#2B1718] hover:text-[#FAF6F2] border border-[#CBB3A2]'
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>{isSidebarAvatar ? '✓ Avatar do Menu Ativo' : 'Definir no Menu Lateral'}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleSetHeroBg(item.url)}
                            className={`py-1 text-[9.5px] uppercase tracking-wider rounded-lg font-medium cursor-pointer transition-all ${
                              isHeroBg ? 'bg-[#8C4A4D] text-white font-semibold' : 'bg-white text-[#7A5B43] hover:bg-[#8C4A4D] hover:text-white border border-[#CBB3A2]'
                            }`}
                          >
                            {isHeroBg ? '✓ Dashboard' : 'Dashboard'}
                          </button>
                          <button
                            onClick={() => handleApplyToHomeFounder(item.url)}
                            className={`py-1 text-[9.5px] uppercase tracking-wider rounded-lg font-medium cursor-pointer transition-all ${
                              isHomeFounder ? 'bg-[#8C4A4D] text-white font-semibold' : 'bg-white text-[#7A5B43] hover:bg-[#8C4A4D] hover:text-white border border-[#CBB3A2]'
                            }`}
                          >
                            {isHomeFounder ? '✓ Na Home' : 'Na Home'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Aba 3: Contato & Redes */}
        {activeTab === 'contact' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp de Atendimento</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+55 11 98765-4321"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl font-mono text-xs focus:outline-none focus:border-[#8C4A4D]"
                />
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>E-mail Oficial</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl text-xs focus:outline-none focus:border-[#8C4A4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5 mb-1">
                  <Instagram className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Instagram da Maison</span>
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl text-xs focus:outline-none focus:border-[#8C4A4D]"
                />
              </div>

              <div>
                <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#7A5B43]" />
                  <span>Horário de Funcionamento</span>
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl text-xs focus:outline-none focus:border-[#8C4A4D]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aba 4: Boutique & Rituais */}
        {activeTab === 'checkout' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                Prazo Médio de Cura & Criação Artesanal
              </label>
              <input
                type="text"
                value={craftingDays}
                onChange={(e) => setCraftingDays(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl text-xs focus:outline-none focus:border-[#8C4A4D]"
              />
            </div>

            <div>
              <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43] block mb-1">
                Aviso de Frete Cortesia
              </label>
              <input
                type="text"
                value={freeShippingNotice}
                onChange={(e) => setFreeShippingNotice(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5CBB8]/70 rounded-xl text-xs focus:outline-none focus:border-[#8C4A4D]"
              />
            </div>
          </div>
        )}

        {/* Aba 5: Backup & Exportação */}
        {activeTab === 'backup' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FAF8F5] border border-[#E5CBB8]/60 rounded-2xl space-y-2">
              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#2B1718] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cópia de Segurança Integral (JSON)</span>
              </span>
              <p className="text-[11px] text-[#7A5B43] leading-relaxed">
                Exporte todo o acervo de configurações, retratos da fundadora, produtos e dados para restaurar a qualquer momento.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportBackup}
                className="px-4 py-2.5 bg-[#2B1718] hover:bg-[#3D2022] text-[#FAF5EE] rounded-full flex items-center gap-2 uppercase tracking-wider text-[11px] font-medium shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Arquivo de Backup</span>
              </button>

              <button
                onClick={handleCopyJSON}
                className="px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#7A5B43] border border-[#E5CBB8]/70 rounded-full flex items-center gap-2 uppercase tracking-wider text-[11px] font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotification ? 'Copiado para a Área de Transferência!' : 'Copiar JSON'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
