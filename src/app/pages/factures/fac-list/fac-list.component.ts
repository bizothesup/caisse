import { Component, OnInit } from '@angular/core';
import { Factures } from 'src/app/models/factures';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { Router, NavigationExtras } from '@angular/router';
import { format } from "date-fns";

@Component({
  selector: 'app-fac-list',
  templateUrl: './fac-list.component.html',
  styleUrls: ['./fac-list.component.scss'],
})
export class FacListComponent implements OnInit {
  curDate: string;
  periode: string;
  items = [];
  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService) { }

  ngOnInit() {
    this.curDate = new Date().toISOString();
    this.load();
  }
  back() {
    let d = new Date(this.curDate);
    d.setDate(d.getDate() - 30);
    this.curDate = d.toISOString();
    this.load()
  }
  forward() {
    let d = new Date(this.curDate);
    d.setDate(d.getDate() + 30);
    this.curDate = d.toISOString();
    this.load()
  }

  load() {
    var t = new Date(this.curDate);
    this.curDate = format(new Date(this.curDate), "yyyy-MM-dd");
    this.periode = format(new Date(this.curDate), "MMMM-yyyy");
    let endMonthDate = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).toISOString();
    let date = "'" + format(new Date(this.curDate), "yyyy-MM-") + "01' AND '" + format(new Date(this.curDate), "yyyy-MM-") + format(new Date(endMonthDate), "dd") + "'";
    this.loadItems(date);
  }

  loadItems(date) {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadFactures(date);
        this.db.getFactures().subscribe(data => {
          this.items = data;
        });
      }
    });
  }
  showItem(item: Factures) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        item: item
      }
    };
    this.router.navigate(['/factures/viewFac'], navigationExtras);

  }




}
