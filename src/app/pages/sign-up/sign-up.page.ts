import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from '../../validators/password.validator';
import { PhoneValidator } from 'src/app/validators/phone.validator';
import { DatabaseService } from 'src/app/provider/database.service';
import { Structures } from 'src/app/models/structures';
import { ActivationService } from 'src/app/provider/activation.service';
import { Licence } from 'src/app/models/licence';
import { format } from "date-fns";
import { Storage } from '@ionic/storage'
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/provider/loading.service';
import { NavigationExtras, Router } from '@angular/router';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  structure: Structures;
  user: Users;
  licence: Licence;
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  constructor(public formBuilder: FormBuilder, private db: DatabaseService,
    private licenceService: ActivationService,
    private storage: Storage,
    public loadingService: LoadingService,
    private router: Router,
    public global: GlobalService) { }

  ngOnInit() {
    this.structure = new Structures();
    this.buildForm();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
          // this.validations_form.get('commerce').setValue(this.user.commerce);
          // this.validations_form.get('login').setValue(this.user.tel);

        });
      }
    });

  }
  protected buildForm(): void {
    const country = new FormControl('ML', Validators.required);
    this.validations_form = this.formBuilder.group({
      nature: new FormControl('C', Validators.required),
      nom: new FormControl('', Validators.required),
      login: new FormControl('', Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }
  onSubmit(values) {
    this.structure.nature = values.nature;
    this.structure.nom = values.nom;
    this.structure.tel = values.login;
    this.structure.email = values.email;
    this.structure.estactive = 0;

    this.licence = new Licence();
    this.licence.type = 'E';
    this.licence.commerce = this.structure.nom;
    this.licence.isActive = false;
    this.licence.date = format(new Date(), "yyyy-MM-dd");
    this.licence.id = this.structure.tel;
    this.licence.key = this.global.randomString(6);

    this.loadingService.loadingPresent();
    this.licenceService.getLicence(this.licence.id).subscribe(doc => {
      if (doc.exists) {
        this.global.showAlert("Veillez utiliser un autre numéro de téléphone svp!!!", "Ce compte existe déjà!", "");
        this.loadingService.loadingDismiss();
      } else {
        this.db.updateStructure(this.structure)
          .then(_ => {
            this.licenceService.addLicence(this.licence);
            this.storage.set('licenceID', this.licence.id);
            this.storage.set('licenceTYPE', this.licence.type);

            this.storage.get('userid').then((val) => {
              if (val) {
                this.db.getUser(val).then(res => {
                  this.user = res;
                  this.user.tel = this.licence.id;
                  this.db.updateUser(this.user);
                });

              }
            });
            this.loadingService.loadingDismiss();
            let navigationExtras: NavigationExtras = {
              skipLocationChange: false,
            };
            this.router.navigate(['/sign-in'], navigationExtras);
          });
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
      this.global.showAlert("Veillez verifier votre connexion internet svp!!!", "Problème de connexion internet!", "");
      this.loadingService.loadingDismiss();
    });


  }

}
