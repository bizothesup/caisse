import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ActivationService } from 'src/app/provider/activation.service';
import { Licence } from 'src/app/models/licence';
import { PhoneValidator } from 'src/app/validators/phone.validator';
import { format } from "date-fns";
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network/ngx';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/provider/loading.service';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],
})
export class ActivationComponent implements OnInit {
  UniqueDeviceID: string;
  licence: Licence;
  country_phone_group: FormGroup;
  validations_form: FormGroup;
  public onlineOffline: boolean = navigator.onLine;
  constructor(private network: Network,
    public formBuilder: FormBuilder,
    public afDB: AngularFireDatabase,
    private router: Router,
    private storage: Storage,
    private uid: Uid,
    public loadingService: LoadingService,
    private androidPermissions: AndroidPermissions,
    private uniqueDeviceID: UniqueDeviceID,
    private licenceService: ActivationService,
    public global: GlobalService) {
    this.getPermission();
  }

  ngOnInit() {
    //this.imei = this.getID_UID('IMEI');
    this.licence = new Licence()
    this.licence.isActive = false;
    this.licence.date = format(new Date(), "yyyy-MM-dd");
    this.licence.id = '';
    this.licence.key = '123456';
    this.storage.get('licenceID').then((val) => {

      if (val) {
        this.licence.id = val
      }
      this.buildForm();
    });

    this.buildForm();


  }

  protected buildForm(): void {
    const country = new FormControl('ML', Validators.required);
    const phone = new FormControl(this.licence.id, Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });
    this.validations_form = this.formBuilder.group({
      phone: new FormControl(this.licence.id, Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])),
      code: new FormControl(this.licence.key, Validators.compose([
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }
  onSubmit(values) {
    // this.licence.id = values.phone;
    // this.licence.key = values.code;
    // this.activateLicence();
    this.licenceService.addLicenceTest();
    this.global.showToast('Licence Add')
  }

  addLicence(licence) {
    this.licenceService.addLicence(licence);
  }
  activateLicence() {
    this.loadingService.loadingPresent();
    this.licenceService.getLicence(this.licence.id).subscribe(doc => {

      if (doc.exists) {
        let lic = doc.data();
        if (lic.key !== this.licence.key) {
          this.global.showAlert("Votre code d'activation est incorrect!", "Activation", "");
          this.loadingService.loadingDismiss();
        } else if (lic.isActive === true) {
          this.global.showAlert("Votre licence est déjà activée sur un autre téléphone ou tablette!", "Activation", "");
          this.loadingService.loadingDismiss();
        } else {
          lic.id = this.licence.id;
          lic.isActive = true;
          this.licenceService.updateLicence(this.licence.id, lic);
          let navigationExtras: NavigationExtras = {
            skipLocationChange: false,
          };
          this.storage.set('licenceID', this.licence.id);
          this.storage.set('licenceTYPE', this.licence.type);
          this.loadingService.loadingDismiss();
          this.global.showToast("Votre licence a été activé. Vous pouvez à présent utilé Smart Caisse sans restriction.")
          this.router.navigate(['/sign-in'], navigationExtras);
        }

      }

    }, (error: HttpErrorResponse) => {
      this.global.showAlert("Veillez verifier votre connexion internet svp!!!", "Problème de connexion internet!", "");
      this.loadingService.loadingDismiss();
    });
  }
  checkLicence() {
    this.licenceService.getLicence(this.licence.id).subscribe(doc => {
      if (doc.exists) {
        let lic = doc.data();

        if (lic.key !== this.licence.key) {
          this.global.showAlert("Veillez contacter l'éditeur à l'adresse ysalissou@gmail.com.", "Activation", "Votre code d'activation incorrect!");
        } else if (lic.isActive === true) {
          this.global.showAlert("Veillez contacter l'éditeur à l'adresse ysalissou@gmail.com.", "Activation", "Votre licence est déjà activée sur un autre téléphone ou tablette!");
        } else {
          lic.id = this.licence.id;
          lic.isActive = true;
          this.licenceService.updateLicence(this.licence.id, lic)
          this.storage.set('licence', this.licence.id);
          let navigationExtras: NavigationExtras = {
            skipLocationChange: false,
          };
          this.router.navigate(['/sign-up'], navigationExtras);
        }
      } else {
        this.global.showAlert("Veillez contacter l'éditeur à l'adresse ysalissou@gmail.com.", "Activation", "Numéro de téléphone ou code d'activation incorrect!");
        //console.log("No such document!");
      }
    }, (error: HttpErrorResponse) => {
      //console.log(error);
      this.global.showAlert("Veillez verifier votre connexion internet svp!!!", "Activation", "");
    });
  }

  getUniqueDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log(uuid);
        this.UniqueDeviceID = uuid;
      })
      .catch((error: any) => {
        console.log(error);
        this.UniqueDeviceID = "Error! ${error}";
      });
  }
  getID_UID(type) {
    if (type === "IMEI") {
      return this.uid.IMEI;
    } else if (type === "ICCID") {
      return this.uid.ICCID;
    } else if (type === "IMSI") {
      return this.uid.IMSI;
    } else if (type === "MAC") {
      return this.uid.MAC;
    } else if (type === "UUID") {
      return this.uid.UUID;
    }
  }
  getPermission() {
    this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    ).then(res => {
      if (res.hasPermission) {

      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
          //alert("Persmission Granted Please Restart App!");
        }).catch(error => {
          alert("Error! " + error);
        });
      }
    }).catch(error => {
      alert("Error! " + error);
    });
  }
}
