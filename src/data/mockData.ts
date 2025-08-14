// Datos de prueba para el e-commerce de merma y reciclaje

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  isOnSale: boolean;
  isFeatured: boolean;
  tags: string[];
  material: string;
  sustainabilityRating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Categorías principales
export const categories: Category[] = [
  {
    id: 'plastico-reciclado',
    name: 'Plástico Reciclado',
    icon: 'fas fa-recycle',
    description: 'Productos fabricados con plásticos recuperados de merma industrial'
  },
  {
    id: 'madera-reutilizada',
    name: 'Madera Reutilizada',
    icon: 'fas fa-tree',
    description: 'Maderas de segunda vida para construcción y decoración'
  },
  {
    id: 'construccion-sostenible',
    name: 'Construcción Sostenible',
    icon: 'fas fa-hammer',
    description: 'Materiales eco-friendly para construcción'
  },
  {
    id: 'compostaje',
    name: 'Compostaje',
    icon: 'fas fa-leaf',
    description: 'Herramientas y kits para compostaje casero'
  },
  {
    id: 'textiles-reciclados',
    name: 'Textiles Reciclados',
    icon: 'fas fa-tshirt',
    description: 'Telas y productos textiles reciclados'
  },
  {
    id: 'metal-recuperado',
    name: 'Metal Recuperado',
    icon: 'fas fa-cog',
    description: 'Metales y componentes recuperados de la industria'
  }
];

// Productos principales
export const products: Product[] = [
  {
    id: 1,
    name: 'Bolsa Reutilizable de Plástico Reciclado',
    price: 15.90,
    originalPrice: 25.00,
    description: 'Bolsa resistente fabricada 100% con plásticos recuperados de merma industrial. Capacidad de 15kg, lavable y reutilizable.',
    category: 'plastico-reciclado',
    image: 'https://images.unsplash.com/photo-1573160813959-df65f19ba79d?w=400&h=400&fit=crop',
    stock: 150,
    rating: 4.5,
    reviews: 28,
    isOnSale: true,
    isFeatured: true,
    tags: ['eco-friendly', 'reutilizable', 'resistente'],
    material: 'Plástico PET reciclado',
    sustainabilityRating: 5
  },
  {
    id: 2,
    name: 'Tablón de Pino Reutilizado 2x4',
    price: 120.50,
    originalPrice: 180.00,
    description: 'Tablón de pino recuperado de demoliciones, tratado y listo para uso. Ideal para proyectos de construcción sostenible.',
    category: 'madera-reutilizada',
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop',
    stock: 45,
    rating: 4.7,
    reviews: 12,
    isOnSale: true,
    isFeatured: true,
    tags: ['construcción', 'sostenible', 'tratado'],
    material: 'Pino recuperado',
    sustainabilityRating: 4
  },
  {
    id: 3,
    name: 'Ladrillo Ecológico de Residuos',
    price: 8.75,
    originalPrice: 12.00,
    description: 'Ladrillo fabricado a partir de residuos de construcción y demolición. Mayor aislamiento térmico que ladrillos tradicionales.',
    category: 'construccion-sostenible',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    stock: 200,
    rating: 4.3,
    reviews: 34,
    isOnSale: false,
    isFeatured: true,
    tags: ['construcción', 'aislante', 'ecológico'],
    material: 'Residuos de construcción compactados',
    sustainabilityRating: 5
  },
  {
    id: 4,
    name: 'Kit de Compostaje Familiar',
    price: 89.90,
    originalPrice: 120.00,
    description: 'Kit completo para compostaje casero. Incluye compostera de 120L, manual y termómetro de compost.',
    category: 'compostaje',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    stock: 30,
    rating: 4.8,
    reviews: 22,
    isOnSale: true,
    isFeatured: true,
    tags: ['compost', 'familiar', 'completo'],
    material: 'Plástico reciclado y metal',
    sustainabilityRating: 5
  },
  {
    id: 5,
    name: 'Tela de Algodón Reciclado',
    price: 45.00,
    description: 'Tela de algodón 100% reciclado, perfecta para proyectos de costura sostenible. Rollo de 5 metros.',
    category: 'textiles-reciclados',
    image: 'https://images.unsplash.com/photo-1586864387543-7d09ea2c8bdd?w=400&h=400&fit=crop',
    stock: 25,
    rating: 4.2,
    reviews: 15,
    isOnSale: false,
    isFeatured: false,
    tags: ['costura', 'algodón', 'reciclado'],
    material: 'Algodón 100% reciclado',
    sustainabilityRating: 4
  },
  {
    id: 6,
    name: 'Tubo de Acero Recuperado 1"',
    price: 35.75,
    originalPrice: 50.00,
    description: 'Tubo de acero galvanizado recuperado de la industria. Perfecto para estructuras y proyectos de construcción.',
    category: 'metal-recuperado',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
    stock: 80,
    rating: 4.6,
    reviews: 18,
    isOnSale: true,
    isFeatured: false,
    tags: ['construcción', 'estructura', 'galvanizado'],
    material: 'Acero galvanizado recuperado',
    sustainabilityRating: 4
  },
  {
    id: 7,
    name: 'Panel Solar Reacondicionado 100W',
    price: 250.00,
    originalPrice: 400.00,
    description: 'Panel solar de 100W reacondicionado y certificado. Perfecto para proyectos de energía sostenible.',
    category: 'metal-recuperado',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop',
    stock: 15,
    rating: 4.9,
    reviews: 8,
    isOnSale: true,
    isFeatured: true,
    tags: ['solar', 'energía', 'reacondicionado'],
    material: 'Silicio y aluminio reciclado',
    sustainabilityRating: 5
  },
  {
    id: 8,
    name: 'Compostador Rotativo de 300L',
    price: 180.00,
    description: 'Compostador rotativo de alta capacidad fabricado con plástico reciclado. Sistema de rotación fácil.',
    category: 'compostaje',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&h=400&fit=crop',
    stock: 12,
    rating: 4.4,
    reviews: 9,
    isOnSale: false,
    isFeatured: false,
    tags: ['compost', 'rotativo', 'gran capacidad'],
    material: 'Plástico HDPE reciclado',
    sustainabilityRating: 5
  }
];

// Reseñas de productos
export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: 'María González',
    rating: 5,
    comment: 'Excelente calidad, muy resistente y el precio es increíble para ser un producto reciclado.',
    date: '2025-01-15'
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: 'Carlos Mendoza',
    rating: 4,
    comment: 'Muy buena bolsa, la uso para hacer las compras. Me gusta apoyar productos sostenibles.',
    date: '2025-01-10'
  },
  {
    id: 3,
    productId: 4,
    userId: 3,
    userName: 'Ana Huamán',
    rating: 5,
    comment: 'El kit está completo y muy bien explicado. Ya estoy haciendo mi propio compost en casa.',
    date: '2025-01-08'
  }
];

// Usuario de ejemplo
export const mockUser: User = {
  id: 1,
  name: 'Usuario de Prueba',
  email: 'usuario@example.com',
  phone: '+51 987 654 321',
  address: {
    street: 'Av. Reciclaje 123',
    city: 'Lima',
    state: 'Lima',
    zipCode: '15001',
    country: 'Perú'
  }
};
