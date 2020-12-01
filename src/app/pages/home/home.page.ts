import { Component, OnInit, NgZone } from '@angular/core';
import { MenuController, ToastController, PopoverController } from '../../../../node_modules/@ionic/angular';
import { GlobalService } from '../../provider/global.service';
import { RecetteService } from 'src/app/provider/recette.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { format } from "date-fns";
import { RecListComponent } from '../recettes/rec-list/rec-list.component';
import { DepListComponent } from '../depenses/dep-list/dep-list.component';
import { SearchPage } from '../search/search.page';

// import { SearchPage } from '../search/search.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mySegment: String = 'recettes';
  minDate: Date;
  curDate: string;
  maxDate: Date;
  totRecette: number;
  totEncaisse: number;
  totDepense: number;
  totPaye: number;

  constructor(public global: GlobalService,
    private db: DatabaseService,
    public popoverController: PopoverController,
    public menuCtrl: MenuController) {
  }

  ngOnInit() {

    this.totRecette = 0;
    this.totEncaisse = 0;
    this.totDepense = 0;
    if (this.global.lang === 'fr') {
      this.menuCtrl.enable(false, 'rightMenu');
      this.menuCtrl.enable(true, 'leftMenu');
    } else if (this.global.lang === 'en') {
      this.menuCtrl.enable(false, 'rightMenu');
      this.menuCtrl.enable(true, 'leftMenu');
    } else {
      this.menuCtrl.enable(true, 'rightMenu');
      this.menuCtrl.enable(false, 'leftMenu');
    }
    this.curDate = new Date().toISOString();
    this.loadTotaux(this.curDate);

  }
  ionViewWillEnter() {
    this.loadTotaux(this.curDate);
    this.change_dateValue();
  }
  back() {
    let d = new Date(this.curDate);
    d.setDate(d.getDate() - 1);
    this.curDate = d.toISOString();
    this.change_dateValue()
  }
  forward() {
    let d = new Date(this.curDate);
    d.setDate(d.getDate() + 1);
    this.curDate = d.toISOString();
    this.change_dateValue()
  }
  change_dateValue() {
    RecListComponent.selecDate.next(this.curDate)
    DepListComponent.selecDate.next(this.curDate)
    this.loadTotaux(this.curDate);
  }
  loadTotaux(date) {
    date = format(new Date(date), "yyyy-MM-dd");
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getTotalRecettes(date).then(data => {
          this.totRecette = data;
        });
        this.db.getTotalEncaisse(date).then(data => {
          this.totEncaisse = data;
        });
        this.db.getTotalDepenses(date).then(data => {
          this.totDepense = data;
        });
        this.db.getTotalPaye(date).then(data => {
          this.totPaye = data;
        });
      }
    });
  }

  async search(ev: any) {
    let items = [];
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadRecettes(this.curDate);
        this.db.getRecettes().subscribe(data => {
          items = data;
        });
      }
    });

    const popover = await this.popoverController.create({
      component: SearchPage,
      componentProps: { data: items, popoverController: this.popoverController },
      event: ev,
      translucent: true,
      cssClass: 'search_pop',
    });
    return await popover.present();
  }

}
