export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  order_num: number;
  is_active: boolean;
}

export interface ProductOption {
  name: string;
  choices: string[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  badge_text?: string | null;
  is_available: boolean;
  is_hidden: boolean;
  options?: ProductOption[] | null;
  order_num: number;
  category?: Category;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  order_num: number;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  whatsapp_number: string;
  whatsapp_message_prefix: string;
  instagram_handle: string;
  schedule_text: string;
  delivery_zones: string;
  delivery_fee: number;
  address_text?: string | null;
  is_open_now: boolean;
}

export interface CartItem {
  id: string; // unique identifier for cart item (product.id + chosen options/toppings)
  product: Product;
  quantity: number;
  selectedOption?: string;
  selectedToppings?: Topping[];
  subtotal: number;
}
