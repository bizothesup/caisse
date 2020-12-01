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
import htmlToPdfmake from "html-to-pdfmake"

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { Users } from 'src/app/models/users';
import { Structures } from 'src/app/models/structures';

// import * as jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-journal-caisse',
  templateUrl: './journal-caisse.component.html',
  styleUrls: ['./journal-caisse.component.scss'],
})
export class JournalCaisseComponent implements OnInit {
  structures: Structures;
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
  totDepense: number;
  recettes = [];

  letterObj = {
    to: 'ssss',
    from: 'qzazaz',
    text: 'az'
  }

  pdfObj = null;
  fileToAttach = null;

  constructor(private router: Router, public global: GlobalService,
    private plt: Platform,
    private printer: Printer, private emailComposer: EmailComposer,
    private file: File, private fileOpener: FileOpener,
    private db: DatabaseService, ) { }

  ngOnInit() {
    this.structures = new Structures();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structures = res;
        });
      }
    });
    var t = new Date();
    var first = t.getDate() - t.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    this.totRecette = 0;
    this.totDepense = 0;
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
        this.db.loadJournal(date, seg);
        this.db.getJournal().subscribe(data => {
          this.recettes = data;
          this.totRecette = this.recettes.map(t => t.recette).reduce((acc, value) => acc + value, 0);
          this.totDepense = this.recettes.map(t => t.depense).reduce((acc, value) => acc + value, 0);
        });
      }
    });
  }

  print() {

    let options: PrintOptions = {
      name: 'MyDocument',
      // printerId: 'My Printer XYZ',
      duplex: true,
      // landscape: true,
      // grayscale: true
    };
    let content = this.getRapportBody();

    this.printer.print(content, options).then(this.onSuccessPrint,
      this.onErrorPrint);
  }
  onSuccessPrint() {
    //alert("printing done successfully !");
  }

  onErrorPrint() {
    alert("Error while printing !");
  }

  createPdf() {
    var html = htmlToPdfmake('<p>This sentence has <strong>a highlighted word</strong>, but not only. </p>  ');

    var docDefinition = {
      content: [
        html
      ],
      styles: {
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  getRapportBody() {
    let content = "";
    content += '<table style="margin: 20px 0px 20px 0px; width: 100%;">';
    content += '<tr>';
    content += '<th width="100%" style="text-align: center;">';
    content += 'JOURNAL DE CAISSE';
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
    return content;
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      let fpath = this.file.externalRootDirectory + '/Download/'
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(fpath, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileToAttach = fpath + 'myletter.pdf';
          this.global.showAlert(fpath + 'myletter.pdf', 'sss', '');
          //this.send();
          //this.fileOpener.open(fpath + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }


  send() {
    if (this.structures.email) {
      let content = this.getRapportBody();
      //this.global.showAlert(content, 'html', '')
      //this.fileToAttach = 'app://databases/smartcaissev0.db'
      let email = {
        to: this.structures.email,
        // cc: 'max@mustermann.de',
        attachments: [
          this.fileToAttach
        ],
        subject: 'JOURNAL DE CAISSE',
        body: content,
        isHtml: true
      };
      this.emailComposer.open(email);
    }

  }

  backTolist() {
    this.router.navigate(['/rapports']);

  }

}
