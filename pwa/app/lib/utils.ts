import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Award, Match } from '~/api/v3';
import { AwardType, SORT_ORDER } from '~/lib/api/AwardType';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDateString(date: string) {
  return new Date(date);
}

export function removeNonNumeric(str: string): string {
  return str.replace(/\D/g, '');
}

export function sortMatchComparator(a: Match, b: Match) {
  const compLevelValues: Record<string, number> = {
    f: 5,
    sf: 4,
    qf: 3,
    ef: 2,
    qm: 1,
  };
  if (a.comp_level !== b.comp_level) {
    return (
      (compLevelValues[a.comp_level] ?? 0) -
      (compLevelValues[b.comp_level] ?? 0)
    );
  }

  return a.set_number - b.set_number || a.match_number - b.match_number;
}

export function sortAwardsComparator(a: Award, b: Award) {
  const orderA = SORT_ORDER[a.award_type as AwardType] ?? 1000;
  const orderB = SORT_ORDER[b.award_type as AwardType] ?? 1000;

  return orderA - orderB || a.award_type - b.award_type;
}

export function sortTeamKeysComparator(a: string, b: string) {
  return Number(removeNonNumeric(a)) - Number(removeNonNumeric(b));
}

export function timestampsAreOnDifferentDays(
  timestamp1: number,
  timestamp2: number,
): boolean {
  const date1 = new Date(timestamp1 * 1000);
  const date2 = new Date(timestamp2 * 1000);

  return (
    date1.getFullYear() !== date2.getFullYear() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getDate() !== date2.getDate()
  );
}

export function zip<T extends unknown[]>(...arrays: (T | undefined)[]): T[] {
  if (arrays.length === 0) {
    return [];
  }

  // Treat undefined arrays as empty arrays
  const validArrays = arrays.map((arr) => arr ?? []);

  const minLength = Math.min(...validArrays.map((arr) => arr.length));

  const zipped: T[] = [];
  for (let i = 0; i < minLength; i++) {
    const tuple = validArrays.map((arr) => arr[i]) as T;
    zipped.push(tuple);
  }

  return zipped;
}
