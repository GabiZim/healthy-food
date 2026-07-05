export type FoodStatus = 'genutzt' | 'vorhanden' | 'zukaufen' | 'spaeter';

export type Food = {
  id: string;
  name: string;
  group: string;
  status: FoodStatus;
  usedAt: string | null;
  createdAt: string;
};

export type FoodGroup = {
  group: string;
  items: string[];
};
