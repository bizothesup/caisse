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
  selector: 'app-recettes-categorie',
  templateUrl: './recettes-categorie.component.html',
  styleUrls: ['./recettes-categorie.component.scss'],
})
export class RecettesCategorieComponent implements OnInit {
  mySegment: String = 'jour';
  periode: string;
  jour: string;
  mois: string;
  semaine: string;
  curDate: string;
  endMonthDate: string;
  firstdayOfWeek: string;
  lastdayOfWeek: string;
  totRecette: number;
  recettes = [];
  constructor(private router: Router, public global: GlobalService,
    private plt: Platform,
    private printer: Printer, private emailComposer: EmailComposer,
    private file: File, private fileOpener: FileOpener,
    private db: DatabaseService, ) { }

  ngOnInit() {
    var t = new Date();
    var first = t.getDate() - t.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    this.totRecette = 0;
    this.curDate = new Date().toISOString();
    this.endMonthDate = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).toISOString();

    this.firstdayOfWeek = new Date(t.setDate(first)).toISOString();
    this.lastdayOfWeek = new Date(t.setDate(last)).toISOString();

    this.jour = format(new Date(this.curDate), "dd/MM/yyyy");
    this.mois = format(new Date(this.curDate), "MMMM-yyyy");
    this.semaine = 'Du ' + format(new Date(this.firstdayOfWeek), "dd/MM/yyyy") + " au " + format(new Date(this.lastdayOfWeek), "dd/MM/yyyy");
    this.periode = this.jour;
    this.load('jour');

  }

  selectedButton(seg) {
    this.load(seg);
  }
  load(seg) {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        let date = '';
        if (seg === 'jour') {
          this.periode = this.jour;
          date = format(new Date(this.curDate), "yyyy-MM-dd");
        }
        if (seg === 'mois') {
          this.periode = this.mois;
          date = "'" + format(new Date(this.curDate), "yyyy-MM-") + "01' AND '" + format(new Date(this.curDate), "yyyy-MM-") + format(new Date(this.endMonthDate), "dd") + "'";
        }
        if (seg === 'semaine') {
          this.periode = this.semaine;
          date = "'" + format(new Date(this.firstdayOfWeek), "yyyy-MM-dd") + "' AND '" + format(new Date(this.lastdayOfWeek), "yyyy-MM-dd") + "'";
        }
        this.db.loadRecetteByCategorie(date, seg);
        this.db.getJournal().subscribe(data => {
          this.recettes = data;
          this.totRecette = this.recettes.map(t => t.recette).reduce((acc, value) => acc + value, 0);
        });
      }
    });
  }

  print() {

    let options: PrintOptions = {
      name: 'RecetteParCategorie',
      duplex: true,
    };
    let content = "";
    content += '<table style="margin: 20px 0px 20px 0px; width: 100%;">';
    content += '<tr>';
    content += '<th width="100%" style="text-align: center;">';
    content += 'RECETTES PAR CATEGORIE';
    content += '</th>';
    content += '</tr>';
    content += '<tr>';
    content += '<td width="100%" style="text-align: center;">';
    content += this.periode;
    content += '</td>';
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
