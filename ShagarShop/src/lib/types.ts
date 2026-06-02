export type Category =
  | "electronics"
  | "fashion"
  | "home"
  | "sports"
  | "books";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
