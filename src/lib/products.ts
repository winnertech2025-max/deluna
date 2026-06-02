import type { Category, Product } from "@/types";

export const categoryLabels: Record<Category, string> = {
  jewelry: "Customized Jewelry",
  bags: "Customized Bags",
  clothing: "Customized Clothing",
  kids: "Kids Personalized",
  hats: "Customized Hats",
  gifts: "Personalized Gifts",
  accessories: "Accessories"
};

export const categoryImages: Record<Category, string> = {
  jewelry: "https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg",
  bags: "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg",
  clothing: "https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg",
  kids: "https://img.kwcdn.com/product/open/a4eb8800026640d8b40881edaeb4ac06-goods.jpeg",
  hats: "https://img.kwcdn.com/product/fancy/bf195fa8-a957-4412-b590-5619fe5352b9.jpg",
  gifts: "https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg",
  accessories: "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg"
};

export const categoryDescriptions: Record<Category, string> = {
  jewelry: "Custom necklaces, bracelets and engraved keepsakes.",
  bags: "Personalized totes, pouches and daily bags.",
  clothing: "Custom apparel with names, initials and prints.",
  kids: "Personalized pieces and gifts for children.",
  hats: "Caps and hats with names, initials or embroidery.",
  gifts: "Giftable personalized items for special moments.",
  accessories: "Small custom details for everyday use."
};

type SeedProduct = {
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  temuReference: string;
  placement: string;
};

