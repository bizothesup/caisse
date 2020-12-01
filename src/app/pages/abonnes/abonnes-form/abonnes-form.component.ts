import { Component, OnInit } from '@angular/core';
import { Abonnes } from 'src/app/models/abonnes';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DatabaseService } from 'src/app/provider/database.service';
import { GlobalService } from 'src/app/provider/global.service';

@Component({
  selector: 'app-abonnes-form',
  templateUrl: './abonnes-form.component.html',
  styleUrls: ['./abonnes-form.component.scss'],
})
export class AbonnesFormComponent implements OnInit {

  abonne: Abonnes;
  validations_form: FormGroup;
  mode: String = "new";
  constructor(private route: ActivatedRoute,
    private router: Router,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    public global: GlobalService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.abonne = this.router.getCurrentNavigation().extras.state.abonne;
        this.mode = "edit"
        this.buildForm();
      }
    });
    if (!this.abonne) {
      this.abonne = new Abonnes();
      this.abonne.tarif = 0;
      this.abonne.etat = 1;
      this.mode = "new";
      this.buildForm();
    }


  }

  protected buildForm(): void {
    this.validations_form = this.formBuilder.group({
      nom: new FormControl(this.abonne.nom, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      email: new FormControl(this.abonne.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
      tarif: new FormControl(this.abonne.tarif, Validators.required),
      tel: new FormControl(this.abonne.tel),
      address: new FormControl(this.abonne.address),
    });
  }
  onSubmit(values) {
    this.abonne.nom = values.nom;
    this.abonne.tarif = values.tarif;
    this.abonne.email = values.email;
    this.abonne.tel = values.tel;
    this.abonne.address = values.address;
    if (this.mode === 'new') {
      this.db.addAbonne(this.abonne)
        .then(_ => {
          this.backTolist();
        });
    } else {
      this.db.updateAbonne(this.abonne)
        .then(_ => {
          this.backTolist();
        });
    }
  }
  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false
    };
    this.router.navigate(['/abonnes'], navigationExtras);

  }
}
