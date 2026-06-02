import type { Category, Product } from "./types";

export const categories: { id: Category; label: string }[] = [
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "sports", label: "Sports" },
  { id: "books", label: "Books" },
];

export type SearchDepartment = "all" | Category;

export const searchDepartments: { value: SearchDepartment; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
];

export function buildShopSearchUrl(options: {
  q?: string;
  department?: SearchDepartment;
}) {
  const params = new URLSearchParams();
  const term = options.q?.trim();
  if (term) params.set("q", term);
  if (options.department && options.department !== "all") {
    params.set("category", options.department);
  }
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export const products: Product[] = [
  {
    id: "wireless-headphones",
    name: "AeroSound Pro Wireless Headphones",
    description:
      "Active noise cancellation, 40-hour battery, and studio-grade drivers for immersive listening anywhere.",
    price: 149.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    rating: 4.7,
    reviewCount: 2841,
    stock: 42,
    featured: true,
  },
  {
    id: "smart-watch",
    name: "PulseTrack Smart Watch",
    description:
      "Heart-rate monitoring, GPS, sleep tracking, and 7-day battery in a lightweight aluminum case.",
    price: 229.0,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    rating: 4.5,
    reviewCount: 1203,
    stock: 28,
    featured: true,
  },
  {
    id: "linen-shirt",
    name: "Coastal Linen Shirt",
    description:
      "Breathable European linen with a relaxed fit — perfect for warm days and easy layering.",
    price: 68.0,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    rating: 4.6,
    reviewCount: 512,
    stock: 65,
    featured: true,
  },
  {
    id: "running-shoes",
    name: "Velocity Run Sneakers",
    description:
      "Lightweight mesh upper with responsive foam cushioning for daily miles and race day.",
    price: 119.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    rating: 4.8,
    reviewCount: 3420,
    stock: 18,
    featured: true,
  },
  {
    id: "ceramic-planter",
    name: "Minimal Ceramic Planter Set",
    description:
      "Hand-glazed trio of planters with drainage trays — ideal for succulents and herbs.",
    price: 45.0,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d024d42d?w=800&q=80",
    rating: 4.4,
    reviewCount: 189,
    stock: 33,
  },
  {
    id: "desk-lamp",
    name: "Lumen Desk Lamp",
    description:
      "Adjustable warm-to-cool LED with touch dimmer and USB-C charging port built into the base.",
    price: 79.5,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    rating: 4.3,
    reviewCount: 276,
    stock: 50,
  },
  {
    id: "yoga-mat",
    name: "GripFlow Yoga Mat",
    description:
      "Extra-thick eco rubber with alignment guides and a carrying strap included.",
    price: 54.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    rating: 4.6,
    reviewCount: 891,
    stock: 74,
  },
  {
    id: "design-book",
    name: "The Art of Everyday Design",
    description:
      "A beautifully illustrated guide to creating products people love — 320 pages, hardcover.",
    price: 38.0,
    category: "books",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    rating: 4.9,
    reviewCount: 156,
    stock: 120,
  },
  {
    id: "leather-tote",
    name: "Heritage Leather Tote",
    description:
      "Full-grain vegetable-tanned leather with interior laptop sleeve and magnetic closure.",
    price: 185.0,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    rating: 4.7,
    reviewCount: 423,
    stock: 12,
  },
  {
    id: "bluetooth-speaker",
    name: "WaveBox Portable Speaker",
    description:
      "IPX7 waterproof, 360° sound, and 18-hour playtime — party-ready and pocket-sized.",
    price: 89.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    rating: 4.5,
    reviewCount: 967,
    stock: 55,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(
  query: string,
  limit = 6,
  department: SearchDepartment = "all",
): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  let list =
    department === "all"
      ? products
      : products.filter((p) => p.category === department);

  return list
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

export function searchCategories(
  query: string,
  department: SearchDepartment = "all",
) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  let list = categories;
  if (department !== "all") {
    list = list.filter((c) => c.id === department);
  }
  return list.filter((c) => c.label.toLowerCase().includes(q));
}

export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} Birr`;
}

export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_COST = 5.99;

export function getShippingCost(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COST;
}
