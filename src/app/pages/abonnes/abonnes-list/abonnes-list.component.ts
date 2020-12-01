import { Component, OnInit } from '@angular/core';
import { Abonnes } from 'src/app/models/abonnes';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';

@Component({
  selector: 'app-abonnes-list',
  templateUrl: './abonnes-list.component.html',
  styleUrls: ['./abonnes-list.component.scss'],
})
export class AbonnesListComponent implements OnInit {

  items: Abonnes[] = [];

  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService) { }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }
  loadItems() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadAbonne();
        this.db.getAbonnes().subscribe(cats => {
          this.items = cats;
        });
      }
    });
  }
  showItem(item: Abonnes) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        abonne: item
      }
    };
    this.router.navigate(['/abonnes/editAbn'], navigationExtras);

  }

  deleteItem(item: Abonnes) {
    item.etat = -1;
    this.db.updateAbonne(item).then(async (res) => {
      this.loadItems();
      this.global.showToast('Abonné supprimé avec succèss');
    });
  }

}
