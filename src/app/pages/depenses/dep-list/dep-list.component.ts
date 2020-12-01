import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { ToastController } from '@ionic/angular';
import { Depenses } from 'src/app/models/depenses';
import { Subject } from 'rxjs';
import { format } from "date-fns";

@Component({
  selector: 'app-dep-list',
  templateUrl: './dep-list.component.html',
  styleUrls: ['./dep-list.component.scss'],
})
export class DepListComponent implements OnInit {
  public static selecDate: Subject<string> = new Subject<string>();
  depenses = [];
  @Input() curDate: string;
  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService,
    private tc: ToastController) {
    DepListComponent.selecDate.subscribe(res => {
      this.curDate = res;
      this.initComponent();
    });
  }

  ngOnInit() {
    this.initComponent();
  }
  initComponent() {
    this.curDate = format(new Date(this.curDate), "yyyy-MM-dd");
    this.loadItems(this.curDate);
  }

  ionViewWillEnter() {
    this.loadItems(this.curDate);
  }
  loadItems(date) {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadDepenses(date);
        this.db.getDepenses().subscribe(data => {
          this.depenses = data;
        });
      }
    });
  }
  showItem(item: Depenses) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        depense: item
      }
    };
    this.router.navigate(['/home/editDep'], navigationExtras);

  }
  deleteItem(item: Depenses) {
    item.etat = -1;
    this.db.updateDepense(item).then(async (res) => {
      this.loadItems(this.curDate);
      this.global.showToast('Dépense supprimée avec succèss');
    });
  }

}
