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
import { Platform, LoadingController } from '@ionic/angular';
import { LoadingService } from 'src/app/provider/loading.service';

@Component({
  selector: 'app-situation-impayes',
  templateUrl: './situation-impayes.component.html',
  styleUrls: ['./situation-impayes.component.scss'],
})
export class SituationImpayesComponent implements OnInit {

  items = [];
  curDate: string;
  year: number
  total: number
  t: Date;

  constructor(private router: Router, public global: GlobalService,
    private plt: Platform,
    private printer: Printer, private emailComposer: EmailComposer,
    private file: File, private fileOpener: FileOpener,
    public loadingService: LoadingService,
    private db: DatabaseService, ) { }

  ngOnInit() {
    this.t = new Date();
    this.year = this.t.getFullYear();
    this.load()
  }
  back() {
    this.year = this.year - 1;
    this.load()
  }
  forward() {
    this.year = this.year + 1;
    this.load()
  }
  load() {
    this.items = [];
    this.db.loadSituationImpaye(this.year);
    this.db.getJournal().subscribe(data => {
      this.items = data;
      this.total = this.items.map(t => t.recette).reduce((acc, value) => acc + value, 0);
    });
  }

  print() {

    let options: PrintOptions = {
      name: 'SituationImpaye',
      duplex: true,
    };
    let content = "";
    content += '<table style="margin: 20px 0px 20px 0px; width: 100%;">';
    content += '<tr>';
    content += '<th width="100%" style="text-align: center;">';
    content += 'SITUATION DES IMPAYES';
    content += '</th>';
    content += '</tr>';
    content += '<tr>';
    content += '<td width="100%" style="text-align: center;">';
    content += this.year;
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
