import type { Category, Product } from "@/types";

const productImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80"
];

const categories: Record<Category, string> = {
  jewelry: "Customized Jewelry",
  bags: "Customized Bags",
  clothing: "Customized Clothing",
  hats: "Customized Hats",
  gifts: "Personalized Gifts",
  accessories: "Accessories"
};

export const categoryImages: Record<Category, string> = {
  jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  bags: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
  clothing: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  hats: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
  gifts: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80",
  accessories: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
};

export const categoryDescriptions: Record<Category, string> = {
  jewelry: "Name necklaces, bracelets, initials and meaningful keepsakes.",
  bags: "Totes, pouches and daily bags with names or monograms.",
  clothing: "Soft pieces with custom text, initials, prints and sizes.",
  hats: "Caps and hats with subtle embroidery for everyday wear.",
  gifts: "Giftable custom items made personal before delivery.",
  accessories: "Cases, mirrors, holders and small details with your mark."
};

const baseProducts: Array<{
  name: string;
  category: Category;
  description: string;
  price: number;
  imageIndex: number;
  placement: string;
}> = [
  { name: "Engraved Heart Bracelet", category: "jewelry", description: "A delicate bracelet with a polished charm for initials, names, or a short date.", price: 16.9, imageIndex: 0, placement: "front charm" },
  { name: "Nameplate Pendant Necklace", category: "jewelry", description: "A refined everyday necklace designed for a name, word, or meaningful initials.", price: 18.5, imageIndex: 0, placement: "center pendant" },
  { name: "Initial Charm Anklet", category: "jewelry", description: "A soft gold-tone anklet with a small custom initial charm.", price: 12.9, imageIndex: 0, placement: "small charm" },
  { name: "Personalized Tote Bag", category: "bags", description: "A clean canvas tote with embroidered name placement for daily use and gifting.", price: 14.8, imageIndex: 1, placement: "front lower corner" },
  { name: "Custom Cosmetic Pouch", category: "bags", description: "A soft pouch for makeup or travel accessories with name embroidery.", price: 11.6, imageIndex: 1, placement: "front center" },
  { name: "Monogram Mini Shoulder Bag", category: "bags", description: "A compact shoulder bag with a subtle monogram option.", price: 24.9, imageIndex: 1, placement: "front flap" },
  { name: "Custom Oversized T-Shirt", category: "clothing", description: "A soft minimal tee with a small text or initials print.", price: 13.5, imageIndex: 2, placement: "left chest" },
  { name: "Personalized Satin Robe", category: "clothing", description: "A giftable robe with initials or a first name on the chest.", price: 22.2, imageIndex: 2, placement: "left chest" },
  { name: "Initial Baseball Cap", category: "hats", description: "A clean cap with embroidered initials on the front.", price: 10.9, imageIndex: 3, placement: "front panel" },
  { name: "Custom Bucket Hat", category: "hats", description: "A soft bucket hat with a name or tiny phrase embroidery.", price: 12.4, imageIndex: 3, placement: "front panel" },
  { name: "Personalized Gift Box", category: "gifts", description: "A curated gift box finished with a custom name label.", price: 19.6, imageIndex: 4, placement: "gift tag" },
  { name: "Custom Acrylic Keychain", category: "gifts", description: "A small personalized keychain for names, couples, or friendship gifts.", price: 6.8, imageIndex: 4, placement: "center acrylic" },
  { name: "Engraved Compact Mirror", category: "gifts", description: "A champagne-tone compact mirror with initials or a short name.", price: 9.9, imageIndex: 4, placement: "mirror lid" },
  { name: "Monogram Phone Case", category: "accessories", description: "A simple phone case with initials and soft neutral color options.", price: 8.7, imageIndex: 5, placement: "case center" },
  { name: "Personalized Passport Holder", category: "accessories", description: "A travel-ready holder with initials stamped in a premium style.", price: 13.2, imageIndex: 5, placement: "front lower right" },
  { name: "Custom Hair Claw Clip", category: "accessories", description: "A polished hair clip with subtle name or initial personalization.", price: 7.5, imageIndex: 5, placement: "top surface" }
];

export const products: Product[] = baseProducts.map((item, index) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const variantNames =
    item.category === "clothing"
      ? ["S", "M", "L"]
      : item.category === "bags"
        ? ["Classic", "Large"]
        : ["Standard", "Premium finish"];

  return {
    id: `prod_${index + 1}`,
    slug,
    name: item.name,
    category: item.category,
    description: item.description,
    image: productImages[item.imageIndex],
    gallery: [productImages[item.imageIndex], productImages[(item.imageIndex + 1) % productImages.length]],
    basePrice: item.price,
    currency: "EUR",
    status: index === 10 ? "out_of_stock" : "active",
    isBestSeller: [0, 1, 3, 6, 8, 13].includes(index),
    rating: Number((4.6 + (index % 4) * 0.1).toFixed(1)),
    soldCount: 61 + index * 137,
    tags: index % 2 === 0 ? ["Free personalization", "Giftable"] : ["New studio pick", "Custom preview"],
    isPersonalizable: true,
    personalization: {
      label: "Name, text, or initials",
      maxLength: item.category === "jewelry" ? 12 : 18,
      placement: item.placement,
      fonts: ["Serif", "Script", "Modern", "Minimal"],
      colors: ["Champagne Gold", "Soft Black", "Ivory", "Rose Nude"]
    },
    variants: variantNames.map((name, variantIndex) => ({
      id: `${slug}_${variantIndex + 1}`,
      name,
      price: Number((item.price + variantIndex * 3.5).toFixed(2)),
      isDefault: variantIndex === 0,
      stock: index === 10 ? 0 : 30 - index
    })),
    deliveryDays: "10-14 business days",
    temuReference: "Marketplace-inspired customizable product seed. Replace with licensed supplier data in production."
  };
});

export const categoryLabels = categories;

export const categoryRules: Record<Category, { label: string; needsSizes: boolean; defaultVariants: string[] }> = {
  jewelry: { label: "Customized Jewelry", needsSizes: false, defaultVariants: ["Standard", "Premium finish"] },
  bags: { label: "Customized Bags", needsSizes: false, defaultVariants: ["Classic", "Large"] },
  clothing: { label: "Customized Clothing", needsSizes: true, defaultVariants: ["S", "M", "L"] },
  hats: { label: "Customized Hats", needsSizes: false, defaultVariants: ["Standard", "Adjustable"] },
  gifts: { label: "Personalized Gifts", needsSizes: false, defaultVariants: ["Standard", "Gift wrapped"] },
  accessories: { label: "Accessories", needsSizes: false, defaultVariants: ["Standard", "Premium finish"] }
};

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category?: string) {
  if (!category || category === "all") return products;
  return products.filter((product) => product.category === category);
}

export function getLowestPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}
