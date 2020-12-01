import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from 'src/app/provider/global.service';
import { RecetteService } from 'src/app/provider/recette.service';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { ToastController } from '@ionic/angular';
import { Recettes } from 'src/app/models/recettes';
import { format } from "date-fns";
import { Subject } from 'rxjs';
import { Structures } from 'src/app/models/structures';

@Component({
  selector: 'app-rec-list',
  templateUrl: './rec-list.component.html',
  styleUrls: ['./rec-list.component.scss'],
})
export class RecListComponent implements OnInit {
  public static selecDate: Subject<string> = new Subject<string>();
  structure: Structures;
  recettes = [];
  @Input() curDate: string;
  loaded: boolean;
  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService,
    private tc: ToastController) {
    RecListComponent.selecDate.subscribe(res => {
      this.curDate = res;
      this.structure = new Structures();
      this.initComponent();
    });
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
        });
      }
    });
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
        this.db.loadRecettes(date);
        this.db.getRecettes().subscribe(data => {
          this.recettes = data;
        });
      }
    });
  }
  showItem(item: Recettes) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        recette: item
      }
    };
    this.router.navigate(['/home/editRec'], navigationExtras);

  }
  deleteItem(item: Recettes) {
    item.etat = -1;
    this.db.updateRecette(item).then(async (res) => {
      this.loadItems(this.curDate);
      this.global.showToast('Recette supprimée avec succèss');
    });
  }
}
