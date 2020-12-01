import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DatabaseService } from 'src/app/provider/database.service';
import { Users } from 'src/app/models/users';
import { GlobalService } from 'src/app/provider/global.service';
import { UsernameValidator } from 'src/app/validators/username.validator';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { PhoneValidator } from 'src/app/validators/phone.validator';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent implements OnInit {
  disable_val = true;
  user: Users;
  validations_form: FormGroup;
  mode: String = "new";
  matching_passwords_group: FormGroup;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    public global: GlobalService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.mode = "edit"
        this.buildForm();
      }
    });
    if (!this.user) {
      this.disable_val = false;
      this.user = new Users();
      this.user.etat = 1;
      this.mode = "new";
      this.buildForm();
    }


  }

  protected buildForm(): void {
    let bd = 'false';
    if (this.user.estadmin === 1) {
      bd = 'true';
    }
    const country = new FormControl('ML', Validators.required);
    this.matching_passwords_group = new FormGroup({
      password: new FormControl(this.user.pin, Validators.compose([
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl(this.user.pin, Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    this.validations_form = this.formBuilder.group({
      pseudo: new FormControl(this.user.pseudo, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      email: new FormControl(this.user.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
      tel: new FormControl(this.user.tel, Validators.compose([
        Validators.required,
        PhoneValidator.validCountryPhone(country)
      ])),
      estadmin: new FormControl(bd),
      matching_passwords: this.matching_passwords_group,
    });
  }
  onSubmit(values) {
    this.user.pseudo = values.pseudo;
    this.user.email = values.email;
    this.user.tel = values.tel;
    //this.global.showAlert(values.estadmin, "", "")
    if (values.estadmin === true) {
      this.user.estadmin = 1;
    } else {
      this.user.estadmin = 0;
    }
    if (this.mode === 'new') {
      this.user.pin = values.matching_passwords.password;;
      this.db.addUser(this.user)
        .then(_ => {
          this.backTolist();
        });
    } else {
      if (this.user.id === 1) {
        this.user.estadmin = 1;
      }
      this.db.updateUser(this.user)
        .then(_ => {
          this.backTolist();
        });
    }
  }
  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false
    };
    this.router.navigate(['/users'], navigationExtras);

  }

}
