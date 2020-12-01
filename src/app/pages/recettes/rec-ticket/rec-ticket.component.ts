import { Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/provider/global.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { Recettes } from 'src/app/models/recettes';
import { DatabaseService } from 'src/app/provider/database.service';
import { format } from "date-fns";
import { ToastController } from '@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Structures } from 'src/app/models/structures';


@Component({
  selector: 'app-rec-ticket',
  templateUrl: './rec-ticket.component.html',
  styleUrls: ['./rec-ticket.component.scss'],
})
export class RecTicketComponent implements OnInit {
  recette: Recettes;
  cdate: Date;
  structure: Structures;
  nbfil: number;
  constructor(public global: GlobalService,
    private router: Router,
    private printer: Printer,
    private db: DatabaseService,
    private tc: ToastController,
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.structure = new Structures();
    this.structure.nom = 'SmartCaisse';
    this.structure.address1 = 'Adresse 1';
    this.structure.address2 = 'Adresse 2';
    this.structure.tel = '+22390000000';
    this.nbfil = 0;
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
        });
        this.db.getNbFileAttente(format(new Date(), "yyyy-MM-dd")).then(res => {
          this.nbfil = res - 1;
        });

      }
    });
    this.recette = new Recettes();
    this.recette.ref = "";
    this.recette.categorieName = "";
    this.recette.prix = 5000;
    this.cdate = new Date();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.recette = this.router.getCurrentNavigation().extras.state.recette;
      }
    });
  }

  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        segment: 'recettes'
      }
    };
    this.router.navigate(['/home'], navigationExtras);

  }


  print() {

    let options: PrintOptions = {
      name: 'MyDocument',
      // printerId: 'My Printer XYZ',
      duplex: true,
      // landscape: true,
      // grayscale: true
    };
    const div = document.getElementById("printable-area");
    let content = div.innerHTML;
    this.printer.print(content, options).then(this.onSuccessPrint,
      this.onErrorPrint);
  }

  onSuccessPrint() {
    //alert("printing done successfully !");
  }

  onErrorPrint() {
    alert("Error while printing !");
  }

  send() {

    if (this.recette.tel) {
      let content = this.structure.nom + "\n";
      content += "ID : " + this.recette.ref + "\n";
      content += "MT : " + this.recette.prix + " (";
      if (this.recette.payer) {
        content += "Payé";
      } else {
        content += "Non payé";
      }
      content += ")\n";
      if (this.global.file_attente) {
        content += this.nbfil + " personne(s) en attente\n";
      }

      content += "Merci à bientôt\n";
      var options = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT'  // Opens Default sms app
          //intent: '' // Sends sms without opening default sms app
        }
      }
      this.sms.send(this.recette.tel, content, options)
        .then(() => {
          //Malert("success");
        }, () => {
          alert("Erreur lors de l'envoie du sms");
        });
    }

  }
}