const seedProducts: SeedProduct[] = [
  { name: "Custom Name Tote Bag", category: "bags", description: "A personalized everyday tote bag with custom name placement.", price: 16.9, image: "https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg", temuReference: "https://share.temu.com/GmmXVsEZI8B", placement: "front center" },
  { name: "Personalized Mini Shoulder Bag", category: "bags", description: "A compact bag with subtle custom initials or name detail.", price: 18.9, image: "https://img.kwcdn.com/product/fancy/ae4dfcf4-393f-416d-9cf1-a1c3b232fe42.jpg", temuReference: "https://share.temu.com/BCbmL6qJhNB", placement: "front flap" },
  { name: "Custom Cosmetic Pouch", category: "bags", description: "A soft pouch for makeup or travel accessories with name customization.", price: 12.9, image: "https://img.kwcdn.com/product/fancy/5e4e9480-20a1-4450-9d4d-b2cda9fd812e.jpg", temuReference: "https://share.temu.com/kMJxTGiXENB", placement: "front center" },
  { name: "Personalized Chain Crossbody Bag", category: "bags", description: "A boutique-style crossbody bag with monogram customization.", price: 22.9, image: "https://img.kwcdn.com/product/fancy/63f750d5-6133-4a6b-9ee7-977df9bd9589.jpg", temuReference: "https://share.temu.com/UYrj3xGEtyB", placement: "front lower corner" },
  { name: "Custom Travel Organizer Bag", category: "bags", description: "A practical organizer bag made personal with initials or short text.", price: 15.9, image: "https://img.kwcdn.com/product/fancy/a51c5e2c-23d8-47ae-80ca-1270198b7ffb.jpg", temuReference: "https://share.temu.com/1rf0Bhd7voB", placement: "front pocket" },
  { name: "Personalized Everyday Handbag", category: "bags", description: "A soft handbag with a clean custom name or monogram detail.", price: 24.9, image: "https://img.kwcdn.com/product/fancy/154f54f7-07f6-4947-b4d8-86601220da48.jpg", temuReference: "https://share.temu.com/uUpbqwK6aZB", placement: "front panel" },

  { name: "Personalized Name Necklace", category: "jewelry", description: "A custom necklace designed for a name, word or meaningful initials.", price: 14.9, image: "https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg", temuReference: "https://share.temu.com/N1oG6OSQ43B", placement: "center pendant" },
  { name: "Custom Initial Bracelet", category: "jewelry", description: "A delicate bracelet with initials or short engraved text.", price: 12.9, image: "https://img.kwcdn.com/product/fancy/23472a28-32fb-4600-aa47-3c8b2478ba43.jpg", temuReference: "https://share.temu.com/MAkJdMM40UB", placement: "front charm" },
  { name: "Engraved Charm Necklace", category: "jewelry", description: "A refined charm necklace with personal engraving.", price: 15.5, image: "https://img.kwcdn.com/product/fancy/d0327194-4f1c-4718-a5fe-9990312508b3.jpg", temuReference: "https://share.temu.com/K1em3kZEMzB", placement: "small charm" },
  { name: "Custom Heart Pendant", category: "jewelry", description: "A heart pendant personalized with a name or initials.", price: 13.9, image: "https://img.kwcdn.com/product/fancy/2331f4f0-4271-4dde-992c-9650a4d36fb0.jpg", temuReference: "https://share.temu.com/EHjUdemuuBB", placement: "heart pendant" },
  { name: "Personalized Statement Necklace", category: "jewelry", description: "A custom jewelry piece for gifting and everyday wear.", price: 17.9, image: "https://img.kwcdn.com/product/fancy/46107965-3b07-4a2d-b4c5-93c5406d2d7b.jpg", temuReference: "https://share.temu.com/zgZK4AeTEJB", placement: "center pendant" },

  { name: "Personalized Gift Box", category: "gifts", description: "A custom gift box made personal with name, text or initials.", price: 19.9, image: "https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg", temuReference: "https://share.temu.com/e8YnbXlwvoB", placement: "gift label" },
  { name: "Custom Keepsake Gift", category: "gifts", description: "A thoughtful personalized keepsake for birthdays or special days.", price: 16.5, image: "https://img.kwcdn.com/product/fancy/a313f09b-3810-42df-929b-e3c031927725.jpg", temuReference: "https://share.temu.com/2ZaaoDOfJjB", placement: "front plate" },
  { name: "Personalized Decor Gift", category: "gifts", description: "A decorative custom gift with name or message placement.", price: 21.9, image: "https://img.kwcdn.com/product/fancy/c9ccce5b-0f1b-4b37-89d7-67af8ec4b987.jpg", temuReference: "https://share.temu.com/QkSktDYnItB", placement: "front display" },
  { name: "Custom Memory Gift", category: "gifts", description: "A personal gift item for emotional, giftable moments.", price: 18.9, image: "https://img.kwcdn.com/product/fancy/45399aff-9fb5-46fc-a16c-581df9e9270c.jpg", temuReference: "https://share.temu.com/pLUkuXX9bDB", placement: "front center" },

  { name: "Kids Custom Name Set", category: "kids", description: "A personalized item for children with name or initials.", price: 13.9, image: "https://img.kwcdn.com/product/open/a4eb8800026640d8b40881edaeb4ac06-goods.jpeg", temuReference: "https://share.temu.com/ZgdxwCAi3RB", placement: "front center" },
  { name: "Personalized Kids Outfit", category: "kids", description: "A custom children's outfit with size options and text personalization.", price: 15.9, image: "https://img.kwcdn.com/product/open/ddfbf2ae878e4095b76f5f1a801e210d-goods.jpeg", temuReference: "https://share.temu.com/9kddyzUJcNB", placement: "front chest" },
  { name: "Kids Custom Gift Piece", category: "kids", description: "A child-friendly custom item for gifts and everyday use.", price: 11.9, image: "https://img.kwcdn.com/product/fancy/market/ee2cfaa9-605f-40e6-9713-a25299daa7ee.jpg", temuReference: "https://share.temu.com/dyyNw5rqyrB", placement: "front label" },
  { name: "Personalized Kids Accessory", category: "kids", description: "A custom accessory for children with name or initials.", price: 9.9, image: "https://img.kwcdn.com/product/fancy/debd2e53-18d8-429d-9f1a-953c731b99d6.jpg", temuReference: "https://share.temu.com/BURJAEymuCB", placement: "front detail" },
  { name: "Kids Name Detail Item", category: "kids", description: "A simple personalized product for children's gifts.", price: 10.9, image: "https://img.kwcdn.com/product/fancy/46aee654-4471-4b2a-a00b-a40304feb91a.jpg", temuReference: "https://share.temu.com/4vCBi4ao73B", placement: "front center" },

  { name: "Custom Embroidered Cap", category: "hats", description: "A cap personalized with initials, name or short text.", price: 10.9, image: "https://img.kwcdn.com/product/fancy/bf195fa8-a957-4412-b590-5619fe5352b9.jpg", temuReference: "https://share.temu.com/VIahFmf7LRB", placement: "front panel" },
  { name: "Personalized Baseball Hat", category: "hats", description: "A clean baseball hat with embroidered custom text.", price: 11.9, image: "https://img.kwcdn.com/product/fancy/210bdd21-24e5-488f-b843-9fbb12d6a84e.jpg", temuReference: "https://share.temu.com/mYsk798dfaB", placement: "front panel" },
  { name: "Custom Initial Hat", category: "hats", description: "A minimal hat for initials, names or tiny phrases.", price: 9.9, image: "https://img.kwcdn.com/product/fancy/ca34b0a0-c05a-40e4-b0ea-81db0143a9af.jpg", temuReference: "https://share.temu.com/25SshMB7UiB", placement: "front panel" },
  { name: "Personalized Bucket Hat", category: "hats", description: "A custom bucket hat with subtle name detail.", price: 12.9, image: "https://img.kwcdn.com/product/fancy/8929ab3c-e26c-40b5-a150-7cbddb87ea63.jpg", temuReference: "https://share.temu.com/gN6iIjST7LB", placement: "front brim" },
  { name: "Custom Casual Hat", category: "hats", description: "A casual hat made personal with custom embroidery.", price: 11.5, image: "https://img.kwcdn.com/product/fancy/dc8a4b4d-cd1d-463f-afbd-ae6944b36908.jpg", temuReference: "https://share.temu.com/nH5W3I3l7ZB", placement: "front panel" },

  { name: "Custom Printed T-Shirt", category: "clothing", description: "A custom tee with text, name or personal print placement.", price: 13.9, image: "https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg", temuReference: "https://share.temu.com/4s5M2i4BvtB", placement: "front chest" },
  { name: "Personalized Casual Top", category: "clothing", description: "A soft clothing piece with size options and custom text.", price: 15.9, image: "https://img.kwcdn.com/product/open/f9dbf6a915c04fdba20c660655442a0b-goods.jpeg", temuReference: "https://share.temu.com/MEvGOy4zVVB", placement: "front center" },
  { name: "Custom Name Shirt", category: "clothing", description: "A wearable custom shirt for names, initials or phrases.", price: 14.9, image: "https://img.kwcdn.com/product/fancy/ce6f8a31-2992-4c58-b0fc-99047e337b49.jpg", temuReference: "https://share.temu.com/ncUESMoMMgB", placement: "front chest" },
  { name: "Personalized Apparel Piece", category: "clothing", description: "A custom apparel item with print placement and size selection.", price: 16.9, image: "https://img.kwcdn.com/product/open/2ee983416fcb4067a814673c8fbaf873-goods.jpeg", temuReference: "https://share.temu.com/NSICaIaIXYB", placement: "front center" }
];

