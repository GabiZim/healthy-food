import { FOOD_GROUPS } from './foods';
import type { Food, FoodStatus } from './types';

export const WEEK_TARGET = 3;
export const REDUCED_WEIGHT = 0.15;
export const REDUCED_WEIGHT_GROUPS = new Set(['Gewuerze', 'Kraeuter, Obst (getr.)']);

export const STATUS_LABELS: Record<FoodStatus, string> = {
  genutzt: 'Genutzt',
  vorhanden: 'Vorhanden',
  zukaufen: 'Zu kaufen',
  spaeter: 'Spaeter'
};

export const STATUS_ORDER: FoodStatus[] = ['genutzt', 'vorhanden', 'zukaufen', 'spaeter'];

export function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 12);
}

export function createFood(name: string, group: string): Food {
  return {
    id: makeId(),
    name: normalizeText(name),
    group,
    status: 'spaeter',
    usedAt: null,
    createdAt: new Date().toISOString()
  };
}

export function buildDefaultFoods(): Food[] {
  return Object.entries(FOOD_GROUPS).flatMap(([group, items]) => items.map((name) => createFood(name, group)));
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function getFoodWeight(group: string) {
  return REDUCED_WEIGHT_GROUPS.has(group) ? REDUCED_WEIGHT : 1;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value);
}

export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfWeek(weekStart: Date) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function getWeekLabel(weekStart: Date) {
  return `${formatDate(weekStart)} - ${formatDate(getEndOfWeek(weekStart))}`;
}

export function isInWeek(dateString: string | null, weekStart: Date) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  return date >= weekStart && date <= getEndOfWeek(weekStart);
}

export function getWeightedSum(foods: Food[], weekStart = getStartOfWeek()) {
  return foods.reduce((sum, food) => {
    if (food.status !== 'genutzt' || !isInWeek(food.usedAt, weekStart)) return sum;
    return sum + getFoodWeight(food.group);
  }, 0);
}

export function sanitizeFoods(value: unknown): Food[] {
  if (!Array.isArray(value) || value.length === 0) return buildDefaultFoods();

  return value.map((item, index) => {
    const raw = item as Partial<Food>;
    const status: FoodStatus = raw.status && STATUS_ORDER.includes(raw.status) ? raw.status : 'spaeter';
    return {
      id: typeof raw.id === 'string' && raw.id ? raw.id : `food-${index}-${makeId()}`,
      name: typeof raw.name === 'string' && raw.name ? raw.name : `Lebensmittel ${index + 1}`,
      group: typeof raw.group === 'string' && raw.group ? raw.group : 'Eigene',
      status,
      usedAt: typeof raw.usedAt === 'string' ? raw.usedAt : null,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString()
    };
  });
}

export function getWeekHistory(foods: Food[], weeks = 6) {
  const current = getStartOfWeek();
  return Array.from({ length: weeks }, (_, index) => {
    const start = new Date(current);
    start.setDate(current.getDate() - index * 7);
    const sum = getWeightedSum(foods, start);
    return {
      key: start.toISOString(),
      label: getWeekLabel(start),
      sum,
      isCurrent: index === 0
    };
  });
}

export function runChecks() {
  console.assert(getFoodWeight('Gewuerze') === 0.15, 'Gewuerze should count 0.15');
  console.assert(getFoodWeight('Obst') === 1, 'Obst should count 1');
  console.assert(buildDefaultFoods().length > 20, 'Default foods should be available');
  console.assert(normalizeText('  Apfel   rot  ') === 'Apfel rot', 'normalizeText should normalize spaces');
}
