import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { DatabaseService } from '../provider/database.service';
import { Categories } from '../models/categories';


@Injectable({
  providedIn: 'root'
})
export class CatDepFormResolver implements Resolve<any> {
  depense: BehaviorSubject<any>;
  categories: Categories[] = [];
  constructor(private db: DatabaseService) {
    this.depense = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    const values = [this.getCategories()];

    return new Promise((resolve, reject) => {
      Promise.all(values).then(() => {
        resolve();
      },
        reject
      );
    });
  }


  private getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.db.findCategories('D').subscribe(data => {
            this.categories = data;
            resolve(data);
          }, reject);
        }
      });
    });
  }


}
