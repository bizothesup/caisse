import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { format } from "date-fns";
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-recettes-depenses',
  templateUrl: './recettes-depenses.component.html',
  styleUrls: ['./recettes-depenses.component.scss'],
})
export class RecettesDepensesComponent implements OnInit {
  jour: string;
  mois: string;
  semaine: string;
  annee: string;
  curDate: string;
  endMonthDate: string;
  firstdayOfWeek: string;
  lastdayOfWeek: string;
  rj: number;
  dj: number;
  tj: number;

  rs: number;
  ds: number;
  ts: number;

  rm: number;
  dm: number;
  tm: number;

  ra: number;
  da: number;
  ta: number;

  constructor(private router: Router, public global: GlobalService,
    private plt: Platform,
    private printer: Printer, private emailComposer: EmailComposer,
    private file: File, private fileOpener: FileOpener,
    private db: DatabaseService, ) { }

  ngOnInit() {
    this.rj = 0;
    this.dj = 0;
    this.tj = 0;
    this.rs = 0;
    this.ds = 0;
    this.ts = 0;
    this.rm = 0;
    this.dm = 0;
    this.tm = 0;
    this.ra = 0;
    this.da = 0;
    this.ta = 0;
    var t = new Date();
    var first = t.getDate() - t.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6


    this.curDate = new Date().toISOString();
    this.endMonthDate = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).toISOString();

    this.firstdayOfWeek = new Date(t.setDate(first)).toISOString();
    this.lastdayOfWeek = new Date(t.setDate(last)).toISOString();

    this.jour = format(new Date(this.curDate), "dd/MM/yyyy");
    this.mois = format(new Date(this.curDate), "MMMM-yyyy");
    this.semaine = 'Du ' + format(new Date(this.firstdayOfWeek), "dd/MM/yyyy") + " au " + format(new Date(this.lastdayOfWeek), "dd/MM/yyyy");
    this.annee = format(new Date(this.curDate), "yyyy");

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.db.getTotalRecetteDepenses('R', 'jour', format(new Date(this.curDate), "yyyy-MM-dd")).then(res => {
          this.rj = res;
        });
        this.db.getTotalRecetteDepenses('D', 'jour', format(new Date(this.curDate), "yyyy-MM-dd")).then(res => {
          this.dj = res;
          this.tj = this.rj - this.dj;
        });

        this.db.getTotalRecetteDepenses('R', 'semaine', "'" + format(new Date(this.firstdayOfWeek), "yyyy-MM-dd") + "' AND '" + format(new Date(this.lastdayOfWeek), "yyyy-MM-dd") + "'").then(res => {
          this.rs = res;
        });
        this.db.getTotalRecetteDepenses('D', 'semaine', "'" + format(new Date(this.firstdayOfWeek), "yyyy-MM-dd") + "' AND '" + format(new Date(this.lastdayOfWeek), "yyyy-MM-dd") + "'").then(res => {
          this.ds = res;
          this.ts = this.rs - this.ds;
        });

        this.db.getTotalRecetteDepenses('R', 'mois', "'" + format(new Date(this.curDate), "yyyy-MM-") + "01' AND '" + format(new Date(this.curDate), "yyyy-MM-") + format(new Date(this.endMonthDate), "dd") + "'").then(res => {
          this.rm = res;
        });
        this.db.getTotalRecetteDepenses('D', 'mois', "'" + format(new Date(this.curDate), "yyyy-MM-") + "01' AND '" + format(new Date(this.curDate), "yyyy-MM-") + format(new Date(this.endMonthDate), "dd") + "'").then(res => {
          this.dm = res;
          this.tm = this.rm - this.dm;
        });

        this.db.getTotalRecetteDepenses('R', 'annee', "'" + format(new Date(this.curDate), "yyyy") + "-01-01' AND '" + format(new Date(this.curDate), "yyyy") + "-12-31'").then(res => {
          this.ra = res;
        });
        this.db.getTotalRecetteDepenses('D', 'annee', "'" + format(new Date(this.curDate), "yyyy") + "-01-01' AND '" + format(new Date(this.curDate), "yyyy") + "-12-31'").then(res => {
          this.da = res;
          this.ta = this.ra - this.da;
        });

      }
    });

  }
  print() {

    let options: PrintOptions = {
      name: 'RecetteVsDepenses',
      duplex: true,
    };
    let content = "";
    content += '<table style="margin: 20px 0px 20px 0px; width: 100%;">';
    content += '<tr>';
    content += '<th width="100%" style="text-align: center;">';
    content += 'RECETTES VS DEPENSES';
    content += '</th>';
    content += '</tr>';
    content += '</table>';
    const div = document.getElementById("printable-area");
    content += div.innerHTML;
    this.printer.print(content, options).then(this.onSuccessPrint,
      this.onErrorPrint);
  }
  onSuccessPrint() {
    //alert("printing done successfully !");
  }

  onErrorPrint() {
    alert("Error while printing !");
  }
  backTolist() {
    this.router.navigate(['/rapports']);

  }

}
