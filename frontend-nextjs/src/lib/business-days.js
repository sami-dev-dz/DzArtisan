import { addDays, isWeekend, getDay } from "date-fns";

/**
 * Algerian work week: Sunday (0) to Thursday (4).
 * Friday (5) and Saturday (6) are weekends.
 */
export const ALGERIAN_BUSINESS_DAYS = [0, 1, 2, 3, 4];

/**
 * Check if a date is an Algerian business day
 */
export const isAlgerianBusinessDay = (date) => {
  return ALGERIAN_BUSINESS_DAYS.includes(getDay(date));
};

/**
 * Add business days, skipping Friday and Saturday
 */
export const addAlgerianBusinessDays = (date, days) => {
  let result = new Date(date);
  let added = 0;
  while (added < days) {
    result = addDays(result, 1);
    if (isAlgerianBusinessDay(result)) {
      added++;
    }
  }
  return result;
};

/**
 * Get display text for support hours
 */
export const SUPPORT_HOURS_TEXT = {
  fr: "Support: Dim-Jeu, 08h00 - 18h00",
  ar: "الدعم: الأحد - الخميس ، 08:00 - 18:00",
  en: "Support: Sun-Thu, 08:00 - 18:00",
};
