import { Component, OnInit, NgZone } from '@angular/core';
import { Factures } from 'src/app/models/factures';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { DatabaseService } from 'src/app/provider/database.service';
import { GlobalService } from 'src/app/provider/global.service';
import { PrintOptions, Printer } from '@ionic-native/printer/ngx';
import { format } from "date-fns";
import { Structures } from 'src/app/models/structures';


@Component({
  selector: 'app-fac-details',
  templateUrl: './fac-details.component.html',
  styleUrls: ['./fac-details.component.scss'],
})
export class FacDetailsComponent implements OnInit {
  structure: Structures;
  item: Factures;
  date: string;
  curDate: string;
  items = [];
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
            this.db.findRecetteByFacture(this.item.id).subscribe(data => {
              this.items = data;
            });
          }
        });


      }
    });

  }

  print() {

    let options: PrintOptions = {
      name: 'DetailsFacture',
      duplex: true,
    };
    let content = this.global.getEnteteRapport(this.structure);
    const div = document.getElementById("printable-area1");
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
