import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TRIAL_KEY = "summerease_trial_used";

export const checkTrialUsed = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TRIAL_KEY) === "true";
};

export const markTrialUsed = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRIAL_KEY, "true");
};