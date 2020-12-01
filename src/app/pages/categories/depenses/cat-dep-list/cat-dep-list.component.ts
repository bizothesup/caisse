import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { DatabaseService } from 'src/app/provider/database.service';
import { GlobalService } from 'src/app/provider/global.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-cat-dep-list',
  templateUrl: './cat-dep-list.component.html',
  styleUrls: ['./cat-dep-list.component.scss'],
})
export class CatDepListComponent implements OnInit {
  items: Categories[] = [];

  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService,
    private tc: ToastController) { }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }
  loadItems() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadCategories('D');
        this.db.getCategories('D').subscribe(cats => {
          this.items = cats;
        });
      }
    });
  }
  showItem(item: Categories) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        categorie: item
      }
    };
    this.router.navigate(['/categories/editCatDep'], navigationExtras);

  }

  deleteItem(item: Categories) {
    item.etat = -1;
    this.db.updateCategorie(item).then(async (res) => {
      this.loadItems();
      this.showToast('Catégorie supprimée avec succèss');
    });
  }
  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }

}
