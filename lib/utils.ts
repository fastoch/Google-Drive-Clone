import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// whenever passing large payloads through server actions, we have to stringify and parse them
export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
}
