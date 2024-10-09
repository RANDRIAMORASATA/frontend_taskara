import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterItems<T>(items: T[], searchTerm: string, keys: (keyof T)[]): T[] {
    const term = searchTerm.toLowerCase();
    if (!term) {
      return items;
    }

    return items.filter(item => {
      return keys.some(key => {
        const value = item[key];
        return typeof value === 'string' && value.toLowerCase().includes(term);
      });
    });
  }
}
