import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/provider/global.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/provider/database.service';
import { Storage } from '@ionic/storage';
import { Users } from 'src/app/models/users';
import { PasswordValidator } from 'src/app/validators/password.validator';



@Component({
  selector: 'app-users-pwd',
  templateUrl: './users-pwd.component.html',
  styleUrls: ['./users-pwd.component.scss'],
})
export class UsersPwdComponent implements OnInit {
  userid: number;
  user: Users;
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private storage: Storage,
    public global: GlobalService) {

  }
  ngOnInit() {
    this.buildForm();
    this.storage.get('userid').then((val) => {
      if (val) {
        this.userid = val;
        this.db.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.db.getUser(val).then(res => {
              this.user = res;

            });
          }
        });
      }
    });
  }

  protected buildForm(): void {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.required,
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    this.validations_form = this.formBuilder.group({
      oldpassword: new FormControl('', Validators.compose([
        Validators.maxLength(4),
        Validators.minLength(4),
        Validators.required,
      ])),
      matching_passwords: this.matching_passwords_group,
    });
  }

  onSubmit(values) {
    this.user.pin = values.matching_passwords.password;
    ///this.global.showAlert(this.user.pin, values.oldpassword, "");
    if (values.oldpassword != this.user.pin) {
      this.global.showAlert("Ancien mot de passe incorrect", "Connexion", "");
    } else {
      this.db.updateUserPwd(this.user)
        .then(_ => {
          this.global.showToast('Mot de passe changé avec succèss')
          let navigationExtras: NavigationExtras = {
            skipLocationChange: false,
          };
          this.router.navigate(['/sign-in'], navigationExtras);
        });
    }

  }

  backTolist() {
    this.router.navigate(['/home']);

  }

}
