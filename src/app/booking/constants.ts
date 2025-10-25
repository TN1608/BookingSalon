// Strong typing for booking constants
export interface Category { id: string; name: string }
export interface Variant { id: string; name: string; duration: string; price: number }
export interface Service {
  id: string
  name: string
  duration: string
  basePrice: number
  desc?: string
  variants: Variant[]
  categoryId?: string
}
export interface Stylist {
  id: string
  name: string
  specialties: Service["id"][]
  level: "junior" | "mid" | "senior"
  hourlyRate: number
}
export interface Package {
  id: string
  name: string
  duration: string
  price: number
  includes: string[]
}

const CATEGORIES: Category[] = [
  { id: "haircuts", name: "Haircuts" },
  { id: "coloring", name: "Coloring" },
  { id: "styling", name: "Styling" },
  { id: "children", name: "Children" },
]

const SERVICES: Service[] = [
  {
    id: "women-haircut",
    name: "Women's Haircut",
    duration: "30 mins - 1 hr",
    basePrice: 150,
    desc: "Include hair wash. Extra charge for extra long & thick hair.",
    variants: [
      { id: "short-hair", name: "Short", duration: "30 mins", price: 150 },
      { id: "medium-hair", name: "Medium", duration: "45 mins", price: 200 },
      { id: "long-hair", name: "Long", duration: "1 hr", price: 250 },
    ],
    categoryId: "haircuts",
  },
  {
    id: "mens-haircut",
    name: "Men's Haircut",
    duration: "20 - 40 mins",
    basePrice: 80,
    desc: "Classic and modern men's cuts. Includes quick styling.",
    variants: [
      { id: "basic-mens", name: "Basic", duration: "20 mins", price: 80 },
      { id: "styled-mens", name: "Styled", duration: "40 mins", price: 120 },
    ],
    categoryId: "haircuts",
  },
  {
    id: "kids-haircut",
    name: "Kids' Haircut",
    duration: "20 - 30 mins",
    basePrice: 60,
    desc: "For children under 12. Parent supervision required.",
    variants: [
      { id: "kids-short", name: "Short", duration: "20 mins", price: 60 },
      { id: "kids-long", name: "Long", duration: "30 mins", price: 80 },
    ],
    categoryId: "children",
  },
  {
    id: "full-color",
    name: "Full Color",
    duration: "1.5 - 3 hrs",
    basePrice: 300,
    desc: "Full color services including consultation and conditioning treatment.",
    variants: [
      { id: "partial-color", name: "Partial", duration: "1.5 hrs", price: 200 },
      { id: "full-color-variant", name: "Full", duration: "3 hrs", price: 350 },
    ],
    categoryId: "coloring",
  },
  {
    id: "blowout",
    name: "Blowout & Styling",
    duration: "45 mins - 1 hr",
    basePrice: 100,
    desc: "Wash, blow-dry and style for special occasions or everyday look.",
    variants: [
      { id: "quick-blowout", name: "Quick", duration: "45 mins", price: 100 },
      { id: "deluxe-blowout", name: "Deluxe", duration: "1 hr", price: 140 },
    ],
    categoryId: "styling",
  },
]

const STYLISTS: Stylist[] = [
  { id: "stylist-anna", name: "Anna", specialties: ["women-haircut", "full-color"], level: "senior", hourlyRate: 70 },
  { id: "stylist-mike", name: "Mike", specialties: ["mens-haircut", "styling"], level: "mid", hourlyRate: 50 },
  { id: "stylist-lee", name: "Lee", specialties: ["kids-haircut", "blowout"], level: "junior", hourlyRate: 40 },
]

const PACKAGES: Package[] = [
  {
    id: "bridal-package",
    name: "Bridal Package",
    duration: "3 hrs",
    price: 500,
    includes: ["trial", "wedding-day", "touch-up"],
  },
  {
    id: "pamper-package",
    name: "Pamper Package",
    duration: "2 hrs",
    price: 220,
    includes: ["blowout", "deep-conditioning", "mini-style"],
  },
]

export type { Category as TCategory, Variant as TVariant, Service as TService, Stylist as TStylist, Package as TPackage }
export { CATEGORIES, SERVICES, STYLISTS, PACKAGES }