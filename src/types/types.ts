import type { TService, TVariant, TStylist } from "@/app/booking/constants";
import type { Variant, Service } from "@/app/booking/constants";

// Re-export for convenience in this folder
export type { TService, TVariant, TStylist };
export type SelectedDetail = { service: Service; variant: Variant };

export type SelectedItem = { serviceId: string; variantId: string };
export type Step = 1 | 2 | 3 | 4;

export type ProfessionalMode = "any" | "stylist" | "perService";
export type SelectedProfessional =
  | { mode: "any" }
  | { mode: "stylist"; stylistId: string }
  | { mode: "perService"; map: Record<string, string> }; // serviceId -> stylistId

// Shared Motion variants
export const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } as const;
export const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } } as const;