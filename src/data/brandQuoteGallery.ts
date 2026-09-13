export interface BackgroundGalleryItem {
  id: string;
  name: string;
  category: 'video' | 'image';
  mediaUrl: string;
  posterUrl?: string;
  thumbnail: string;
  tag: string;
  description: string;
}

export interface SealGalleryItem {
  id: string;
  name: string;
  imageUrl: string;
  tag: string;
  description: string;
}

// ============================================================================
// GALERIA DE FUNDOS (VÍDEOS E FOTOS REFINADAS DA MAISON)
// ============================================================================
export const BRAND_QUOTE_BACKGROUND_GALLERY: BackgroundGalleryItem[] = [
  // --- VÍDEOS DE LUXO ---
  {
    id: 'vid-cortinas-sol',
    name: 'Brisa da Manhã & Cortinas de Linho',
    category: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    tag: 'VÍDEO • CALMARIA',
    description: 'Brisa suave balançando cortinas iluminadas pelo sol da manhã.'
  },
  {
    id: 'vid-chama-vela',
    name: 'Chama Viva & Crepitação da Cera',
    category: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
    tag: 'VÍDEO • ACONCHEGO',
    description: 'Macro hipnotizante da chama pura de uma vela artesanal acesa.'
  },
  {
    id: 'vid-maos-atelier',
    name: 'Mãos da Artesã & Atelier Noturno',
    category: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    tag: 'VÍDEO • ARTESANAL',
    description: 'O calor da manufatura manual e a delicadeza do atelier.'
  },
  {
    id: 'vid-ceu-estrelado',
    name: 'Céu Noturno & Constelações',
    category: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-night-sky-full-of-stars-41582-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80',
    tag: 'VÍDEO • POÉTICO',
    description: 'Noite poética com atmosfera celestial e atemporal.'
  },

  // --- FOTOS / PINTURAS DE LUXO ---
  {
    id: 'img-rosa-champagne',
    name: 'Rosa Champagne & Pétalas Suaves',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • ATELIER',
    description: 'Tons champanhe e rosa antigo inspirados na foto da Maison.'
  },
  {
    id: 'img-linho-ceramica',
    name: 'Linho Puro & Cerâmica Wabi-Sabi',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=2400&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • NATURAL',
    description: 'Textura orgânica de linho cru, argila moldada e luz natural.'
  },
  {
    id: 'img-velas-chiaroscuro',
    name: 'Velas Esculturais & Âmbar Dourado',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=2400&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • CASA I',
    description: 'Cenografia sofisticada com velas aromáticas em luz âmbar.'
  },
  {
    id: 'img-mansao-jardim',
    name: 'Maison Francesa & Jardim Secreto',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • ARQUITETURA',
    description: 'Arquitetura clássica com heras verdes e sofisticação europeia.'
  },
  {
    id: 'img-botanica-ervas',
    name: 'Herbanário, Sálvia & Saboaria',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • CASA II',
    description: 'Ervas frescas, essências florais e óleos essenciais nobres.'
  },
  {
    id: 'img-fibras-croche',
    name: 'Fibras Naturais & Tear Manual',
    category: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=2400&q=90',
    thumbnail: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
    tag: 'FOTO • CASA III',
    description: 'Ponto a ponto de fios nobres de algodão cru e linho brasileiro.'
  }
];

// ============================================================================
// GALERIA DE SELOS & EMBLEMAS DA MAISON (SVG VETORIAIS DE LUXO)
// ============================================================================

