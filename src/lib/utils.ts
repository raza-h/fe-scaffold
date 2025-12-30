import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizePath(path: string) {
  return path === '/' ? '/' : path.replace(/\/+$/, '');
}