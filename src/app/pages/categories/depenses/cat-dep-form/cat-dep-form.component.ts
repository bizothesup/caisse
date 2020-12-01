import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CatRecFormResolver } from 'src/app/resolver/cat-rec-form-resolver';
import { Categories } from 'src/app/models/categories';

@Component({
  selector: 'app-cat-dep-form',
  templateUrl: './cat-dep-form.component.html',
  styleUrls: ['./cat-dep-form.component.scss'],
})
export class CatDepFormComponent implements OnInit {

  categorie: Categories;
  validations_form: FormGroup;
  mode: String = "new";
  constructor(private route: ActivatedRoute,
    private router: Router,
    public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    public formResolver: CatRecFormResolver,
    private db: DatabaseService,
    private tc: ToastController,
    public global: GlobalService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.categorie = this.router.getCurrentNavigation().extras.state.categorie;
        this.mode = "edit"
        this.buildForm();
      }
    });
    if (!this.categorie) {
      this.categorie = new Categories();
      this.categorie.etat = 1;
      this.categorie.nature = 'D';
      this.categorie.frequence = 'P';
      this.mode = "new";
      this.buildForm();
    }


  }

  protected buildForm(): void {
    this.validations_form = this.formBuilder.group({
      nom: new FormControl(this.categorie.nom, Validators.compose([
        Validators.maxLength(25),
        Validators.required
      ])),
      color: new FormControl(this.categorie.color, Validators.required),
      tarif: new FormControl(this.categorie.tarif, Validators.required),
      frequence: new FormControl(this.categorie.frequence, Validators.required),
    });
  }
  onSubmit(values) {
    if (this.mode === 'new') {
      this.db.addCategorie(values.nom, values.tarif, values.color, 'D', values.frequence)
        .then(_ => {
          this.backTolist();
        });
    } else {
      this.categorie.nom = values.nom;
      this.categorie.tarif = values.tarif;
      this.categorie.color = values.color;
      this.db.updateCategorie(this.categorie)
        .then(_ => {
          this.backTolist();
        });
    }
  }
  backTolist() {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        segment: 'depenses'
      }
    };
    this.router.navigate(['/categories'], navigationExtras);

  }


}
