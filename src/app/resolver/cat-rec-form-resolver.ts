import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { DatabaseService } from '../provider/database.service';
import { CategoriesColors } from '../models/categories-colors';
import { ToastController } from '@ionic/angular';
import { Categories } from '../models/categories';



@Injectable({
  providedIn: 'root'
})
export class CatRecFormResolver implements Resolve<any> {
  categorie: Categories;
  constructor(private db: DatabaseService, private tc: ToastController) {
    // this.categorie = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot) {

    // const values = [this.getCategoriesColors()];

    const id = route.paramMap.get('id');
    if (id && Number.isInteger(+id)) {
      return this.find(id);

      return null;
    } else {
      return null;
    }
  }

  private find(id) {
    this.db.getCategorie(id).then(data => {
      this.categorie = data;
      return this.categorie;
    });
  }

  // private getCategoriesColors(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.categoriesColors.push(new CategoriesColors('red', 'Rouge'));
  //     this.categoriesColors.push(new CategoriesColors('red', 'Rouge'));
  //     this.categoriesColors.push(new CategoriesColors('red', 'Rouge'));
  //   });
  // }

  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }
}
