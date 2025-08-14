import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem, User } from '../data/mockData';
import { mockUser } from '../data/mockData';

// Tipos para el estado global
interface AppState {
  user: User | null;
  cart: CartItem[];
  favorites: number[];
  isAuthenticated: boolean;
}

// Acciones disponibles
type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: number }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number };

// Estado inicial
const initialState: AppState = {
  user: null,
  cart: [],
  favorites: [],
  isAuthenticated: false,
};

// Reducer para manejar las acciones
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        favorites: [],
      };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { id: action.payload.productId, quantity: action.payload.quantity }],
        };
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };
    default:
      return state;
  }
}

// Contexto
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Proveedor del contexto
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
}

// Funciones helper para acciones comunes
export function useCart() {
  const { state, dispatch } = useApp();

  const addToCart = (productId: number, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = (products: Product[]) => {
    return state.cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
}

export function useFavorites() {
  const { state, dispatch } = useApp();

  const addToFavorites = (productId: number) => {
    if (!state.favorites.includes(productId)) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: productId });
    }
  };

  const removeFromFavorites = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  const isFavorite = (productId: number) => {
    return state.favorites.includes(productId);
  };

  return {
    favorites: state.favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
}

export function useAuth() {
  const { state, dispatch } = useApp();

  const login = (email: string, password: string) => {
    // Simulación de login - en una app real harías una petición al servidor
    if (email && password) {
      dispatch({ type: 'LOGIN', payload: mockUser });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
}
