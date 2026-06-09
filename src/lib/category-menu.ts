import { FiGift, FiHeart, FiHome, FiShoppingBag, FiTag, FiUser } from "react-icons/fi";

export const categoryMenu = [
  {
    slug: "personalized-jewelry",
    label: "Personalized Jewelry",
    icon: FiHeart,
    children: [
      ["name-necklaces", "Name Necklaces"],
      ["name-bracelets", "Name Bracelets"],
      ["rings", "Rings"],
      ["birthstone-jewelry", "Birthstone Jewelry"],
      ["initial-jewelry", "Initial Jewelry"],
      ["family-jewelry", "Family Jewelry"]
    ]
  },
  {
    slug: "personalized-fashion",
    label: "Personalized Fashion",
    icon: FiUser,
    children: [
      ["t-shirts", "T-Shirts"],
      ["hoodies", "Hoodies"],
      ["sweaters", "Sweaters"],
      ["caps-hats", "Caps & Hats"],
      ["tote-bags", "Tote Bags"],
      ["fashion-accessories", "Fashion Accessories"]
    ]
  },
  {
    slug: "personalized-home-living",
    label: "Personalized Home & Living",
    icon: FiHome,
    children: [
      ["mugs", "Mugs"],
      ["cushions", "Cushions"],
      ["blankets", "Blankets"],
      ["wall-art", "Wall Art"],
      ["key-holders", "Key Holders"],
      ["home-decor", "Home Decor"]
    ]
  },
  {
    slug: "personalized-accessories",
    label: "Personalized Accessories",
    icon: FiShoppingBag,
    children: [
      ["keychains", "Keychains"],
      ["wallets", "Wallets"],
      ["phone-cases", "Phone Cases"],
      ["cosmetic-bags", "Cosmetic Bags"],
      ["travel-accessories", "Travel Accessories"]
    ]
  },
  {
    slug: "personalized-pet-gifts",
    label: "Personalized Pet Gifts",
    icon: FiTag,
    children: [
      ["pet-tags", "Pet Tags"],
      ["pet-memorial-gifts", "Pet Memorial Gifts"],
      ["pet-accessories", "Pet Accessories"]
    ]
  },
  {
    slug: "special-occasions",
    label: "Special Occasions",
    icon: FiGift,
    children: [
      ["birthday-gifts", "Birthday Gifts"],
      ["mothers-day", "Mother's Day"],
      ["fathers-day", "Father's Day"],
      ["valentines-day", "Valentine's Day"],
      ["christmas-gifts", "Christmas Gifts"],
      ["wedding-gifts", "Wedding Gifts"],
      ["anniversary-gifts", "Anniversary Gifts"],
      ["baby-shower-gifts", "Baby Shower Gifts"]
    ]
  }
] as const;

export const allCategoryItems = categoryMenu.flatMap((group) => [
  { slug: group.slug, label: group.label, parentSlug: null },
  ...group.children.map(([slug, label]) => ({ slug, label, parentSlug: group.slug }))
]);

export function getCategoryLabel(slug: string) {
  return allCategoryItems.find((item) => item.slug === slug)?.label || slug;
}

