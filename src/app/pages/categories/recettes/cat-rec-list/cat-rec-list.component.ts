import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { DatabaseService } from 'src/app/provider/database.service';
import { GlobalService } from 'src/app/provider/global.service';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cat-rec-list',
  templateUrl: './cat-rec-list.component.html',
  styleUrls: ['./cat-rec-list.component.scss'],
})
export class CatRecListComponent implements OnInit {
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
        this.db.loadCategories('R');
        this.db.getCategories('R').subscribe(cats => {
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
    this.router.navigate(['/categories/editCatRec'], navigationExtras);

  }

  deleteItem(item: Categories) {
    item.etat = -1;
    this.db.updateCategorie(item).then(async (res) => {
      this.loadItems();
      this.global.showToast('Catégorie supprimée avec succèss');
    });
  }



}
