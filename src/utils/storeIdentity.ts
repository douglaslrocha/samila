import { StoreCustomizationSettings, StoreGeneralSettings } from '../types';

/**
 * Retorna o nome atual e oficial do e-Commerce / Loja.
 * Prioriza settings.general.storeName, fallback para settings.header.logo.text, e por fim o padrão.
 */
export function getStoreName(settings?: StoreCustomizationSettings | null): string {
  if (!settings) return 'Maison Entrelaço';
  return settings.general?.storeName?.trim() || settings.header?.logo?.text?.trim() || 'Maison Entrelaço';
}

/**
 * Retorna o monograma / sigla da loja (ex: "ME")
 */
export function getStoreMonogram(settings?: StoreCustomizationSettings | null): string {
  if (!settings) return 'ME';
  if (settings.general?.monogram?.trim()) return settings.general.monogram.trim();
  if (settings.header?.logo?.monogram?.trim()) return settings.header.logo.monogram.trim();
  
  const name = getStoreName(settings);
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ME';
}

/**
 * Retorna o número de WhatsApp configurado (apenas números com DDI, ex: '5511987654321')
 */
export function getStoreWhatsapp(settings?: StoreCustomizationSettings | null): string {
  const raw = settings?.general?.whatsappNumber || settings?.header?.actions?.whatsappNumber || '5511987654321';
  const clean = raw.replace(/\D/g, '');
  return clean || '5511987654321';
}

/**
 * Retorna a mensagem padrão de contato para o WhatsApp
 */
export function getStoreWhatsappMessage(settings?: StoreCustomizationSettings | null, customContext?: string): string {
  const storeName = getStoreName(settings);
  if (customContext) {
    return `Olá! Vim pelo site da *${storeName}* referente a: ${customContext}`;
  }
  if (settings?.general?.whatsappDefaultMessage) {
    return settings.general.whatsappDefaultMessage.replace('{storeName}', storeName);
  }
  return `Olá! Vim pelo site da *${storeName}* e gostaria de informações sobre os produtos e encomendas.`;
}

/**
 * Constrói uma URL oficial do WhatsApp (wa.me) devidamente formatada e segura
 */
export function buildWhatsappUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '') || '5511987654321';
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Atualiza o nome da loja, WhatsApp e identidade de forma sincronizada em TODO o objeto de configurações,
 * garantindo que nenhum elemento do site fique com textos ou números descasados.
 */
export function cascadeStoreIdentityUpdate(
  prevSettings: StoreCustomizationSettings,
  updates: {
    storeName?: string;
    monogram?: string;
    tagline?: string;
    whatsappNumber?: string;
    whatsappDefaultMessage?: string;
    supportEmail?: string;
    instagramHandle?: string;
    cnpjOrDocument?: string;
    addressCity?: string;
  }
): StoreCustomizationSettings {
  const currentGeneral: StoreGeneralSettings = prevSettings.general || {
    storeName: prevSettings.header?.logo?.text || 'Maison Entrelaço',
    monogram: prevSettings.header?.logo?.monogram || 'ME',
    tagline: 'Atelier de Criação Autoral • Velas, Sabonetes & Arte Botânica',
    whatsappNumber: prevSettings.header?.actions?.whatsappNumber || '5511987654321',
    whatsappDefaultMessage: 'Olá! Vim pelo site da {storeName} e gostaria de informações sobre os produtos.',
    supportEmail: 'atendimento@maisonentrelaco.com.br',
    instagramHandle: '@maisonentrelaço',
    cnpjOrDocument: '00.000.000/0001-00',
    addressCity: 'São Paulo - SP'
  };

  const newGeneral: StoreGeneralSettings = {
    ...currentGeneral,
    ...updates,
    storeName: updates.storeName !== undefined ? updates.storeName : currentGeneral.storeName,
    whatsappNumber: updates.whatsappNumber !== undefined ? updates.whatsappNumber : currentGeneral.whatsappNumber
  };

  const finalName = newGeneral.storeName.trim() || 'Maison Entrelaço';
  const finalMonogram = newGeneral.monogram?.trim() || finalName.slice(0, 2).toUpperCase();
  const cleanWhatsapp = newGeneral.whatsappNumber.replace(/\D/g, '') || '5511987654321';

  // 1. Atualiza Header
  const updatedHeader = {
    ...prevSettings.header,
    logo: {
      ...prevSettings.header.logo,
      text: finalName,
      monogram: finalMonogram,
      sealBottomText: finalName.includes(' ') ? finalName.split(' ').slice(1).join(' ') : finalName
    },
    actions: {
      ...prevSettings.header.actions,
      whatsappNumber: cleanWhatsapp,
      showWhatsapp: false
    }
  };

  // 2. Atualiza Footer
  const updatedFooter = prevSettings.footer ? {
    ...prevSettings.footer,
    brand: {
      ...prevSettings.footer.brand,
      nameText: finalName,
      tagline: {
        ...prevSettings.footer.brand.tagline,
        text: newGeneral.tagline ? `“${newGeneral.tagline}”` : prevSettings.footer.brand.tagline?.text
      }
    },
    bottom: {
      ...prevSettings.footer.bottom,
      copyright: `© ${finalName} • Todos os direitos reservados.`
    },
    socials: (prevSettings.footer.socials || []).map(s => {
      if (s.network === 'whatsapp') {
        return { ...s, handle: cleanWhatsapp };
      }
      if (s.network === 'instagram' && newGeneral.instagramHandle) {
        return { ...s, handle: newGeneral.instagramHandle };
      }
      return s;
    })
  } : undefined;

  // 3. Atualiza Brand Quote
  const updatedBrandQuote = prevSettings.brandQuote ? {
    ...prevSettings.brandQuote,
    logo: {
      ...prevSettings.brandQuote.logo,
      monogramText: finalMonogram
    }
  } : undefined;

  // 4. Atualiza Product Lines (linhas com títulos institucionais)
  const updatedProductLines = (prevSettings.productLines || []).map(line => ({
    ...line,
    maisonTitle: finalName.toUpperCase()
  }));

  // Atualiza também o document.title do navegador se em ambiente de browser
  if (typeof document !== 'undefined') {
    document.title = `${finalName} • Boutique & Atelier`;
  }

  return {
    ...prevSettings,
    general: newGeneral,
    header: updatedHeader,
    footer: updatedFooter,
    brandQuote: updatedBrandQuote,
    productLines: updatedProductLines
  };
}

