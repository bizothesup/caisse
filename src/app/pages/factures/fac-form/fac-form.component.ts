import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/provider/global.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { Abonnes } from 'src/app/models/abonnes';
import { Factures } from 'src/app/models/factures';
import { Storage } from '@ionic/storage';
import { format } from "date-fns";
@Component({
  selector: 'app-fac-form',
  templateUrl: './fac-form.component.html',
  styleUrls: ['./fac-form.component.scss'],
})
export class FacFormComponent implements OnInit {
  userid: number;
  item: Factures;
  validations_form: FormGroup;
  abonnes: Abonnes[] = [];
  curDate: string;
  date: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private tc: ToastController,
    private storage: Storage,
    private zone: NgZone,
    public alerCtrl: AlertController,
    public global: GlobalService) {

  }

  ngOnInit() {
    this.storage.get('userid').then((val) => {
      if (val) {
        this.userid = val;
      }
    });
    this.curDate = new Date().toISOString();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.findAbonnes().subscribe(cats => {
          this.abonnes = cats;
        });
      }
    });

    this.item = new Factures();
    this.item.payer = false;
    this.item.ref = ''
    this.item.dated = new Date(this.curDate);
    this.item.datef = new Date(this.curDate);
    this.item.etat = 1;

    this.buildForm();
    this.date = this.global.getPeriodeMois();
  }
  ionViewWillEnter() {

  }
  onChangeAbonne(evt) {
    if (evt !== -1) {
      this.item.abonne = evt;
      this.getMontantPeriode();
    }
  }
  onChangeDateDebut(evt) {
    if (evt !== -1) {
      this.item.dated = new Date(evt);
      this.getMontantPeriode();
    }
  }
  onChangeDateFin(evt) {
    if (evt !== -1) {
      this.item.datef = new Date(evt);
      this.getMontantPeriode();
    }
  }
  getMontantPeriode() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        if (this.item.abonne && this.item.dated && this.item.dated) {
          this.db.getTotalFacture(this.item.abonne, "'" + format(new Date(this.item.dated), "yyyy-MM-dd") + "' AND '" + format(new Date(this.item.datef), "yyyy-MM-dd") + "'").then(res => {
            this.validations_form.get('montant').setValue(res);
          });
        }
      }

    });
  }
  protected buildForm(): void {
    if (!this.item) {
      this.item = new Factures();
    }
    this.validations_form = this.formBuilder.group({
      reference: new FormControl(this.item.ref, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      abonne: new FormControl(this.item.abonne),
      montant: new FormControl(this.item.montant, Validators.required),
      dated: new FormControl(format(new Date(this.item.dated), "yyyy-MM-dd"), Validators.required),
      datef: new FormControl(format(new Date(this.item.datef), "yyyy-MM-dd"), Validators.required),
      paye: new FormControl(this.item.payer, Validators.required),
    });

    this.generateReference();

  }
  generateReference() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getMaxIdFacture().then(res => {
          let f = 'F' + format(new Date(), "yyMM-") + res;
          this.validations_form.get('reference').setValue(f);
        });
      }
    });
  }
  onChangeCat(evt) {
    if (evt !== -1) {
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.db.getCategorie(evt).then(data => {
            this.validations_form.get('montant').setValue(data.tarif);
          });

        }
      });

    }
  }

  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {

      }
    };
    this.router.navigate(['/factures'], navigationExtras);

  }
  goToTicket(item) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        item: item
      }
    };
    this.router.navigate(['/factures/viewFac'], navigationExtras);
  }
  onSubmit(values) {

    this.item.abonne = values.abonne;
    this.item.montant = values.montant;
    this.item.ref = values.reference;
    this.item.dated = values.dated;
    this.item.datef = values.datef;
    this.item.payer = values.paye;
    this.item.userid = this.userid;
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.item.datec = new Date();
        this.item.dated = new Date(this.item.dated);
        this.item.datef = new Date(this.item.datef);
        //this.global.showAlert(JSON.stringify(this.item), 'ss', '');
        this.db.addFacture(this.date, this.item)
          .then(_ => {
            this.db.getFactureByRef(this.item.ref).then(fac => {
              this.goToTicket(fac);
            });


          });
      }
    });



  }


}
