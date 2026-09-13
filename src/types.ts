export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  shortStory: string;
  fullStory: string;
  primaryImage: string;
  secondaryImage: string;
  galleryImages?: string[];
  videoUrl?: string;
  details: string[];
  fragranceNotes?: {
    top: string;
    heart: string;
    base: string;
  };
  materials?: string[];
  dimensions?: string;
  careInstructions?: string;
  recentlySoldOut?: boolean; // Selo giratório: "Unidades esgotadas há pouco tempo"
}

export interface StoryArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readingTime: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  quote?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftMessage?: string;
}

export interface WorldItem {
  id: string;
  romanNumber: string;
  title: string;
  subtitle: string;
  category: 'velas' | 'sabonetes' | 'croche';
  description: string;
  image: string;
  videoUrl?: string;
  quote: string;
  details: string[];
}

export interface AtelierStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
}

export interface UniverseTile {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  colSpan: string;
  rowSpan: string;
  description: string;
}

/* Internal Store Customization Types */
export interface HeaderSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
    bgColor?: string;
    textColor?: string;
    isMarquee?: boolean;
    marqueeSpeed?: 'slow' | 'normal' | 'fast';
    dismissible?: boolean;
  };
  logo: {
    type: 'circular_monogram' | 'text' | 'image';
    text: string;
    monogram: string;
    sealTopText?: string;
    sealBottomText?: string;
    imageUrl: string;
    size: 'sm' | 'md' | 'lg';
  };
  actions: {
    showSearch: boolean;
    showAccount: boolean;
    showCart: boolean;
    showWhatsapp?: boolean;
    whatsappNumber?: string;
  };
  style: {
    sticky: boolean;
    backdropBlur: boolean;
    theme: 'classic_cream' | 'translucent_glass' | 'monochrome_dark';
  };
  navLinks: NavLinkItem[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  enabled: boolean;
  targetId?: string; // id do destino (ex: 'velas', 'sabonetes', 'croche', 'tres-casas', 'secao-carrinho-casa', etc.)
  targetType?: 'line' | 'section' | 'custom';
}

export interface ProductLine {
  id: string;
  roman: string;
  housePrefix?: string; // ex: 'CASA', 'LINHA', 'COLEÇÃO'
  maisonTitle?: string; // ex: 'MAISON ENTRELAÇO', 'ATELIER BOTÂNICO'
  mainTitle: string;
  subTitle: string;
  watermarkWords: [string, string];
  defaultBadge1: string;
  defaultBadge2: string;
  bgColor: string;
  fadeColor: string;
  customProductIds?: string[];
}

export interface HeroSlide {
  id: string;
  type: 'video' | 'image';
  title?: string;
  desktopUrl: string;
  mobileUrl?: string;
  posterUrl: string;
}

export interface HeroSettings {
  mediaMode: 'video' | 'image' | 'both';
  height: 'full' | 'large' | 'medium';
  overlay: {
    enabled: boolean;
    intensity: 'subtle' | 'medium' | 'dark';
    vignette: boolean;
  };
  alignment: 'center' | 'left' | 'right';
  carouselAutoplay: boolean;
  carouselInterval: number; // in seconds
  slides: HeroSlide[];
  desktopMedia: {
    type: 'video' | 'image';
    url: string;
    posterUrl: string;
  };
  mobileMedia: {
    useSeparateMedia: boolean;
    type: 'video' | 'image';
    url: string;
    posterUrl: string;
  };
  elements: {
    tagline: {
      enabled: boolean;
      text: string;
      icon: boolean;
    };
    headline: {
      enabled: boolean;
      text: string;
      size: 'medium' | 'large' | 'huge';
    };
    subtitle: {
      enabled: boolean;
      text: string;
    };
    primaryButton: {
      enabled: boolean;
      text: string;
      action: string;
    };
    secondaryButton: {
      enabled: boolean;
      text: string;
      action: string;
    };
    ambientAudio: {
      enabled: boolean;
      label: string;
    };
    scrollIndicator: {
      enabled: boolean;
      label: string;
    };
  };
}

export interface FounderFeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface FounderSettings {
  enabled: boolean;
  tagline: string;
  name: string;
  role: string;
  badgeText?: string;
  itemsTitle?: string;
  imageUrl: string;
  imageAlt: string;
  items: FounderFeatureItem[];
  quote: string;
  buttonText: string;
}

export interface TeamMemberSettings {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt?: string;
  isGrayscale?: boolean;
}

export interface TeamPanoramaSettings {
  enabled: boolean;
  imageUrl: string;
  alt: string;
}

export interface TeamSettings {
  enabled: boolean;
  headline: string;
  subtitle: string;
  showCraftIcons: boolean;
  members: TeamMemberSettings[];
  panorama: TeamPanoramaSettings;
}

