export interface BubbleTeaItem {
  id?: number;
  name: string;
  temperature: 'hot' | 'cold' | 'warm';
  precio: number;
  active: boolean;
}