// SVGs elegantes codificados para uso direto sem dependência de links externos
const createSvgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const BRAND_QUOTE_SEAL_GALLERY: SealGalleryItem[] = [
  {
    id: 'seal-brasao-imperial',
    name: 'Brasão Imperial Maison Entrelaço',
    tag: 'BRASÃO OFICIAL',
    description: 'Monograma clássico com ramalhetes de louro e arco imperial.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="46" stroke="#7A5B43" stroke-width="1.5" stroke-dasharray="2 2"/>
        <circle cx="50" cy="50" r="41" stroke="#7A5B43" stroke-width="1.2"/>
        <path d="M50 20 L52 24 L56 25 L53 28 L54 32 L50 30 L46 32 L47 28 L44 25 L48 24 Z" fill="#7A5B43"/>
        <path d="M26 50 C26 36 36 28 50 28 C64 28 74 36 74 50 C74 64 64 72 50 72 C36 72 26 64 26 50 Z" stroke="#7A5B43" stroke-width="0.8" fill="none"/>
        <text x="50" y="58" font-family="Cinzel, Georgia, serif" font-size="24" font-weight="600" fill="#7A5B43" text-anchor="middle">M</text>
        <path d="M35 78 C42 81 58 81 65 78" stroke="#7A5B43" stroke-width="1" stroke-linecap="round"/>
        <circle cx="50" cy="80" r="1.5" fill="#7A5B43"/>
      </svg>
    `)
  },
  {
    id: 'seal-sinete-cera',
    name: 'Sinete de Cera Real • Lacre Dourado',
    tag: 'SINETE & CERA',
    description: 'Estilo autêntico de carimbo em cera com acabamento orgânico.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <path d="M50 8 C65 7 85 18 90 32 C95 46 90 68 80 82 C70 93 48 94 32 90 C18 85 8 72 8 54 C8 36 20 18 36 10 Z" fill="#7A5B43" opacity="0.12"/>
        <circle cx="50" cy="50" r="38" stroke="#7A5B43" stroke-width="1.8"/>
        <circle cx="50" cy="50" r="34" stroke="#7A5B43" stroke-width="0.75" stroke-dasharray="1 2"/>
        <text x="50" y="59" font-family="Cinzel, serif" font-size="28" font-weight="700" fill="#7A5B43" text-anchor="middle" letter-spacing="1">ME</text>
      </svg>
    `)
  },
  {
    id: 'seal-ramo-oliveira',
    name: 'Ramos de Oliveira & Botânica Pura',
    tag: 'BOTÂNICO',
    description: 'Folhagens entrelaçadas inspiradas na saboaria e aromas botânicos.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="42" stroke="#7A5B43" stroke-width="1"/>
        <path d="M30 65 C28 50 32 38 42 30 C38 38 38 48 42 58 Z" fill="#7A5B43" opacity="0.8"/>
        <path d="M70 65 C72 50 68 38 58 30 C62 38 62 48 58 58 Z" fill="#7A5B43" opacity="0.8"/>
        <circle cx="50" cy="32" r="2" fill="#7A5B43"/>
        <circle cx="50" cy="68" r="2" fill="#7A5B43"/>
        <text x="50" y="56" font-family="Cinzel, serif" font-size="20" font-weight="600" fill="#7A5B43" text-anchor="middle">M</text>
      </svg>
    `)
  },
  {
    id: 'seal-flor-algodao',
    name: 'Flor de Algodão & Fibras do Atelier',
    tag: 'FIBRAS & LINHO',
    description: 'Selo poético da colheita manual e confecção de crochê nobre.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="43" stroke="#7A5B43" stroke-width="1.2"/>
        <path d="M50 25 C45 32 45 42 50 48 C55 42 55 32 50 25 Z" fill="#7A5B43" opacity="0.75"/>
        <path d="M28 46 C35 44 42 47 46 52 C41 55 33 53 28 46 Z" fill="#7A5B43" opacity="0.75"/>
        <path d="M72 46 C65 44 58 47 54 52 C59 55 67 53 72 46 Z" fill="#7A5B43" opacity="0.75"/>
        <text x="50" y="70" font-family="Cinzel, serif" font-size="14" font-weight="600" fill="#7A5B43" text-anchor="middle" letter-spacing="2">MAISON</text>
      </svg>
    `)
  },
  {
    id: 'seal-monograma-circular',
    name: 'Monograma Medallion • Savoir-Faire',
    tag: 'ALTA COSTURA',
    description: 'Medalhão circular tradicional de grife com inscrição circular.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="#7A5B43" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="39" stroke="#7A5B43" stroke-width="0.8"/>
        <circle cx="50" cy="50" r="28" stroke="#7A5B43" stroke-width="1.2"/>
        <text x="50" y="58" font-family="Cinzel, serif" font-size="24" font-weight="600" fill="#7A5B43" text-anchor="middle">M</text>
        <path d="M30 50 L22 50 M78 50 L70 50" stroke="#7A5B43" stroke-width="1"/>
      </svg>
    `)
  },
  {
    id: 'seal-rosa-francesa',
    name: 'Rosa de Providência Clássica',
    tag: 'HERITAGE',
    description: 'Gravura clássica de rosa do sul da França com traço requintado.',
    imageUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="#7A5B43" stroke-width="1.2" stroke-dasharray="3 2"/>
        <circle cx="50" cy="50" r="38" stroke="#7A5B43" stroke-width="0.8"/>
        <path d="M50 32 C42 32 40 40 50 48 C60 40 58 32 50 32 Z" stroke="#7A5B43" stroke-width="1.2" fill="#7A5B43" fill-opacity="0.2"/>
        <path d="M42 42 C38 48 42 56 50 58 C58 56 62 48 58 42" stroke="#7A5B43" stroke-width="1.2" fill="none"/>
        <path d="M50 58 L50 72" stroke="#7A5B43" stroke-width="1.2"/>
        <path d="M50 64 C45 62 42 66 44 68" stroke="#7A5B43" stroke-width="1"/>
        <path d="M50 67 C55 65 58 69 56 71" stroke="#7A5B43" stroke-width="1"/>
      </svg>
    `)
  }
];
