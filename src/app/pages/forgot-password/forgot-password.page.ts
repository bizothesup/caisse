import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '../../../../node_modules/@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { PhoneValidator } from 'src/app/validators/phone.validator';
import { Storage } from '@ionic/storage';
import { Users } from 'src/app/models/users';
import { DatabaseService } from 'src/app/provider/database.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  validations_form: FormGroup;
  user: Users;

  constructor(public formBuilder: FormBuilder, public global: GlobalService,
    public modalCtrl: ModalController,
    private db: DatabaseService,
    private sms: SMS,
    private storage: Storage,
    private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    this.user = new Users();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.storage.get('userid').then((val) => {
          if (val) {
            this.db.getUser(val).then(res => {
              this.user = res;
              this.buildForm();
            });

          }
        });

      }
    });

    this.buildForm();
    // End Form Validation
  }
  protected buildForm(): void {
    const country = new FormControl('ML', Validators.required);
    this.validations_form = this.formBuilder.group({
      login: new FormControl(this.user.tel, Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])),

    });
  }

  onSubmit(values) {

    if (values.login !== this.user.tel) {
      this.global.showAlert("Numéro de téléphone incorrect", "Mot de passe oublié", "");
    } else {


      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => {
          this.sms.send(this.user.tel, this.user.pin + ' est votre mot de passe d\'accès Smart Caisse!');
          this.global.showToast("Votre mot de passé est envoyé par sms au numéro " + this.user.tel);
          this.modalCtrl.dismiss();
          console.log('Has permission?', result.hasPermission)
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
      );

      // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);


    }

  }

  close() {
    this.modalCtrl.dismiss();
  }

}
