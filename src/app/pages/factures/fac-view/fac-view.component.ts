import { Component, OnInit, NgZone } from '@angular/core';
import { Factures } from 'src/app/models/factures';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { DatabaseService } from 'src/app/provider/database.service';
import { GlobalService } from 'src/app/provider/global.service';
import { PrintOptions, Printer } from '@ionic-native/printer/ngx';
import { format } from "date-fns";
import { Users } from 'src/app/models/users';
import { Structures } from 'src/app/models/structures';

@Component({
  selector: 'app-fac-view',
  templateUrl: './fac-view.component.html',
  styleUrls: ['./fac-view.component.scss'],
})
export class FacViewComponent implements OnInit {
  structure: Structures;
  item: Factures;
  date: string;
  curDate: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private printer: Printer,
    private zone: NgZone,
    public alerCtrl: AlertController,
    private db: DatabaseService,
    public global: GlobalService) {

  }

  ngOnInit() {
    this.structure = new Structures();
    this.item = new Factures();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state.item;
        this.db.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.db.getStructure().then(res => {
              this.structure = res;
            });
            this.db.getAbonne(this.item.abonne).then(data => {
              this.item.abonneName = data.nom;
              this.item.abonneTel = data.tel;
              this.item.abonneAdresse = data.address;
            });
          }
        });


      }
    });

    this.date = this.global.getPeriodeMois();
  }



  async deleteItem() {

    const alert = await this.alerCtrl.create({
      header: 'Suppression!',
      message: 'Etes-vous sûr de vouloir supprimer la facture [<strong>' + this.item.ref + '</strong>] ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.backTolist();
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.item.etat = 0;
            this.db.deleteFacture(this.date, this.item)
              .then(_ => {
                this.backTolist();
              });
            this.zone.run(async () => {
              await this.router.navigate(['/factures']);
            });
          }
        }
      ]
    });

    await alert.present();

  }
  async solderItem() {

    const alert = await this.alerCtrl.create({
      header: 'Mise à jour facture!',
      message: 'Etes-vous sûr de vouloir solder la facture [<strong>' + this.item.ref + '</strong>] ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.backTolist();
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.item.payer = true;
            this.db.soldeFacture(this.date, this.item)
              .then(_ => {
                this.backTolist();
              });
            this.zone.run(async () => {
              await this.router.navigate(['/factures']);
            });
          }
        }
      ]
    });

    await alert.present();

  }
  detailItem() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        item: this.item
      }
    };
    this.router.navigate(['/factures/detailsFac'], navigationExtras);

  }
  print() {

    let options: PrintOptions = {
      name: 'Fature',
      duplex: true,
    };
    let content = this.global.getEnteteRapport(this.structure);
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
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {

      }
    };
    this.router.navigate(['/factures'], navigationExtras);

  }

}
