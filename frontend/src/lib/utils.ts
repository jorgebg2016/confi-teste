import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina e remove classes conflitantes do tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
