import { Product, StoryArticle, WorldItem, AtelierStep, UniverseTile } from '../types';

export const FOUNDER_INFO = {
  name: "Aline de La Tour",
  role: "A mulher por trás da Maison",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
  portraitSecondary: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=85",
  quote: "Tudo aquilo que permanece começa com uma história.",
  shortBio: "Criada entre o interior bucólico e estadias prolongadas na Europa aristocrática, Aline transformou sua paixão pela memória afetiva dos objetos e pela arte de bem-receber no alicerce de uma Maison atemporal.",
  fullStory: [
    "Minha relação com a beleza nasceu do silêncio das tardes em casarões antigos, do aroma de alfazema guardada nas gavetas de linho e da luz dourada que atravessava as janelas altas das vilas europeias que visitei na juventude.",
    "Para mim, uma casa não é apenas um espaço físico; é um santuário de sensações. Cada vela acesa, cada sabonete esculpido com essências botânicas e cada fio de crochê entrelaçado manualmente carrega o propósito de devolver ao tempo a sua cadência calma.",
    "A Maison nasceu não como uma marca de objetos, mas como um convite ao ritual. Não fazemos produtos em massa. Criamos pequenos fragmentos de poesia para guardar a beleza dos dias.",
    "Acredito que os verdadeiros luxos contemporâneos são o tempo, o afeto e aquilo que é feito intencionalmente com as mãos."
  ],
  details: [
    "Inspiração nas residências históricas da França e Itália",
    "Preservação do saber-fazer artesanal e matérias nobres",
    "Produção em edições limitadas no Atelier",
    "Sustentabilidade e respeito ao ritmo da natureza"
  ]
};

