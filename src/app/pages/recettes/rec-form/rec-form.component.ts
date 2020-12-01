import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/provider/global.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { Recettes } from 'src/app/models/recettes';
import { Categories } from 'src/app/models/categories';
import { Storage } from '@ionic/storage';
import { Abonnes } from 'src/app/models/abonnes';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Structures } from 'src/app/models/structures';


@Component({
  selector: 'app-rec-form',
  templateUrl: './rec-form.component.html',
  styleUrls: ['./rec-form.component.scss'],
})
export class RecFormComponent implements OnInit {
  structure: Structures;
  userid: number;
  recette: Recettes;
  validations_form: FormGroup;
  mode: String = "new";
  categories: Categories[] = [];
  abonnes: Abonnes[] = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private tc: ToastController,
    private zone: NgZone,
    private sms: SMS,
    private storage: Storage,
    private androidPermissions: AndroidPermissions,
    public alerCtrl: AlertController,
    public global: GlobalService) {
    this.structure = new Structures();

  }

  ngOnInit() {
    this.storage.get('userid').then((val) => {
      if (val) {
        this.userid = val;
      }
    });
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
        });
        this.db.findCategories('R').subscribe(cats => {
          this.categories = cats;
        });

        this.db.findAbonnes().subscribe(cats => {
          this.abonnes = cats;
        });
      }
    });

    this.initForm();

  }
  ionViewWillEnter() {
    this.initForm();
  }
  initForm() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.recette = this.router.getCurrentNavigation().extras.state.recette;
        this.mode = "edit"
        this.buildForm();
        this.validations_form.get('categorie').setValue(this.recette.categorie);
        this.validations_form.get('abonne').setValue(this.recette.abonne);
      } else {
        this.recette = new Recettes();
        this.recette.effecter = false;
        this.recette.payer = false;
        this.recette.ref = ''
        this.recette.tel = '';
        this.recette.etat = 1;

        this.mode = "new";
        this.buildForm();
      }
    });
  }
  protected buildForm(): void {
    if (!this.recette) {
      this.recette = new Recettes();
    }
    this.validations_form = this.formBuilder.group({
      reference: new FormControl(this.recette.ref, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      categorie: new FormControl(this.recette.categorie, Validators.required),
      abonne: new FormControl(this.recette.abonne),
      tarif: new FormControl(this.recette.prix, Validators.required),
      tel: new FormControl(this.recette.tel),
      paye: new FormControl(this.recette.payer, Validators.required),
      termine: new FormControl(this.recette.effecter, Validators.required)
    });


  }
  onChangeCat(evt) {
    if (evt !== -1) {
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.db.getCategorie(evt).then(data => {
            this.validations_form.get('tarif').setValue(data.tarif);
          });

        }
      });

    }
  }
  onChangeAbn(evt) {
    if (evt !== -1) {
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.db.getAbonne(evt).then(data => {
            this.validations_form.get('tarif').setValue(data.tarif);
          });

        }
      });

    }
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
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        recette: this.recette
      }
    };
    this.router.navigate(['/home/printRec'], navigationExtras);
  }
  goToTicket(item) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        recette: item
      }
    };
    this.router.navigate(['/home/printRec'], navigationExtras);
  }
  onSubmit(values) {

    this.recette.categorie = values.categorie;
    this.recette.abonne = values.abonne;
    this.recette.prix = values.tarif;
    this.recette.ref = values.reference;
    this.recette.tel = values.tel;
    this.recette.payer = values.paye;
    this.recette.effecter = values.termine;
    this.recette.ref = this.recette.ref.toUpperCase();

    if (this.structure.nature === "C") {
      this.recette.effecter = true;
    }

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        if (this.mode === 'new') {
          this.recette.userid = this.userid;
          this.recette.datec = new Date();
          this.db.addRecette(this.recette)
            .then(_ => {
              this.db.getCategorie(this.recette.categorie).then(data => {
                this.recette.categorieName = data.nom;
                this.goToTicket(this.recette);
              });

            });
        } else {

          this.db.updateRecette(this.recette)
            .then(_ => {
              this.backTolist();
            });
        }
      }
    });



  }
  // sendSms(item) {
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
  //     result => {
  //       let msg = "Votre tiket " + this.user.commerce + "\r\n";
  //       msg += "Ref:" + item.ref + "\r\n";
  //       msg += "Montant:" + item.prix + "\r\n";
  //       msg += "Merci à bientôt";
  //       //this.global.showAlert(msg, 'msg', item.tel);
  //       this.sms.send(item.tel, msg).catch(err => {
  //         console.log(JSON.stringify(err))
  //         console.log(JSON.parse(err))
  //         this.global.showAlert(JSON.stringify(err), 'err', '');
  //       });
  //     },
  //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
  //   );
  // }
  async deleteItem() {

    const alert = await this.alerCtrl.create({
      header: 'Suppression!',
      message: 'Etes-vous sûr de vouloir supprimer la recette [<strong>' + this.recette.ref + '</strong>] ?',
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
            this.db.deleteRecette(this.recette)
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
  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }
}