export interface RealisticOrderItem {
  name: string;
  categoryLabel?: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Monta uma mensagem realista de pedido formatada para o WhatsApp, com lista completa dos itens,
 * subtotais, descontos e total estimado.
 */
export function buildRealisticWhatsappOrderMessage(params: {
  storeName: string;
  items: RealisticOrderItem[];
  discountAmount?: number;
  shippingAmount?: number;
  isGiftWrap?: boolean;
  giftNote?: string;
  customerName?: string;
}): string {
  const brandTitle = (params.storeName || 'Maison Entrelaço').toUpperCase();
  const totalPieces = params.items.reduce((sum, item) => sum + item.quantity, 0);

  const itemsList = params.items
    .map(
      (item) =>
        `• *${item.quantity}x ${item.name}*${item.categoryLabel ? ` (${item.categoryLabel})` : ''} — R$ ${(
          item.unitPrice * item.quantity
        ).toLocaleString('pt-BR')}`
    )
    .join('\n');

  const subtotal = params.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = params.discountAmount || 0;
  const shipping = params.shippingAmount !== undefined ? params.shippingAmount : 0;
  const giftCost = params.isGiftWrap ? 15 : 0;
  const finalTotal = Math.max(0, subtotal - discount + shipping + giftCost);

  let extraDetails = '';
  if (discount > 0) {
    extraDetails += `\n🏷️ *Desconto Especial:* - R$ ${discount.toLocaleString('pt-BR')}`;
  }
  if (params.isGiftWrap) {
    extraDetails += `\n🎁 *Embalagem de Presente com Lacre de Cera:* (+ R$ 15)`;
    if (params.giftNote?.trim()) {
      extraDetails += `\n   _Nota afetiva:_ "${params.giftNote.trim()}"`;
    }
  }
  extraDetails += `\n🚚 *Envio / Entrega:* ${shipping === 0 ? 'Cortesia do Atelier (Frete Grátis)' : `R$ ${shipping},00`}`;
  extraDetails += `\n\n✨ *Total do Pedido:* R$ ${finalTotal.toLocaleString('pt-BR')}`;

  const greeting = params.customerName?.trim()
    ? `Olá! Meu nome é ${params.customerName.trim()} e gostaria de fazer o pedido dos seguintes itens na *${params.storeName}*:`
    : `Olá! Gostaria de fazer o pedido dos seguintes itens na *${params.storeName}*:`;

  return `✨ *${brandTitle} — ATENDIMENTO PREMIUM & PEDIDO* ✨\n\n${greeting}\n\n🛍️ *ITENS SELECIONADOS (${totalPieces} ${totalPieces === 1 ? 'peça' : 'peças'}):*\n${itemsList}${extraDetails}\n\nPor favor, como procedemos com o pagamento e a entrega? Muito obrigado(a)!`;
}

/**
 * Itens de exemplo realistas para demonstração e simulação de compra no admin
 */
export const SAMPLE_REALISTIC_ORDER_ITEMS: RealisticOrderItem[] = [
  {
    name: 'Vela — Jardim de Versailles',
    categoryLabel: 'Vela Aromática em Porcelana',
    quantity: 2,
    unitPrice: 189
  },
  {
    name: 'Sabonete — Pedras do Loire',
    categoryLabel: 'Sabonete Botânico Mineral',
    quantity: 1,
    unitPrice: 94
  },
  {
    name: 'Jogo Americano — Folha de Oliveira',
    categoryLabel: 'Crochê Artesanal em Fio Nobre',
    quantity: 1,
    unitPrice: 145
  }
];