export interface DeliveryExperienceImageSettings {
  enabled: boolean;
  url: string;
  alt?: string;
  maxHeight?: 'sm' | 'md' | 'lg' | 'full';
  blendMode?: 'multiply' | 'normal';
}

export interface DeliveryExperienceSettings {
  enabled: boolean;
  image: DeliveryExperienceImageSettings;
  tagline: {
    enabled: boolean;
    text: string;
  };
  headline: {
    enabled: boolean;
    text: string;
  };
  description: {
    enabled: boolean;
    text: string;
  };
  primaryButton: {
    enabled: boolean;
    text: string;
    action: 'explore_products' | 'open_cart' | 'open_contact' | 'custom_url';
    customUrl?: string;
  };
  secondaryButton: {
    enabled: boolean;
    text: string;
    action: 'open_cart' | 'explore_products' | 'open_contact' | 'custom_url';
    customUrl?: string;
  };
  style?: {
    bgColor?: string;
  };
}

export interface BrandQuoteLogoSettings {
  enabled: boolean;
  type: 'monogram' | 'image';
  monogramText?: string;
  imageUrl?: string;
  imageAlt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface BrandQuoteBackgroundSettings {
  type: 'video' | 'image' | 'color';
  mediaUrl?: string;
  posterUrl?: string;
  overlayColor?: string;
  overlayOpacity?: number; // 0 - 100
  blur?: number; // px blur
}

export interface BrandQuoteSettings {
  enabled: boolean;
  logo: BrandQuoteLogoSettings;
  quote: {
    enabled: boolean;
    text: string;
    textColor?: string;
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
  authorTagline: {
    enabled: boolean;
    text: string;
    textColor?: string;
  };
  background: BrandQuoteBackgroundSettings;
  paddingY?: 'compact' | 'normal' | 'spacious';
}

export interface FooterLinkItem {
  id: string;
  label: string;
  actionType: 'scroll' | 'contact' | 'whatsapp' | 'custom';
  target?: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  items: FooterLinkItem[];
}

export interface FooterSocialItem {
  id: string;
  network: 'instagram' | 'whatsapp' | 'tiktok' | 'pinterest' | 'facebook' | 'youtube' | 'email';
  handle: string;
}

export interface FooterArtistSignature {
  enabled: boolean;
  prefix: string;
  artistName: string;
  websiteUrl: string;
  websiteLabel: string;
  signatureUrl?: string;
  style?: 'handwritten' | 'classic' | 'minimal';
}

export interface FooterSettings {
  enabled: boolean;
  brand: {
    displayType: 'name' | 'logo';
    nameText: string;
    logoUrl?: string;
    logoHeight?: number;
    tagline: {
      enabled: boolean;
      text: string;
    };
    origins: {
      enabled: boolean;
      text: string;
    };
  };
  columns: FooterColumn[];
  socials: FooterSocialItem[];
  bottom: {
    copyright: string;
    loveMessage: string;
    artistSignature?: FooterArtistSignature;
  };
  background: {
    type: 'video' | 'image' | 'color';
    mediaUrl?: string;
    posterUrl?: string;
    overlayColor?: string;
    overlayOpacity?: number; // 0 - 100
  };
}

export interface DashboardFounderImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
  createdAt?: string;
}

export interface DashboardFounderSettings {
  enabled: boolean;
  ownerName: string;
  ownerRole: string;
  welcomeMessage: string;
  quote: string;
  heroBgImage: string;
  sidebarAvatarImage?: string;
  gallery: DashboardFounderImage[];
}

export interface StoreGeneralSettings {
  storeName: string;
  monogram: string;
  tagline?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  supportEmail?: string;
  instagramHandle?: string;
  cnpjOrDocument?: string;
  addressCity?: string;
}

export interface GiftSlide {
  id: string;
  badge?: string;
  title: string;
  message: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface GiftPresentationSettings {
  enabled: boolean;
  autoOpenOnMobileFirstVisit: boolean;
  floatingButtonEnabled: boolean;
  floatingButtonLabel: string;
  floatingButtonPosition?: 'bottom-left' | 'bottom-right';
  slides: GiftSlide[];
  ribbon: {
    badge: string;
    title: string;
    message: string;
    sealMonogram: string;
    cutButtonText: string;
    celebrationTitle: string;
    celebrationMessage: string;
    enterStoreButtonText: string;
  };
}

export interface StoreCustomizationSettings {
  general?: StoreGeneralSettings;
  header: HeaderSettings;
  hero: HeroSettings;
  founder: FounderSettings;
  dashboardFounder?: DashboardFounderSettings;
  team?: TeamSettings;
  productLines?: ProductLine[];
  deliveryExperience?: DeliveryExperienceSettings;
  brandQuote?: BrandQuoteSettings;
  footer?: FooterSettings;
  giftPresentation?: GiftPresentationSettings;
}

