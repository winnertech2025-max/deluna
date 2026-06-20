export type Category = string;

export type ProductStatus = "active" | "out_of_stock" | "draft";

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
  stock?: number;
};

export type Product = {
  price: any;
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  image: string;
  gallery: string[];
  basePrice: number;
  currency: "EUR";
  status: ProductStatus;
  isBestSeller?: boolean;
  rating?: number;
  soldCount?: number;
  tags?: string[];
  isPersonalizable: boolean;
  personalization: {
    label: string;
    maxLength: number;
    placement: string;
    fonts: string[];
    colors: string[];
  };
  variants: ProductVariant[];
  deliveryDays: string;
  temuReference?: string;
};

export type CartItem = {
  product: Product;
  variantId: string;
  quantity: number;
  engravingText: string;
  font: string;
  color: string;
  previewUrl?: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled";
