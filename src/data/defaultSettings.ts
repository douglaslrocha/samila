import { StoreCustomizationSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreCustomizationSettings = {
  general: {
    storeName: "MAISON ENTRELAÇO",
    monogram: "ME",
    tagline: "Atelier de Criação Autoral • Velas, Sabonetes & Arte Botânica",
    whatsappNumber: "5511987654321",
    whatsappDefaultMessage: "Olá! Vim pelo site da {storeName} e gostaria de informações sobre os produtos e encomendas.",
    supportEmail: "atendimento@maisonentrelaco.com.br",
    instagramHandle: "@maisonentrelaço",
    cnpjOrDocument: "00.000.000/0001-00",
    addressCity: "São Paulo - SP"
  },
  header: {
    announcementBar: {
      enabled: true,
      text: "Edição de Outono do Atelier • Embalagem para presente em papel vegetal e lacre em cera inclusa",
      linkText: "Descobrir",
      linkUrl: "#tres-casas",
      bgColor: "#3D3229"
    },
    logo: {
      type: 'image',
      text: "MAISON ENTRELAÇO",
      monogram: "ME",
      sealTopText: "MAISON",
      sealBottomText: "ENTRELAÇO",
      imageUrl: "/images/maison-logo.svg",
      size: 'md'
    },
    actions: {
      showSearch: true,
      showAccount: true,
      showCart: true,
      showWhatsapp: false,
      whatsappNumber: "5511987654321"
    },
    style: {
      sticky: true,
      backdropBlur: true,
      theme: 'classic_cream'
    },
    navLinks: [
      { id: 'velas', label: 'Velas Aromáticas', enabled: true, targetId: 'velas', targetType: 'line' },
      { id: 'sabonetes', label: 'Sabonetes Botânicos', enabled: true, targetId: 'sabonetes', targetType: 'line' },
      { id: 'croche', label: 'Peças em Crochê', enabled: true, targetId: 'croche', targetType: 'line' }
    ]
  },
  hero: {
    mediaMode: 'both',
    height: 'full',
    overlay: {
      enabled: true,
      intensity: 'subtle',
      vignette: true
    },
    alignment: 'center',
    carouselAutoplay: true,
    carouselInterval: 6,
    slides: [
      {
        id: 'slide-1',
        type: 'video',
        title: 'Cortinas ao Sol & Arquitetura do Atelier',
        desktopUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
        mobileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'
      },
      {
        id: 'slide-2',
        type: 'image',
        title: 'Casa I • Velas Aromáticas & Cera Vegetal',
        desktopUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90',
        mobileUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1080&q=90',
        posterUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90'
      },
      {
        id: 'slide-3',
        type: 'video',
        title: 'Chama Viva & Fusão das Ceras',
        desktopUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4',
        mobileUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90'
      },
      {
        id: 'slide-4',
        type: 'image',
        title: 'Casa II • Sabonetes Botânicos de Oliva & Camomila',
        desktopUrl: 'https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=2000&q=90',
        mobileUrl: 'https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=1080&q=90',
        posterUrl: 'https://images.unsplash.com/photo-1607006310458-0059b0d2d31e?auto=format&fit=crop&w=2000&q=90'
      },
      {
        id: 'slide-5',
        type: 'image',
        title: 'Casa III • Crochê Artesanal em Fio Nobre de Algodão',
        desktopUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=2000&q=90',
        mobileUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1080&q=90',
        posterUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=2000&q=90'
      }
    ],
    desktopMedia: {
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'
    },
    mobileMedia: {
      useSeparateMedia: true,
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=90'
    },
    elements: {
      tagline: {
        enabled: false,
        text: "Uma casa feita de histórias.",
        icon: true
      },
      headline: {
        enabled: false,
        text: "Objetos para perfumar, cuidar e vestir a vida de beleza.",
        size: 'large'
      },
      subtitle: {
        enabled: false,
        text: "Europa monárquica · Botânica nobre · Feito à mão"
      },
      primaryButton: {
        enabled: false,
        text: "Descobrir as Três Casas",
        action: "tres-casas"
      },
      secondaryButton: {
        enabled: false,
        text: "O Saber-Fazer Artesanal",
        action: "atelier"
      },
      ambientAudio: {
        enabled: false,
        label: "Som da Maison"
      },
      scrollIndicator: {
        enabled: false,
        label: "Role"
      }
    }
  },
  founder: {
    enabled: true,
    tagline: "A Alma da Maison",
    name: "Aline de La Tour",
    role: "Fundadora & Diretora Criativa",
    badgeText: "Autoria",
    itemsTitle: "Pilares da Criação",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Aline de La Tour, fundadora da Maison",
    items: [
      {
        id: "1",
        title: "Curadoria Autoral",
        description: "Cada fragrância e objeto nasce de memórias de estadias na Europa e casarões coloniais."
      },
      {
        id: "2",
        title: "Saber-Fazer Nobre",
        description: "Alquimia botânica pura, óleos nobres e entrelaçado manual feito com tempo e calma."
      },
      {
        id: "3",
        title: "Tiragens Raras",
        description: "Objetos de afeto intencionalmente esculpidos para guardar a beleza dos dias."
      }
    ],
    quote: "O luxo autêntico é o afeto e o tempo lapidados à mão.",
    buttonText: "Conheça a história"
  },
  dashboardFounder: {
    enabled: true,
    ownerName: "Aline de La Tour",
    ownerRole: "Fundadora & Diretora Criativa",
    welcomeMessage: "Mesa de Criação & Atelier da Fundadora",
    quote: "O luxo autêntico é o afeto e o tempo lapidados à mão.",
    heroBgImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85",
    sidebarAvatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=85",
    gallery: [
      {
        id: "df-1",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85",
        title: "Retrato Principal da Criadora",
        caption: "Fotografia autoral com luz natural da fundadora",
        createdAt: "2025-01-10"
      },
      {
        id: "df-2",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
        title: "No Atelier em Dia de Alquimia",
        caption: "Seleção botânica e infusões aromáticas artesanais",
        createdAt: "2025-02-14"
      },
      {
        id: "df-3",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
        title: "Curadoria de Fios & Entrelaçados",
        caption: "Texturas táteis e papéis vegetais com lacre de cera",
        createdAt: "2025-03-01"
      }
    ]
  },
  team: {
    enabled: true,
    headline: "EVOLUA A SUA CASA",
    subtitle: "ARTE BOTÂNICA, VELAS PURAS & CRIAÇÕES MANUAIS",
    showCraftIcons: true,
    members: [
      {
        id: "member-1",
        name: "Yusuf O.",
        role: "Head Of Engineering",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=85",
        imageAlt: "Yusuf O. - Head Of Engineering",
        isGrayscale: false
      },
      {
        id: "member-2",
        name: "Kemal O.",
        role: "Founder & CEO",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
        imageAlt: "Kemal O. - Founder & CEO",
        isGrayscale: false
      },
      {
        id: "member-3",
        name: "Berkay K.",
        role: "Developer",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
        imageAlt: "Berkay K. - Developer",
        isGrayscale: true
      }
    ],
    panorama: {
      enabled: true,
      imageUrl: "/images/mansoes-luxo-panoramica.png",
      alt: "Panorama de Mansões Modernas de Luxo"
    }
  },
  productLines: [
    {
      id: 'velas',
      roman: 'I',
      housePrefix: 'CASA',
      maisonTitle: 'MAISON ENTRELAÇO',
      mainTitle: 'O aroma rico',
      subTitle: 'Velas aromáticas',
      watermarkWords: ['AROMA RICO', 'VERSAILLES'],
      defaultBadge1: 'Cera 100% Vegetal',
      defaultBadge2: '50h Queima',
      bgColor: 'from-[#FAF8F5] via-[#FAF6F0] to-[#F5EFE6]',
      fadeColor: '#FAF8F5'
    },
    {
      id: 'sabonetes',
      roman: 'II',
      housePrefix: 'CASA',
      maisonTitle: 'MAISON ENTRELAÇO',
      mainTitle: 'O cuidado',
      subTitle: 'Sabonetes botânicos',
      watermarkWords: ['O CUIDADO', 'BOTÂNICA'],
      defaultBadge1: 'Cold Process',
      defaultBadge2: 'Óleos Puros',
      bgColor: 'from-[#F5EFE6] via-[#F4EFE6] to-[#EFE7DC]',
      fadeColor: '#F5EFE6'
    },
    {
      id: 'croche',
      roman: 'III',
      housePrefix: 'CASA',
      maisonTitle: 'MAISON ENTRELAÇO',
      mainTitle: 'A trama',
      subTitle: 'Peças em crochê',
      watermarkWords: ['A TRAMA', 'HERANÇA'],
      defaultBadge1: 'Algodão Nobre',
      defaultBadge2: 'Ponto Manual',
      bgColor: 'from-[#EFE7DC] via-[#F6F1EA] to-[#FAF8F5]',
      fadeColor: '#EFE7DC'
    }
  ],
  deliveryExperience: {
    enabled: true,
    image: {
      enabled: true,
      url: "/images/atelier-decoracao-panoramica.png",
      alt: "Arte Panorâmica da Maison",
      maxHeight: 'full',
      blendMode: 'multiply'
    },
    tagline: {
      enabled: true,
      text: "Boutique Online"
    },
    headline: {
      enabled: true,
      text: "“Coloque no seu carrinho e receba na sua casa.”"
    },
    description: {
      enabled: true,
      text: "Preparamos cada encomenda como quem envia uma carta de afeto — com perfume autoral, toque humano e entrega sem pressa."
    },
    primaryButton: {
      enabled: true,
      text: "Escolher Meus Produtos",
      action: "explore_products"
    },
    secondaryButton: {
      enabled: true,
      text: "Ver Meu Carrinho",
      action: "open_cart"
    },
    style: {
      bgColor: '#FAF7F2'
    }
  },
  brandQuote: {
    enabled: true,
    logo: {
      enabled: true,
      type: 'monogram',
      monogramText: 'M',
      imageUrl: '',
      size: 'md'
    },
    quote: {
      enabled: true,
      text: '“Há coisas que não precisam ser explicadas. Basta senti-las.”',
      textColor: '#3D3229',
      fontSize: 'lg'
    },
    authorTagline: {
      enabled: true,
      text: 'MAISON ENTRELAÇO — ATEMPORALIDADE & SENTIDO',
      textColor: '#7A5B43'
    },
    background: {
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=90',
      overlayColor: '#E8E0D4',
      overlayOpacity: 88,
      blur: 2
    },
    paddingY: 'normal'
  },
  footer: {
    enabled: true,
    brand: {
      displayType: 'name',
      nameText: 'MAISON ENTRELAÇO',
      logoUrl: '',
      logoHeight: 32,
      tagline: {
        enabled: true,
        text: '“Uma casa feita de histórias. Objetos para perfumar, cuidar e vestir a vida de beleza.”'
      },
      origins: {
        enabled: true,
        text: 'FRANÇA • ITÁLIA • BRASIL'
      }
    },
    columns: [
      {
        id: 'col-maison',
        title: 'A MAISON',
        items: [
          { id: 'item-1', label: 'A Fundadora', actionType: 'scroll', target: 'a-maison' },
          { id: 'item-2', label: 'Boutique Online', actionType: 'scroll', target: 'secao-carrinho-casa' },
          { id: 'item-3', label: 'As Três Casas', actionType: 'scroll', target: 'tres-casas' }
        ]
      },
      {
        id: 'col-colecoes',
        title: 'COLEÇÕES',
        items: [
          { id: 'item-4', label: 'Velas Aromáticas', actionType: 'scroll', target: 'velas' },
          { id: 'item-5', label: 'Sabonetes Botânicos', actionType: 'scroll', target: 'sabonetes' },
          { id: 'item-6', label: 'Crochê Feito à Mão', actionType: 'scroll', target: 'croche' },
          { id: 'item-7', label: 'Edições Limitadas', actionType: 'scroll', target: 'produtos' }
        ]
      },
      {
        id: 'col-atendimento',
        title: 'ATENDIMENTO',
        items: [
          { id: 'item-8', label: 'Personalizado', actionType: 'contact' },
          { id: 'item-9', label: 'Encomendas', actionType: 'contact' },
          { id: 'item-10', label: 'Entregas & Prazos', actionType: 'contact' }
        ]
      },
      {
        id: 'col-conecte',
        title: 'CONECTE-SE',
        items: [
          { id: 'item-11', label: 'Fale Conosco', actionType: 'contact' }
        ]
      }
    ],
    socials: [
      {
        id: 'soc-instagram',
        network: 'instagram',
        handle: '@maisonentrelaço'
      }
    ],
    bottom: {
      copyright: '© Maison Entrelaço • Todos os direitos reservados.',
      loveMessage: 'Feito lentamente com ♥ para inspirar o viver.',
      artistSignature: {
        enabled: true,
        prefix: 'Planejado pelo artista',
        artistName: 'Douglas L. Rocha',
        websiteUrl: 'https://douglaslrocha.com',
        websiteLabel: 'douglaslrocha.com',
        signatureUrl: 'https://chatgpt.com/s/m_6aa57170bf548191bad414e48113190e',
        style: 'handwritten'
      }
    },
    background: {
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-night-sky-full-of-stars-41582-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90',
      overlayColor: '#1C1714',
      overlayOpacity: 90
    }
  },
  giftPresentation: {
    enabled: true,
    autoOpenOnMobileFirstVisit: true,
    floatingButtonEnabled: true,
    floatingButtonLabel: "Assistir apresentação",
    floatingButtonPosition: "bottom-left",
    slides: [
      {
        id: "slide-gift-1",
        title: "Imagem 1",
        message: "",
        imageUrl: "/presentation/slide-1.png"
      },
      {
        id: "slide-gift-2",
        title: "Imagem 2",
        message: "",
        imageUrl: "/presentation/slide-2.png"
      },
      {
        id: "slide-gift-3",
        title: "Imagem 3",
        message: "",
        imageUrl: "/presentation/slide-3.png"
      },
      {
        id: "slide-gift-4",
        title: "Imagem 4",
        message: "",
        imageUrl: "/presentation/slide-4.png"
      },
      {
        id: "slide-gift-5",
        title: "Imagem 5",
        message: "",
        imageUrl: "/presentation/slide-5.png"
      },
      {
        id: "slide-gift-6",
        title: "Imagem 6",
        message: "",
        imageUrl: "/presentation/slide-6.png"
      },
      {
        id: "slide-gift-7",
        title: "Imagem 7",
        message: "",
        imageUrl: "/presentation/slide-7.png"
      }
    ],
    ribbon: {
      badge: "✦ MOMENTO DA INAUGURAÇÃO ✦",
      title: "Desate o Laço do seu Presente",
      message: "Toque na tesoura dourada para cortar o laço e abrir oficialmente as portas da sua boutique!",
      sealMonogram: "ME",
      cutButtonText: "✂️ Cortar o Laço de Fita",
      celebrationTitle: "✨ Sua Boutique Foi Aberta! ✨",
      celebrationMessage: "O presente é todo seu. Sinta-se em casa e desfrute de cada detalhe criado para você.",
      enterStoreButtonText: "Entrar na Minha Boutique ➔"
    }
  }
};

/* Paletas de Cor Curadas para a Seção de Frase Poética */
export const BRAND_QUOTE_PALETTES = [
  {
    id: "casa-1-velas",
    name: "Casa I • Velas Aromáticas & Cera Pura",
    tag: "CASA 1",
    bgColor: "#EFE7DC",
    overlayColor: "#EFE7DC",
    textColor: "#3D3229",
    accentColor: "#7A5B43",
    description: "Tons de areia quente, âmbar e caramelo colonial das velas"
  },
  {
    id: "casa-2-sabonetes",
    name: "Casa II • Saboaria Artesanal & Ervas",
    tag: "CASA 2",
    bgColor: "#E8EBE4",
    overlayColor: "#E8EBE4",
    textColor: "#263324",
    accentColor: "#566C52",
    description: "Verde sálvia suave e alecrim fresco da botânica"
  },
  {
    id: "casa-3-croche",
    name: "Casa III • Crochê & Fibras Naturais",
    tag: "CASA 3",
    bgColor: "#F5EDE4",
    overlayColor: "#F5EDE4",
    textColor: "#452B20",
    accentColor: "#94573D",
    description: "Terracota quente e linho rústico da tecelagem"
  },
  {
    id: "maison-ecru-original",
    name: "Maison Entrelaço • Ecrú & Areia Original",
    tag: "ORIGINAL",
    bgColor: "#E8E0D4",
    overlayColor: "#E8E0D4",
    textColor: "#3D3229",
    accentColor: "#7A5B43",
    description: "A assinatura clássica da Maison com contraste atemporal"
  },
  {
    id: "maison-rosa-champagne",
    name: "Atelier • Rosa Pétala & Champagne",
    tag: "ATELIER",
    bgColor: "#F2ECE6",
    overlayColor: "#F2ECE6",
    textColor: "#3A2B23",
    accentColor: "#825A4B",
    description: "Rosa empoeirado e champagne da decoração romântica"
  },
  {
    id: "maison-marfim-puro",
    name: "Minimalista • Marfim Puro & Linho Alvo",
    tag: "MINIMAL",
    bgColor: "#FAF8F5",
    overlayColor: "#FAF8F5",
    textColor: "#241D18",
    accentColor: "#8C7561",
    description: "Fundo ultra luminoso de linho e mármore marfim"
  },
  {
    id: "maison-noir-luxury",
    name: "Noite Nobre • Carvão & Ouro Acobreado",
    tag: "NOIR",
    bgColor: "#211C18",
    overlayColor: "#211C18",
    textColor: "#FAF7F2",
    accentColor: "#D4B996",
    description: "Alto contraste noturno com sofisticação dramática"
  },
  {
    id: "maison-dourado-seda",
    name: "Seda Rara • Ouro Suave & Baunilha",
    tag: "LUXO",
    bgColor: "#F7F2E7",
    overlayColor: "#F7F2E7",
    textColor: "#362B1D",
    accentColor: "#A68249",
    description: "Tons dourados e luminosos de cera de abelha e seda"
  }
];

/* Quick Media Presets for Easy E-Commerce Testing */
export const HERO_MEDIA_PRESETS = [
  {
    name: "Cortinas ao Sol & Arquitetura (Vídeo)",
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-curtains-moving-with-the-breeze-in-a-sunny-room-41584-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90'
  },
  {
    name: "Chama da Vela em Macro (Vídeo)",
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-candle-flame-41580-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90'
  },
  {
    name: "Mãos e Vela no Atelier (Vídeo)",
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=2000&q=90'
  },
  {
    name: "Céu Estrelado & Noturno (Vídeo)",
    type: 'video' as const,
    url: 'https://assets.mixkit.co/videos/preview/mixkit-night-sky-full-of-stars-41582-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=90'
  },
  {
    name: "Mansão Francesa e Jardins (Imagem)",
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=90',
    posterUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=90'
  },
  {
    name: "Atelier e Linho Puro Minimalista (Imagem)",
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=2400&q=90',
    posterUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=2400&q=90'
  },
  {
    name: "Velas Artesanais Chiaroscuro (Imagem)",
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=2400&q=90',
    posterUrl: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=2400&q=90'
  }
];
