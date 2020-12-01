import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/provider/global.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { Storage } from '@ionic/storage';
import { Categories } from 'src/app/models/categories';
import { Depenses } from 'src/app/models/depenses';
import { CatDepFormResolver } from 'src/app/resolver/cat-dep-form-resolver';


@Component({
  selector: 'app-dep-form',
  templateUrl: './dep-form.component.html',
  styleUrls: ['./dep-form.component.scss'],
})
export class DepFormComponent implements OnInit {
  userid: number;
  depense: Depenses;
  validations_form: FormGroup;
  mode: String = "new";
  compareWith


  constructor(private router: Router,
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private tc: ToastController,
    public alerCtrl: AlertController,
    private zone: NgZone,
    private storage: Storage,
    private resolver: CatDepFormResolver,
    public global: GlobalService) {

  }

  ngOnInit() {


    this.storage.get('userid').then((val) => {
      if (val) {
        this.userid = val;
      }
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.depense = this.router.getCurrentNavigation().extras.state.depense;
        this.mode = "edit"
        this.buildForm();
      } else {
        this.depense = new Depenses();
        this.depense.payer = false;
        this.depense.ref = ''
        this.mode = "new";
        this.buildForm();
      }
    });

  }


  protected buildForm(): void {
    if (!this.depense) {
      this.depense = new Depenses();
    }
    this.validations_form = this.formBuilder.group({
      reference: new FormControl(this.depense.ref, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      categorie: new FormControl(this.depense.categorie, Validators.required),
      tarif: new FormControl(this.depense.prix, Validators.required),
      paye: new FormControl(this.depense.payer, Validators.required)
    });
    if (this.depense.categorie) {
      //this.validations_form.get('categorie').setValue(this.depense.categorie);
    }

  }
  compareById(f1, f2): boolean {
    return f1 && f2 && f1.id === f2.id;
  }
  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        segment: 'depenses'
      }
    };
    this.router.navigate(['/home']);

  }
  async deleteItem() {

    const alert = await this.alerCtrl.create({
      header: 'Suppression!',
      message: 'Etes-vous sûr de vouloir supprimer la dépense [<strong>' + this.depense.ref + '</strong>] ?',
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
            this.db.deleteDepense(this.depense)
              .then(_ => {
                this.backTolist();
              });
            this.zone.run(async () => {
              await this.router.navigate(['/home']);
            });
          }
        }
      ]
    });

    await alert.present();

  }
  onSubmit(values) {
    this.depense.categorie = values.categorie;
    this.depense.prix = values.tarif;
    this.depense.ref = values.reference;
    this.depense.payer = values.paye;
    this.depense.ref = this.depense.ref.toUpperCase();

    if (this.mode === 'new') {
      this.depense.userid = this.userid;
      this.depense.datec = new Date();
      this.db.addDepense(this.depense)
        .then(_ => {
          this.backTolist();
        });
    } else {
      this.db.updateDepense(this.depense)
        .then(_ => {
          this.backTolist();
        });
    }
  }
  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }

}