export const THREE_WORLDS: WorldItem[] = [
  {
    id: 'perfume',
    romanNumber: 'I',
    title: 'O PERFUME',
    subtitle: 'Velas aromáticas',
    category: 'velas',
    description: 'Fragrâncias criadas para transformar a atmosfera de uma casa, despertando memórias refinadas e serenidade.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85',
    quote: 'O aroma é a escultura invisível de um ambiente.',
    details: ['Cera 100% Vegetal', 'Pavio de Algão Puro', 'Fragrâncias Exclusivas de Grasse']
  },
  {
    id: 'cuidado',
    romanNumber: 'II',
    title: 'O CUIDADO',
    subtitle: 'Sabonetes naturais',
    category: 'sabonetes',
    description: 'Água, pedra, folhas, flores, espuma, mãos. O ritual cotidiano do banho transformado em gesto de puro autocuidado.',
    image: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1200&q=85',
    quote: 'A simplicidade da pedra e o aconchego dos óleos botânicos.',
    details: ['Mapeamento Botânico', 'Prensado Frio Artesanal', 'Óleos Essenciais Puros']
  },
  {
    id: 'feito-a-mao',
    romanNumber: 'III',
    title: 'O FEITO À MÃO',
    subtitle: 'Crochê aristocrático',
    category: 'croche',
    description: 'Peças que carregam o tempo, a delicadeza e a atenção minuciosa da mão que as criou para ornar mesas e momentos.',
    image: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1200&q=85',
    quote: 'Um ponto após o outro, alinhavando memórias e aconchego.',
    details: ['Fios de Algodão Nobre', 'Trama Exclusiva', 'Acabamento Impecável']
  }
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'vela-jardim-versailles',
    name: 'Vela — Jardim de Versailles',
    category: 'velas',
    categoryLabel: 'Vela Aromática em Porcelana',
    price: 189,
    shortStory: 'Uma fragrância inspirada nas manhãs primaveris dos jardins franceses, com notas de flor de laranjeira, musgo sagrado e bergamota real.',
    fullStory: 'Esta vela evoca a caminhada solitária pelos alamedas de Versailles logo ao alvorecer, quando o orvalho ainda repousa sobre as pétalas e a brisa traz o aroma límpido da terra úmida entrelaçada às flores nobres.',
    primaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1572726729986-7a1362e0c1f5?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572726729986-7a1362e0c1f5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4',
    details: [
      'Cera vegetal de coco, arroz e palma',
      'Pavio duplo de algodão e madeira nobre',
      'Pote de cerâmica artesanal reutilizável',
      'Tempo de queima estimado: 50 horas'
    ],
    fragranceNotes: {
      top: 'Bergamota Real & Néroli de Grasse',
      heart: 'Flor de Laranjeira & Rosa Damascena',
      base: 'Musgo de Carvalho & Âmbar Dourado'
    },
    materials: ['Porcelana biscuit', 'Cera vegetal pura', 'Óleos essenciais franceses'],
    dimensions: '9cm x 8cm • 220g'
  },
  {
    id: 'sabonete-pedras-loire',
    name: 'Sabonete — Pedras do Loire',
    category: 'sabonetes',
    categoryLabel: 'Sabonete Botânico Mineral',
    price: 94,
    shortStory: 'Infusionado com argila branca purificante, manteiga de karité e infusão de camomila romana para uma espuma aveludada.',
    fullStory: 'Formulado artesanalmente pelo método de saponificação a frio (cold process), este sabonete descansa por 6 semanas no atelier para alcançar a densidade perfecta e preservar as propriedades calmantes das botânicas europeias.',
    primaryImage: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1608248597359-05d5351a9a83?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-splashing-in-a-glass-bowl-43405-large.mp4',
    details: [
      'Método de saponificação a frio',
      'Rico em glicerina natural retida',
      'Livre de sulfatos, parabenos e fragrâncias sintéticas',
      'Embalado em papel kraft artesanal com carimbo de cera'
    ],
    materials: ['Óleo de oliva extravirgem', 'Manteiga de karité', 'Argila branca mineral', 'Extrato de camomila'],
    dimensions: '7.5cm x 7.5cm x 3cm • 140g',
    recentlySoldOut: true
  },
  {
    id: 'jogo-americano-folha-oliveira',
    name: 'Jogo Americano — Folha de Oliveira',
    category: 'croche',
    categoryLabel: 'Peça de Mesa Feita à Mão',
    price: 240,
    shortStory: 'Crochê circular em tom verde oliva profundo, com padrão rendado periférico inspirado nas guirlandas clássicas dos palácios.',
    fullStory: 'Cada sousplat demanda mais de quatro horas de trabalho manual dedicado. O fio de algodão mercerizado confere um brilho acetinado sutil que harmoniza perfeitamente com louças de porcelana e taças de cristal lapidado.',
    primaryImage: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      '100% Algodão nobre de fibra longa',
      'Estrutura firme e acabamento acetinado',
      'Resistente e engomado suavemente para estabilidade na mesa',
      'Unidade (vendido individualmente ou em conjuntos de 4/6)'
    ],
    materials: ['Fio de algodão mercerizado nobre', 'Tratamento antimanchas suave'],
    dimensions: 'Diâmetro: 38 cm'
  },
  {
    id: 'porta-guardanapos-terroir',
    name: 'Anéis Porta-Guardanapos — Terroir',
    category: 'croche',
    categoryLabel: 'Set com 2 Peças em Crochê',
    price: 110,
    shortStory: 'Argolas delicadamente revestidas em ponto denso de crochê em tom fiação crua e oliva, para vestir linho puro com afeto.',
    fullStory: 'Um detalhe discreto que transforma a experiência do jantar. O toque macio da textura do crochê abraça o guardanapo de linho natural, trazendo aconchego e elegância à mesa posta.',
    primaryImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85'
    ],
    details: [
      'Set composto por 2 unidades',
      'Base rígida natural revestida artesanalmente',
      'Design orgânico e textura tátil marcante',
      'Acompanha saco de algodão cruzado para guardar'
    ],
    materials: ['Algodão cru orgânico', 'Madeira de reflorestamento interna'],
    dimensions: 'Diâmetro interno: 4.5cm'
  },
  {
    id: 'vela-biblioteca-imperial',
    name: 'Vela — Biblioteca Imperial',
    category: 'velas',
    categoryLabel: 'Vela Aromática em Cerâmica Fosca',
    price: 195,
    shortStory: 'Notas amadeiradas de cedro ancestral, âmbar quente e encadernações de couro, com pavio crepitante de madeira nobre.',
    fullStory: 'Inspirada nas grandes bibliotecas florentinas e nos claustros silenciosos da Europa. Aquece o ambiente com uma presença sutil, profunda e atemporal que convida à leitura e introspecção.',
    primaryImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572726729986-7a1362e0c1f5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-candle-in-a-dark-room-42880-large.mp4',
    details: [
      'Cera de coco e palma 100% natural',
      'Pavio duplo em lâmina de madeira crepitante',
      'Pote cerâmico feito à mão no torno',
      'Tempo de queima: 55 horas'
    ],
    fragranceNotes: {
      top: 'Cedro do Atlas & Pimenta Negra',
      heart: 'Couro Antigo & Tabaco Doce',
      base: 'Âmbar Resinoso & Baunilha Bourbon'
    },
    materials: ['Cerâmica terracota fosca', 'Cera vegetal nobre', 'Óleos de Grasse'],
    dimensions: '10cm x 8.5cm • 250g'
  },
  {
    id: 'vela-orvalho-florenca',
    name: 'Vela — Orvalho de Florença',
    category: 'velas',
    categoryLabel: 'Vela em Porcelana Vidrada',
    price: 185,
    shortStory: 'O frescor do figo maduro colhido ao amanhecer, entrelaçado ao cipreste toscano e folhas de violeta úmidas.',
    fullStory: 'Uma fragrância luminosa que traz para dentro de casa a brisa que percorre os jardins da Toscana nas primeiras horas do dia. O vaso em porcelana vitrificada reflete a chama com brilho suave.',
    primaryImage: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    details: [
      'Cera vegetal pura de arroz e coco',
      'Pavio 100% algodão trançado',
      'Fragrância com óleos essenciais rastreados',
      'Tempo de queima: 48 horas'
    ],
    fragranceNotes: {
      top: 'Figo Verde & Folhas de Violeta',
      heart: 'Cipreste Toscano & Flor de Oliveira',
      base: 'Almíscar Branco & Cedro Claro'
    },
    materials: ['Porcelana esmaltada', 'Cera vegetal pura'],
    dimensions: '8.5cm x 8cm • 210g'
  },
  {
    id: 'sabonete-lavanda-argila-roxa',
    name: 'Sabonete — Lavanda & Argila Roxa',
    category: 'sabonetes',
    categoryLabel: 'Sabonete Botânico Prensado a Frio',
    price: 88,
    shortStory: 'Manteiga de cacau cru, flores de lavanda silvestre e argila roxa rica em minerais restauradores da epiderme.',
    fullStory: 'Produzido pelo método ancestral de saponificação a frio com seis semanas de maturação em estantes de pinho nórdico. Uma espuma cremosa que relaxa a mente e acaricia a pele no final do dia.',
    primaryImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    details: [
      'Método cold process tradicional',
      'Argila roxa natural de jazidas sustentáveis',
      'Óleos essenciais de lavanda pura francesa',
      'Embalagem em papel algodão com selo Maison'
    ],
    materials: ['Azeite de oliva virgem', 'Manteiga de cacau', 'Argila roxa', 'Óleo essencial de lavanda'],
    dimensions: '7.5cm x 7.5cm • 135g'
  },
  {
    id: 'sabonete-alecrim-oliva',
    name: 'Sabonete — Alecrim & Oliva Dourada',
    category: 'sabonetes',
    categoryLabel: 'Sabonete Esfoliante Botânico',
    price: 92,
    shortStory: 'Extrato vegetal de alecrim fresco macerado em azeite de oliva extravirgem com pó suave de sementes botânicas.',
    fullStory: 'Proporciona uma renovação celular delicada através do toque natural das ervas do campo. O aroma revigorante do alecrim limpa o ar e renova a vitalidade do corpo.',
    primaryImage: 'https://images.unsplash.com/photo-1608248597359-05d5351a9a83?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    details: [
      'Esfoliação tátil ultra-suave',
      'Aroma herbal revigorante e puro',
      'pH equilibrado e glicerina natural retida',
      'Cura lenta de 45 dias no atelier'
    ],
    materials: ['Azeite de oliva', 'Alecrim botânico', 'Argila verde'],
    dimensions: '7.5cm x 7.5cm • 140g'
  },
  {
    id: 'caminho-mesa-heranca',
    name: 'Caminho de Mesa — Herança Barroca',
    category: 'croche',
    categoryLabel: 'Tapeçaria de Mesa Feita à Mão',
    price: 380,
    shortStory: 'Trama rendada de crochê com mais de doze horas de confecção manual contínua em fio cru nobre de fibra extra-longa.',
    fullStory: 'Uma joia têxtil para vestir a mesa com a nobreza de tempos passados. Cada losango e cada laçada são executados com tensão perfeita pelas artesãs mais experientes da Maison.',
    primaryImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
    details: [
      'Algodão 100% de fibra extra-longa',
      'Ponto rendado clássico europeu',
      'Acabamento com franja manual leve',
      'Acompanha estojo protetor de linho'
    ],
    materials: ['Algodão nobre mercerizado cru'],
    dimensions: '140cm x 40cm'
  }
];

