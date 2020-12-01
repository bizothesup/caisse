import { MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ForgotPasswordPage } from '../../pages/forgot-password/forgot-password.page';
import { PhoneValidator } from 'src/app/validators/phone.validator';
import { CountryPhone } from 'src/app/validators/country-phone.model';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { Users } from 'src/app/models/users';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Structures } from 'src/app/models/structures';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  country_phone_group: FormGroup;
  validations_form: FormGroup;
  countries = [
    new CountryPhone('ML', 'Mali'),
    new CountryPhone('NE', 'Niger'),
    new CountryPhone('BF', 'Burkina faso'),
  ];
  structures: Structures;
  licenceTYPE: string;
  nbeng: number;
  users: Users[] = [];
  // tslint:disable-next-line:max-line-length
  constructor(public global: GlobalService, private db: DatabaseService,
    public formBuilder: FormBuilder, public menuCtrl: MenuController,
    private router: Router,
    private storage: Storage,
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    public modalCtrl: ModalController) { }

  ngOnInit() {
    this.initComponent();
  }

  ionViewWillEnter() {
    this.initComponent();
  }
  initComponent() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.findUsers().subscribe(res => {
          this.users = res;
        });

        this.db.getStructure().then(res => {
          this.structures = res;
          if (res.email === 'smartcaisseapp@gmail.com') {
            let navigationExtras: NavigationExtras = {
              skipLocationChange: false,
            };
            this.router.navigate(['/sign-up'], navigationExtras);
          }
        });
        this.storage.get('licenceTYPE').then((val) => {
          if (val) {
            this.licenceTYPE = val;
            if (this.licenceTYPE === "E") {
              this.db.getNbRecette().then(res => {
                this.nbeng = this.global.nb_record_eval - res;
                if (this.nbeng < 0) { this.nbeng = 0 };
              });

            }
          }

        });

      }
    });
    this.buildForm();
  }
  initComponent2() {
    this.structures = new Structures();
    this.storage.get('licence').then((val) => {
      if (!val) {
        let navigationExtras: NavigationExtras = {
          skipLocationChange: false,
        };
        this.router.navigate(['/activation'], navigationExtras);
      } else {
        this.db.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.db.findUsers().subscribe(res => {
              this.users = res;
            });

            this.db.getStructure().then(res => {
              this.structures = res;
              if (res.nom === 'Smart Caisse') {
                let navigationExtras: NavigationExtras = {
                  skipLocationChange: false,
                };
                this.router.navigate(['/sign-up'], navigationExtras);
              }
            });

          }
        });
      }
    });
    this.buildForm();
  }
  protected buildForm(): void {
    this.validations_form = this.formBuilder.group({
      login: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
    });
    this.storage.get('userid').then((val) => {
      if (val) {
        this.validations_form.get('login').setValue(val);
      }
    });

  }


  onSubmit(values) {

    this.db.getUser(values.login).then(data => {
      if (values.password != data.pin) {
        this.global.showAlert("Mot de passe incorrect", "Connexion", "");
      } else {
        let navigationExtras: NavigationExtras = {
          skipLocationChange: false,
        };
        this.storage.set('userid', values.login);
        this.global.setUser(data);
        this.router.navigate(['/home'], navigationExtras);
      }
    });

  }

  sendSMS() {
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        //intent: 'INTENT'  // Opens Default sms app
        intent: '' // Sends sms without opening default sms app
      }
    }
    this.sms.send('79607732', 'Hello world!', options)
      .then(() => {
        alert("success");
      }, () => {
        alert("failed");
      });
  }
  sendSms() {
    this.sms.send('74466317', ' est votre mot de passe d\'accès Smart Caisse!');
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => {
        this.sms.send('74466317', ' est votre mot de passe d\'accès Smart Caisse!');
        console.log('Has permission?', result.hasPermission)
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    );

  }

  async forgot_password() {
    if (this.validations_form.get('login').value) {
      this.storage.set('userid', this.validations_form.get('login').value);
      const modal = await this.modalCtrl.create({
        component: ForgotPasswordPage,
        cssClass: 'forgot_password',
      });
      return await modal.present();
    } else {
      this.global.showAlert("Veuillez seélectionner un compte", "Connexion", "");
    }

  }


  change_lang() {
    this.global.lang = (this.global.lang === 'en') ? 'fr' : 'en';
    this.global.change_lang(this.global.lang);
    this.menuCtrl.enable(false, 'rightMenu');
    this.menuCtrl.enable(false, 'leftMenu');
  }
}
