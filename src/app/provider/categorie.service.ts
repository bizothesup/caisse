import { Injectable } from '@angular/core';
import { Categories } from '../models/categories';
import { Storage } from '@ionic/storage';

const ITEM_KEY = 'categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private storage: Storage) { }

  addItem(item: Categories): Promise<any> {
    return this.storage.get(ITEM_KEY).then((items: Categories[]) => {
      if (items) {
        items.push(item);
        return this.storage.set(ITEM_KEY, items);
      } else {
        return this.storage.set(ITEM_KEY, item);
      }
    });

  }

  getItems(): Promise<Categories[]> {
    return this.storage.get(ITEM_KEY);
  }
  updateItem(item: Categories): Promise<any> {
    return this.storage.get(ITEM_KEY).then((items: Categories[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let newItems: Categories[] = [];
      for (let i of items) {
        if (i.id === item.id) {
          newItems.push(item);
        } else {
          newItems.push(i);
        }
      }
      return this.storage.set(ITEM_KEY, newItems);
    });
  }
  deleteItem(id: number): Promise<any> {
    return this.storage.get(ITEM_KEY).then((items: Categories[]) => {
      if (!items || items.length === 0) {
        return null;
      }
      let tokeep: Categories[] = [];
      for (let i of items) {
        if (i.id !== id) {
          tokeep.push(i);
        }
      }
      return this.storage.set(ITEM_KEY, tokeep);
    });
  }
}