export const HERO_PRODUCT_STORY = {
  title: "Uma vela não é apenas uma vela.",
  subtitle: "Ela carrega a alma do espaço e o tempo da contemplação.",
  image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85",
  secondaryImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85",
  narrative: [
    "No silêncio de uma casa em repouso, acender uma chama é um ritual de consagração da presença.",
    "Nossas velas são concebidas a partir de memórias olfativas colhidas em jardins europeus, claustros medievais e viagens ao longo do Mediterrâneo.",
    "Utilizamos apenas cera 100% vegetal, livre de parafina, combinada a óleos essenciais raros e pavios de algodão que queimam em uma flama suave, limpa e duradoura."
  ],
  aspects: [
    { title: "Origem da Fragrância", desc: "Destilados olfativos elaborados na região de Grasse, na França." },
    { title: "Inspiração Botanical", desc: "Flora aristocrática, musgos e madeiras nobres de florestas preservadas." },
    { title: "Matéria-Prima", desc: "Cera vegetal de coco, palma e arroz, enriquecida com manteigas florais." },
    { title: "Processo Lento", desc: "Vertida manualmente em cerâmica artesanal, em lotes numerados de 50 unidades." },
    { title: "Sintonia do Ambiente", desc: "Perfeita para a biblioteca ao entardecer ou ao lado de uma banheira aquecida." }
  ],
  badges: ["Cera natural", "Produção artesanal", "Fragrância exclusiva"]
};