export const categoryRules: Record<Category, { label: string; needsSizes: boolean; defaultVariants: string[] }> = {
  jewelry: { label: categoryLabels.jewelry, needsSizes: false, defaultVariants: ["Standard", "Premium finish"] },
  bags: { label: categoryLabels.bags, needsSizes: false, defaultVariants: ["Classic", "Large"] },
  clothing: { label: categoryLabels.clothing, needsSizes: true, defaultVariants: ["S", "M", "L"] },
  kids: { label: categoryLabels.kids, needsSizes: true, defaultVariants: ["2-3Y", "4-5Y", "6-7Y"] },
  hats: { label: categoryLabels.hats, needsSizes: false, defaultVariants: ["Standard", "Adjustable"] },
  gifts: { label: categoryLabels.gifts, needsSizes: false, defaultVariants: ["Standard", "Gift wrapped"] },
  accessories: { label: categoryLabels.accessories, needsSizes: false, defaultVariants: ["Standard", "Premium finish"] }
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function variantsFor(item: SeedProduct) {
  const names = categoryRules[item.category].defaultVariants;
  return names.map((name, index) => ({
    id: `${slugify(item.name)}_${index + 1}`,
    name,
    price: Number((item.price + index * (item.category === "clothing" || item.category === "kids" ? 2.5 : 3.5)).toFixed(2)),
    isDefault: index === 0,
    stock: 30 - index * 3
  }));
}

export const products: Product[] = seedProducts.map((item, index) => {
  const slug = slugify(item.name);
  return {
    id: `temu_${index + 1}`,
    slug,
    name: item.name,
    category: item.category,
    description: item.description,
    image: item.image,
    gallery: [item.image],
    basePrice: item.price,
    currency: "EUR",
    status: "active",
    isBestSeller: index < 8 || ["kids", "bags"].includes(item.category),
    rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
    soldCount: 80 + index * 46,
    tags: ["Free personalization", "Custom preview", "Temu supplier reference"],
    isPersonalizable: true,
    personalization: {
      label: "Name, text, or initials",
      maxLength: item.category === "jewelry" ? 12 : 18,
      placement: item.placement,
      fonts: ["Serif", "Script", "Modern", "Minimal"],
      colors: ["Champagne Gold", "Soft Black", "Ivory", "Rose Nude"]
    },
    variants: variantsFor(item),
    deliveryDays: "10-14 business days",
    temuReference: item.temuReference
  };
});

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
