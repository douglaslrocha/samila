import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  Radio, 
  ExternalLink, 
  Key, 
  Globe, 
  ShieldCheck, 
  AlertTriangle,
  UploadCloud,
  DownloadCloud,
  Layers,
  Sparkles,
  Terminal,
  FileCode,
  Table,
  CheckCircle2,
  Zap,
  Search
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../lib/supabaseSql';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection,
  saveStoreSettingsToSupabase,
  fetchStoreSettingsFromSupabase,
  saveAllProductsToSupabase,
  fetchProductsFromSupabase
} from '../../lib/supabase';
import { StoreCustomizationSettings, Product } from '../../types';

interface DatabaseManagerProps {
  settings: StoreCustomizationSettings;
  onUpdateSettings: (newSettings: StoreCustomizationSettings) => void;
  products?: Product[];
  onUpdateProducts?: (products: Product[]) => void;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  settings,
  onUpdateSettings,
  products = [],
  onUpdateProducts
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'bridge' | 'sql' | 'guide'>('sql');

  // Credenciais Supabase
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialConfig.anonKey);
  const [sourceType, setSourceType] = useState(initialConfig.source);

  // Status de Teste e Sincronização
  const [isTesting, setIsTesting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    tablesFound?: string[];
  }>({
    tested: false,
    success: false,
    message: ''
  });

  const [isSyncingUp, setIsSyncingUp] = useState(false);
  const [isSyncingDown, setIsSyncingDown] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-teste se já houver URL e Key
  useEffect(() => {
    if (initialConfig.url && initialConfig.anonKey) {
      handleTest(initialConfig.url, initialConfig.anonKey);
    }
  }, []);

  const handleTest = async (testUrl?: string, testKey?: string) => {
    setIsTesting(true);
    setConnectionResult({ tested: false, success: false, message: 'Testando conexão com o Supabase...' });
    const result = await testSupabaseConnection(testUrl || supabaseUrl, testKey || supabaseAnonKey);
    setConnectionResult({
      tested: true,
      success: result.success,
      message: result.message,
      tablesFound: result.tablesFound
    });
    setIsTesting(false);
  };

  const handleSaveCredentials = () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setSyncFeedback({ type: 'error', message: 'Por favor, preencha tanto a URL quanto a Chave Anon.' });
      return;
    }
    saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    setSourceType('custom');
    setSyncFeedback({ type: 'success', message: 'Credenciais salvas com sucesso! Realtime ativado.' });
    handleTest(supabaseUrl.trim(), supabaseAnonKey.trim());
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleClearCredentials = () => {
    clearSupabaseConfig();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSourceType('none');
    setConnectionResult({ tested: false, success: false, message: '' });
    setSyncFeedback({ type: 'success', message: 'Credenciais removidas. O sistema operará em fallback local.' });
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SCHEMA_SQL], { type: 'text/sql;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'supabase-schema.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePushAllToDatabase = async () => {
    setIsSyncingUp(true);
    setSyncFeedback(null);
    try {
      const resSettings = await saveStoreSettingsToSupabase(settings);
      let resProducts = { success: true };
      if (products && products.length > 0) {
        resProducts = await saveAllProductsToSupabase(products);
      }

      if (resSettings.success && resProducts.success) {
        setSyncFeedback({
          type: 'success',
          message: 'Tudo sincronizado com sucesso! As personalizações da Home e os produtos foram gravados no Supabase e distribuídos via Realtime.'
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: `Erro ao salvar: ${resSettings.error || 'Verifique se as tabelas existem no banco.'}`
        });
      }
    } catch (err: any) {
      setSyncFeedback({ type: 'error', message: err?.message || 'Falha ao sincronizar' });
    } finally {
      setIsSyncingUp(false);
      setTimeout(() => setSyncFeedback(null), 6000);
    }
  };

  const handlePullFromDatabase = async () => {
    setIsSyncingDown(true);
    setSyncFeedback(null);
    try {
      const remoteSettings = await fetchStoreSettingsFromSupabase();
      if (remoteSettings) {
        onUpdateSettings(remoteSettings);
      }

      if (onUpdateProducts) {
        const remoteProducts = await fetchProductsFromSupabase();
        if (remoteProducts && remoteProducts.length > 0) {
          onUpdateProducts(remoteProducts);
        }
      }

      if (remoteSettings) {
        setSyncFeedback({
          type: 'success',
          message: 'Dados remotos baixados do Supabase com sucesso!'
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: 'Nenhum dado encontrado na tabela store_customization. Execute o script SQL ou clique em "Enviar Dados da Home".'
        });
      }
    } catch (err: any) {
      setSyncFeedback({ type: 'error', message: err?.message || 'Falha ao baixar dados' });
    } finally {
      setIsSyncingDown(false);
      setTimeout(() => setSyncFeedback(null), 6000);
    }
  };

  const schemaTables = [
    { name: 'store_customization', desc: 'Identidade, Hero, Fundadora, Rodapé e Configurações Globais', count: '10 seções em JSONB' },
    { name: 'products', desc: 'Catálogo de Velas, Sabonetes e Crochê com Estoque e Detalhes', count: '17 colunas' },
    { name: 'hero_slides', desc: 'Slides Multimídia em Vídeo/Imagem HD com ordem e status', count: '8 colunas' },
    { name: 'product_lines', desc: 'As Três Casas da Maison & Coleções Especiais', count: '12 colunas' },
    { name: 'orders', desc: 'Pedidos da boutique, itens, presentes e integrações WhatsApp', count: '14 colunas' },
    { name: 'contact_messages', desc: 'Mensagens de Concierge, Encomendas e Fale Conosco', count: '7 colunas' },
    { name: 'product_reviews', desc: 'Avaliações 5 estrelas e depoimentos verificados de clientes', count: '9 colunas' },
    { name: 'coupons', desc: 'Cupons de desconto exclusivos com limites e regras de uso', count: '9 colunas' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F7F4EF] text-[#3D3229]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Banner Superior de Identidade & Status da Conexão */}
        <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#241E1A] text-[#F7F4EF] flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-6 h-6 text-[#D4B996]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl tracking-wide text-[#241E1A]">
                  Banco de Dados & Esquema SQL
                </h2>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7A5B43]/10 text-[#7A5B43] font-semibold">
                  PostgreSQL • Supabase Realtime
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#7A5B43] mt-0.5">
                Esquema completo atualizado para persistência instantânea e sincronização em tempo real entre todos os dispositivos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-[#8C7561] uppercase tracking-widest">
                Status da Conexão
              </div>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${connectionResult.success ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-xs font-medium text-[#241E1A]">
                  {connectionResult.success ? 'Conectado (Realtime Ativo)' : 'Fallback Local Ativo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notificação / Feedback de Sincronização */}
        {syncFeedback && (
          <div className={`p-4 rounded-sm border flex items-center gap-3 text-xs tracking-wide animate-in fade-in duration-300 ${
            syncFeedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {syncFeedback.type === 'success' ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{syncFeedback.message}</span>
          </div>
        )}

        {/* Abas de Navegação */}
        <div className="flex border-b border-[#BFAE9C]/30 gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'sql'
                ? 'border-[#7A5B43] text-[#241E1A] bg-white/60 rounded-t-sm'
                : 'border-transparent text-[#7A5B43] hover:text-[#241E1A]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 shrink-0" />
            <span>Código SQL Atualizado (Copiar / Executar)</span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'bridge'
                ? 'border-[#7A5B43] text-[#241E1A] bg-white/60 rounded-t-sm'
                : 'border-transparent text-[#7A5B43] hover:text-[#241E1A]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>Ponte & Conexão Realtime</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs tracking-wider uppercase font-semibold transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#7A5B43] text-[#241E1A] bg-white/60 rounded-t-sm'
                : 'border-transparent text-[#7A5B43] hover:text-[#241E1A]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Guia Passo a Passo & VPS</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* ABA 1: CÓDIGO SQL COMPLETO E ATUALIZADO */}
        {/* ========================================================================= */}
        {activeTab === 'sql' && (
          <div className="space-y-6">
            
            {/* Destaque das Tabelas e Recursos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#7A5B43]">
                  <Table className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Tabelas</span>
                </div>
                <div className="font-serif text-xl text-[#241E1A] mt-1 font-semibold">8 Tabelas</div>
                <div className="text-[11px] text-[#8C7561] mt-0.5">Estruturadas & Relacionais</div>
              </div>

              <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Tempo Real</span>
                </div>
                <div className="font-serif text-xl text-[#241E1A] mt-1 font-semibold">WebSockets</div>
                <div className="text-[11px] text-[#8C7561] mt-0.5">Replica Identity Full</div>
              </div>

              <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#7A5B43]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Segurança</span>
                </div>
                <div className="font-serif text-xl text-[#241E1A] mt-1 font-semibold">RLS Ativo</div>
                <div className="text-[11px] text-[#8C7561] mt-0.5">Políticas Seguras</div>
              </div>

              <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-3.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#7A5B43]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Carga Inicial</span>
                </div>
                <div className="font-serif text-xl text-[#241E1A] mt-1 font-semibold">Seeds Prontos</div>
                <div className="text-[11px] text-[#8C7561] mt-0.5">Fundadora, Casas & Loja</div>
              </div>
            </div>

            {/* Painel do Código SQL */}
            <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg text-[#241E1A] tracking-wide flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#7A5B43]" />
                    Esquema SQL Atualizado do Backend
                  </h3>
                  <p className="text-xs text-[#7A5B43] mt-0.5">
                    Copie este código para o <strong>SQL Editor</strong> do Supabase ou execute no seu terminal PostgreSQL.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopySql}
                    className="px-4 py-2 bg-[#7A5B43] hover:bg-[#624734] text-white rounded-xs text-xs tracking-wider font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSql ? 'Copiado para o Clipboard!' : 'Copiar Código SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSql}
                    className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#241E1A] border border-[#BFAE9C]/60 rounded-xs text-xs tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar .sql</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Resumo Estrutural */}
              <div className="border border-[#BFAE9C]/30 rounded-xs overflow-hidden">
                <div className="bg-[#FAF7F2] px-3.5 py-2 border-b border-[#BFAE9C]/30 text-[11px] font-semibold text-[#7A5B43] uppercase tracking-wider flex items-center justify-between">
                  <span>Estrutura de Tabelas Incluídas no Script</span>
                  <span className="text-[10px] text-[#8C7561] normal-case">Total: 8 tabelas com Realtime</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#BFAE9C]/20 text-xs">
                  <div className="p-3 space-y-2">
                    {schemaTables.slice(0, 4).map((t) => (
                      <div key={t.name} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <code className="font-mono font-bold text-[#241E1A] text-[11px] bg-[#FAF7F2] px-1 py-0.5 rounded-xs border border-[#BFAE9C]/30">
                            public.{t.name}
                          </code>
                          <span className="text-[11px] text-[#7A5B43] block mt-0.5">{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 space-y-2">
                    {schemaTables.slice(4).map((t) => (
                      <div key={t.name} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <code className="font-mono font-bold text-[#241E1A] text-[11px] bg-[#FAF7F2] px-1 py-0.5 rounded-xs border border-[#BFAE9C]/30">
                            public.{t.name}
                          </code>
                          <span className="text-[11px] text-[#7A5B43] block mt-0.5">{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Caixa de Código SQL com Formatação */}
              <div className="relative">
                <div className="absolute right-3 top-3 z-10">
                  <button
                    onClick={handleCopySql}
                    className="px-2.5 py-1 bg-[#2E241E] hover:bg-[#3D3229] text-[#E8E0D4] border border-[#7A5B43]/50 rounded-xs text-[11px] tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="bg-[#1C1714] text-[#E8E0D4] p-5 pt-8 rounded-xs overflow-x-auto text-xs font-mono max-h-[550px] border border-[#7A5B43]/40 leading-relaxed select-all">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>

              {/* Localização do Arquivo */}
              <div className="bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs p-3.5 text-xs text-[#7A5B43] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCode className="w-4 h-4 text-[#7A5B43] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#241E1A]">Arquivo no código-fonte:</span> <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded-xs border border-[#BFAE9C]/40">ponte-esquema-sql-atualizado.sql</code> <span className="text-[#8C7561] text-[11px]">(na raiz do projeto)</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#8C7561] hidden sm:inline">
                  Exportado automaticamente junto ao app
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: PONTE & CONEXÃO REALTIME */}
        {/* ========================================================================= */}
        {activeTab === 'bridge' && (
          <div className="space-y-6">
            
            {/* Card de Credenciais do Supabase */}
            <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#7A5B43]" />
                  <h3 className="font-serif text-lg text-[#241E1A] tracking-wide">
                    Credenciais de Conexão com o Supabase
                  </h3>
                </div>
                {sourceType === 'env' && (
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Definido via Variável de Ambiente
                  </span>
                )}
              </div>

              <p className="text-xs text-[#7A5B43] leading-relaxed">
                Insira as credenciais do seu projeto Supabase. Quando conectadas, todas as edições feitas na Home e na Fundadora serão gravadas automaticamente na tabela <code className="bg-[#FAF7F2] px-1 py-0.5 rounded-xs border border-[#BFAE9C]/40 font-mono text-[11px]">store_customization</code> e ouvidas em tempo real via WebSockets em todos os dispositivos conectados.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3D3229] uppercase tracking-wider mb-1">
                    SUPABASE_URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#8C7561] absolute left-3 top-3" />
                    <input
                      type="url"
                      placeholder="https://exemplo.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#BFAE9C]/50 rounded-xs focus:outline-hidden focus:border-[#7A5B43] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3D3229] uppercase tracking-wider mb-1">
                    SUPABASE_ANON_KEY (Public Anon Key)
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-[#8C7561] absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#BFAE9C]/50 rounded-xs focus:outline-hidden focus:border-[#7A5B43] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ações de Testar e Salvar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#BFAE9C]/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTest()}
                    disabled={isTesting || !supabaseUrl || !supabaseAnonKey}
                    className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#3D3229] border border-[#BFAE9C]/60 rounded-xs text-xs tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Verificando...' : 'Testar Conexão'}</span>
                  </button>

                  <button
                    onClick={handleSaveCredentials}
                    className="px-4 py-2 bg-[#7A5B43] hover:bg-[#624734] text-white rounded-xs text-xs tracking-wider font-medium transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar & Ativar Realtime</span>
                  </button>
                </div>

                {sourceType === 'custom' && (
                  <button
                    onClick={handleClearCredentials}
                    className="text-xs text-rose-700 hover:text-rose-900 underline transition-colors cursor-pointer"
                  >
                    Limpar Credenciais Salvas
                  </button>
                )}
              </div>

              {/* Box de Chaves do Projeto */}
              <div className="bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#241E1A] uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#7A5B43]" />
                    Chaves Registradas no Sistema
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold uppercase">
                    Configurado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-white border border-[#BFAE9C]/30 rounded-xs">
                    <span className="text-[10px] text-[#8C7561] block font-sans font-semibold">SUPABASE_URL</span>
                    <span className="text-[11px] text-[#241E1A] break-all">{supabaseUrl || 'https://ruhsyvipnjwvcveljasi.supabase.co'}</span>
                  </div>
                  <div className="p-2 bg-white border border-[#BFAE9C]/30 rounded-xs">
                    <span className="text-[10px] text-[#8C7561] block font-sans font-semibold">SUPABASE_PUBLISHABLE_KEY</span>
                    <span className="text-[11px] text-[#241E1A] truncate block">{supabaseAnonKey || 'Configurado via env / painel'}</span>
                  </div>
                  <div className="p-2 bg-white border border-[#BFAE9C]/30 rounded-xs">
                    <span className="text-[10px] text-[#8C7561] block font-sans font-semibold">SUPABASE_SECRET_KEY</span>
                    <span className="text-[11px] text-[#241E1A] truncate block">Configurado no Supabase / Coolify</span>
                  </div>
                  <div className="p-2 bg-white border border-[#BFAE9C]/30 rounded-xs">
                    <span className="text-[10px] text-[#8C7561] block font-sans font-semibold">SUPABASE_JWKS_URL</span>
                    <span className="text-[11px] text-[#241E1A] truncate block">https://ruhsyvipnjwvcveljasi.supabase.co/auth/v1/.well-known/jwks.json</span>
                  </div>
                </div>
              </div>

              {/* Resultado do Teste */}
              {connectionResult.tested && (
                <div className={`mt-3 p-3 rounded-xs border text-xs tracking-wide flex items-start gap-2.5 ${
                  connectionResult.success 
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900' 
                    : 'bg-amber-50/80 border-amber-300 text-amber-900'
                }`}>
                  {connectionResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{connectionResult.message}</div>
                    {connectionResult.tablesFound && connectionResult.tablesFound.length > 0 && (
                      <div className="text-[11px] text-emerald-800 mt-1">
                        Tabelas detectadas prontas: {connectionResult.tablesFound.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ações Rápidas de Sincronização Bidirecional */}
            <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7A5B43]" />
                <h3 className="font-serif text-lg text-[#241E1A] tracking-wide">
                  Sincronização Imediata com o Banco de Dados
                </h3>
              </div>
              <p className="text-xs text-[#7A5B43] leading-relaxed">
                Utilize as ações abaixo para forçar o envio da configuração atual da Home e produtos para o banco de dados remoto ou baixar o estado mais recente que foi editado em outro dispositivo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handlePushAllToDatabase}
                  disabled={isSyncingUp}
                  className="p-4 bg-[#FAF7F2] hover:bg-[#F2EDE4] border border-[#BFAE9C]/50 rounded-xs text-left transition-all group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7A5B43]/15 text-[#7A5B43] flex items-center justify-center group-hover:bg-[#7A5B43] group-hover:text-white transition-colors">
                      <UploadCloud className={`w-4 h-4 ${isSyncingUp ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#241E1A] uppercase tracking-wider">
                        Enviar Dados para o Supabase
                      </h4>
                      <p className="text-[11px] text-[#7A5B43] mt-0.5">
                        Grava toda a Home (Header, Hero, Fundadora, Rodapé, etc.) e Produtos no PostgreSQL.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handlePullFromDatabase}
                  disabled={isSyncingDown}
                  className="p-4 bg-[#FAF7F2] hover:bg-[#F2EDE4] border border-[#BFAE9C]/50 rounded-xs text-left transition-all group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7A5B43]/15 text-[#7A5B43] flex items-center justify-center group-hover:bg-[#7A5B43] group-hover:text-white transition-colors">
                      <DownloadCloud className={`w-4 h-4 ${isSyncingDown ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#241E1A] uppercase tracking-wider">
                        Puxar Dados do Supabase
                      </h4>
                      <p className="text-[11px] text-[#7A5B43] mt-0.5">
                        Carrega a última versão persistida no banco e atualiza a tela agora.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: GUIA PASSO A PASSO DE INSTALAÇÃO NO SUPABASE */}
        {/* ========================================================================= */}
        {activeTab === 'guide' && (
          <div className="bg-white border border-[#BFAE9C]/40 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-xl text-[#241E1A] tracking-wide">
                Como Criar e Conectar seu Banco de Dados no Supabase em 3 Minutos
              </h3>
              <p className="text-xs sm:text-sm text-[#7A5B43] mt-1">
                Siga os passos abaixo para ter a persistência Realtime funcionando entre todos os dispositivos conectados.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Passo 1 */}
              <div className="p-4 bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#7A5B43] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="space-y-1 text-xs text-[#3D3229]">
                  <h4 className="font-semibold text-sm text-[#241E1A]">Crie seu Projeto Gratuito no Supabase</h4>
                  <p>
                    Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#7A5B43] underline font-medium inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>, faça login e clique em <strong>"New Project"</strong>. Escolha um nome (ex: <em>Maison Entrelaço</em>) e uma senha para o banco de dados.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="p-4 bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#7A5B43] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="space-y-1 text-xs text-[#3D3229]">
                  <h4 className="font-semibold text-sm text-[#241E1A]">Abra o SQL Editor e Execute o Esquema</h4>
                  <p>
                    No menu lateral esquerdo do Supabase, clique no ícone de terminal <strong>"SQL Editor"</strong>, clique em <strong>"New Query"</strong>, cole todo o conteúdo do código SQL (aba ao lado) e clique no botão verde <strong>"Run"</strong>.
                  </p>
                  <p className="text-[#8C7561] text-[11px]">
                    Isso criará automaticamente as 8 tabelas (<code className="font-mono">store_customization</code>, <code className="font-mono">products</code>, <code className="font-mono">hero_slides</code>, <code className="font-mono">orders</code>, etc.), as políticas de segurança RLS e ativará a publicação Realtime.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="p-4 bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#7A5B43] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div className="space-y-1 text-xs text-[#3D3229]">
                  <h4 className="font-semibold text-sm text-[#241E1A]">Copie a URL e a Chave Anon</h4>
                  <p>
                    No Supabase, acesse <strong>Project Settings → Data API</strong> (ou <strong>API</strong>). Copie o <strong>Project URL</strong> e a <strong>anon public API key</strong>.
                  </p>
                </div>
              </div>

              {/* Passo 4 */}
              <div className="p-4 bg-[#FAF7F2] border border-[#BFAE9C]/40 rounded-xs flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#7A5B43] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div className="space-y-1 text-xs text-[#3D3229]">
                  <h4 className="font-semibold text-sm text-[#241E1A]">Cole aqui na Aba "Ponte & Conexão Realtime"</h4>
                  <p>
                    Volte para a aba <strong>"Ponte & Conexão Realtime"</strong> deste painel, cole as duas chaves e clique em <strong>"Salvar & Ativar Realtime"</strong>. Pronto! O site agora atualizará qualquer dispositivo conectado no mesmo segundo em que você alterar qualquer detalhe da boutique.
                  </p>
                </div>
              </div>

              {/* Passo 5: Hospedagem em VPS Própria */}
              <div className="p-4 bg-[#FAF7F2] border-2 border-[#7A5B43]/30 rounded-xs flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#241E1A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  5
                </div>
                <div className="space-y-2 text-xs text-[#3D3229]">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-[#241E1A]">Deploy em VPS Própria (PostgreSQL / Docker / Supabase Self-Hosted)</h4>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7A5B43]/15 text-[#7A5B43] font-medium">
                      Ambiente de Produção
                    </span>
                  </div>
                  <p>
                    Para rodar diretamente na sua VPS sem depender do plano em nuvem:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[#3D3229]">
                    <li>
                      Baixe o arquivo SQL atualizado (<code className="font-mono bg-white px-1 border border-[#BFAE9C]/40 text-[11px]">supabase_schema.sql</code>) pela aba <strong>"Código SQL"</strong> acima.
                    </li>
                    <li>
                      Execute o script no seu PostgreSQL da VPS:
                      <pre className="mt-1 p-2.5 bg-[#1C1714] text-[#E8E0D4] rounded-xs font-mono text-[11px] overflow-x-auto select-all">
psql -h localhost -U postgres -d seu_banco -f supabase_schema.sql
                      </pre>
                    </li>
                    <li>
                      No arquivo <code className="font-mono bg-white px-1 border border-[#BFAE9C]/40 text-[11px]">.env</code> da VPS ou nas configurações do seu orquestrador (Docker / Coolify / Dokku), defina:
                      <pre className="mt-1 p-2.5 bg-[#1C1714] text-[#E8E0D4] rounded-xs font-mono text-[11px] overflow-x-auto select-all">
VITE_SUPABASE_URL=https://sua-vps.seu-dominio.com
VITE_SUPABASE_ANON_KEY=sua_chave_jwt_da_vps
                      </pre>
                    </li>
                    <li>
                      Ao colocar as credenciais direto na VPS, o sistema as lerá nativamente mantendo máxima segurança e autonomia total.
                    </li>
                  </ol>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