export const ATELIER_STEPS: AtelierStep[] = [
  {
    id: 'croche-process',
    title: 'A Dança dos Fios',
    subtitle: 'Crochê feito à mão',
    description: 'Cada laçada exige cadência e concentração absoluta. As agulhas de madeira deslizam conduzindo o algodão cru até moldar contornos que parecem respirar.',
    image: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
    tag: 'Trama Manual'
  },
  {
    id: 'sabonete-process',
    title: 'A Alquimia dos Óleos',
    subtitle: 'Saponificação a frio',
    description: 'A infusão de ervas colhidas de manhã se une a óleos nobres. O sabonete é moldado em formas de pedra e repousa sob luz natural por quarenta dias.',
    image: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    tag: 'Maturação Lenta'
  },
  {
    id: 'vela-process',
    title: 'O Vaso e a Flama',
    subtitle: 'Mapeamento Olfativo',
    description: 'A cera aquecida no ponto exato recebe as notas de topo e de fundo. Vertida manualmente em vasilhames de porcelana biscuit acabados à mão.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    tag: 'Vertido à Mão'
  },
  {
    id: 'embalagem-process',
    title: 'O Ritual do Presente',
    subtitle: 'Selo de cera e ráfia',
    description: 'Cada caixa é envolta em papel kraft estampado com flores botânicas, atada com cordão natural de juta e carimbada com nosso lacre oficial.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    tag: 'Embalagem Especial'
  }
];

export const UNIVERSE_TILES: UniverseTile[] = [
  {
    id: 'casa',
    title: 'Casa',
    subtitle: 'A luz que habita o cotidiano',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-2 lg:col-span-2',
    rowSpan: 'md:row-span-2',
    description: 'Ambientes aristocráticos onde o tempo parece desacelerar. Espaços iluminados pela luz do sol sobre móveis de madeira maciça e cortinas de linho.'
  },
  {
    id: 'jardim',
    title: 'Jardim',
    subtitle: 'Botânica europeia clássica',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
    description: 'Rosarais históricos, estufas de ferro forjado e folhagens aromáticas que fornecem a essência de nossas coleções.'
  },
  {
    id: 'banho',
    title: 'Banho',
    subtitle: 'O santuário da água',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
    description: 'Superfícies de pedra calcária, pias de porcelana vitrificada e rituais com sabonetes e óleos florais purificantes.'
  },
  {
    id: 'atelier',
    title: 'Atelier',
    subtitle: 'Onde tudo nasce',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
    description: 'Mesas cobertas de croquis, amostras de fios de algodão, frascos de ensaio olfativo e ferramentas artesanais de precisão.'
  },
  {
    id: 'mesa',
    title: 'Mesa',
    subtitle: 'A arte de reunir afetos',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-1 lg:col-span-1',
    rowSpan: 'md:row-span-1',
    description: 'Mesas postas com louças antigas, sousplats de crochê em tom oliva, taças lapidadas e velas acesas ao anoitecer.'
  },
  {
    id: 'viagem',
    title: 'Viagem',
    subtitle: 'Rotas da nobreza e cultura',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85',
    colSpan: 'md:col-span-2 lg:col-span-2',
    rowSpan: 'md:row-span-1',
    description: 'Cadernos de campo preenchidos na Provence, em Florença e Sintra. Lugares onde a arquitetura e a natureza conversam há séculos.'
  }
];

export const MAISON_STORIES: StoryArticle[] = [
  {
    id: 'inspiracao-velas',
    title: 'A inspiração por trás das velas',
    subtitle: 'Como capturar o aroma do passado em frascos de porcelana',
    category: 'O Perfume',
    readingTime: '4 min de leitura',
    date: 'Setembro, 2026',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Criar uma fragrância para a casa é como pintar um quadro com lembranças invisíveis. Descubra os segredos por trás das nossas misturas botânicas.',
    quote: 'As memórias mais marcantes de nossas vidas costumam chegar antes de qualquer palavra — chegam pelo olfato.',
    content: [
      'Quando começamos a desenhar a coleção de velas da Maison, recusei a ideia de replicar aromas comerciais doces ou sintéticos. Desejava um perfume que lembrasse bibliotecas velhas com encadernações de couro, jardins molhados de orvalho em Florença e salas de estar aquecidas com lareiras nas noites de outono.',
      'Trabalhamos diretamente com perfumistas de Grasse para harmonizar notas de néroli, madeira de cedro, figo fresco e musgo de carvalho. O resultado são fragrâncias vivas, que não sobrecarregam o ar, mas o perfumam como uma névoa delicada e aconchegante.'
    ]
  },
  {
    id: 'arte-sabonete-natural',
    title: 'A arte do sabonete natural',
    subtitle: 'O respeito ao tempo na saponificação a frio',
    category: 'O Cuidado',
    readingTime: '5 min de leitura',
    date: 'Agosto, 2026',
    image: 'https://images.unsplash.com/photo-1607006482172-43093b5847e7?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Longe da produção industrial apressada, nossos sabonetes exigem seis semanas de repouso em prateleiras de madeira para amadurecer.',
    quote: 'O cuidado com o corpo não deve ser uma etapa apressada, mas uma pausa consciente no ritmo do dia.',
    content: [
      'O método tradicional de cold process preserva integralmente a glicerina natural formada durante a reação dos óleos vegetais extravirgens com as infusoes botânicas.',
      'Cada barra é cortada manualmente no atelier e recebe o cunho do nosso emblema. Quando entra em contato com a água, produz uma espuma cremosíssima que limpa sem ressecar a pele, deixando um véu suave de fragrância natural.'
    ]
  },
  {
    id: 'tempo-do-croche',
    title: 'O tempo do crochê',
    subtitle: 'Reivindicando a delicadeza e a atenção minuciosa',
    category: 'O Feito à Mão',
    readingTime: '6 min de leitura',
    date: 'Julho, 2026',
    image: 'https://images.unsplash.com/photo-1615800001619-4c670355f69e?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Num mundo marcado pela velocidade imediata, o crochê é uma das poucas artes que nenhuma máquina consegue imitar perfeitamente.',
    quote: 'Cada nó e cada laçada guarda o batimento calmo do tempo dedicado a criá-lo.',
    content: [
      'A trama artesanal do crochê traz uma calorosa humanidade às linhas geométricas da arquitetura contemporânea. Nossos sousplats e anéis porta-guardanapos nascem do entrelaçar rítmico de fios nobres de algodão de fibra longa.',
      'São peças pensadas para passar de geração em geração, embelezando almoços de domingo e jantares intimistas sob a luz de velas.'
    ]
  },
  {
    id: 'jardins-europeus',
    title: 'Jardins europeus e a botânica nobre',
    subtitle: 'A simetria dos parques e a beleza selvagem da flor silvestre',
    category: 'Cultura',
    readingTime: '4 min de leitura',
    date: 'Junho, 2026',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Da geometria impecável dos jardins de le Nôtre à espontaneidade bucólica dos campos ingleses, veja como as plantas moldam a Maison.',
    quote: 'A natureza é a maior mestra de proporção, cor e serenidade.',
    content: [
      'Nossa paleta de cores — com o verde oliva fechado, os tons de argila crua e o linho ecrú — é diretamente derivada das plantas aromáticas e minerais encontrados nos vales europeus.',
      'Estudamos velhos tratados de botânica para selecionar espécies que não apenas encantam os olhos, mas oferecem propriedades calmantes e revigorantes para o espírito.'
    ]
  },
  {
    id: 'rituais-casa',
    title: 'Rituais de uma casa viva',
    subtitle: 'Pequenos gestos para preencher os dias de beleza',
    category: 'Estilo de Vida',
    readingTime: '3 min de leitura',
    date: 'Maio, 2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Como transformar tarefas simples do cotidiano em momentos de contemplação e aconchego.',
    quote: 'A beleza dos ambientes reside no afeto com que os habitamos.',
    content: [
      'Abrir as janelas pela manhã para renovar o ar, arranjar flores frescas colhidas do vaso na mesa do café, acender uma vela ao pôr do sol enquanto se lê um capítulo de um bom livro...',
      'São esses pequenos rituais que transformam paredes em lar e rotina em celebração.'
    ]
  },
  {
    id: 'materiais-ingredientes',
    title: 'Materiais e ingredientes de exceção',
    subtitle: 'O compromisso inflexível com a pureza e a nobreza',
    category: 'Atelier',
    readingTime: '5 min de leitura',
    date: 'Abril, 2026',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    excerpt: 'Selecção rigorosa de ceras vegetais, óleos essenciais rastreáveis e fios de algodão orgânico.',
    quote: 'Não existe luxo genuíno sem integridade de origem.',
    content: [
      'Rejeitamos atalhos. Todos os nossos insumos passam por auditorias severas de qualidade. Sabermos exatamente a origem de cada flor, de cada gota de óleo e de cada novelo de algodão é a garantia do selo da Maison.'
    ]
  }
];
