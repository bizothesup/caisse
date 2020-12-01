import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UsernameValidator } from '../../validators/username.validator';
import { DatabaseService } from 'src/app/provider/database.service';
import { Structures } from 'src/app/models/structures';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  img = 'assets/imgs/profile.png';
  disable_val = true;
  structure: Structures;
  // start form Validation
  validations_form: FormGroup;


  constructor(public actionSheetCtrl: ActionSheetController, private db: DatabaseService,
    public formBuilder: FormBuilder, public camera: Camera,
    public global: GlobalService) {

  }

  ngOnInit() {
    this.structure = new Structures();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
          this.validations_form.get('nom').setValue(this.structure.nom);
          this.validations_form.get('tel').setValue(this.structure.tel);
          this.validations_form.get('email').setValue(this.structure.email);
          this.validations_form.get('address1').setValue(this.structure.address1);
          this.validations_form.get('address2').setValue(this.structure.address2);
        });

      }
    });
    this.validations_form = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(3),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      tel: new FormControl('', Validators.required),
      address1: new FormControl('', Validators.required),
      address2: new FormControl(''),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
    // End Form Validation
  }

  onSubmit(values) {
    values['img'] = this.img;
    this.disable_val = true;
    this.structure.nom = values.nom;
    this.structure.tel = values.tel;
    this.structure.email = values.email;
    this.structure.address1 = values.address1;
    this.structure.address2 = values.address2;
    this.db.updateStructure(this.structure)
      .then(_ => {
        this.global.showToast("Informations modifiées avec success!!!")
      });

  }

  update() {
    this.disable_val = false;
  }
  // End Form validation



  async  selectImage() {
    if (this.global.lang === 'fr') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Modifier votre image',
        buttons: [
          {
            text: 'Galerie',
            handler: () => { this.get_camera('Gallery'); }
          }, {
            text: 'Caméra',
            handler: () => { this.get_camera('Camera'); }
          }, {
            text: 'Annuler',
            role: 'cancel',
            handler: () => { }
          }
        ],
        cssClass: 'camera_sheet'
      });
      actionSheet.present();
    }
    if (this.global.lang === 'en') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Modify your Picture',
        buttons: [
          {
            text: 'Gallery',
            handler: () => { this.get_camera('Gallery'); }
          }, {
            text: 'Camera',
            handler: () => { this.get_camera('Camera'); }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { }
          }
        ],
        cssClass: 'camera_sheet'
      });
      actionSheet.present();
    }
    if (this.global.lang === 'ar') {
      // tslint:disable-next-line:prefer-const
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'تعديل صورة الحساب',
        buttons: [
          {
            text: 'معرض الصور',
            handler: () => { this.get_camera('Gallery'); }
          }, {
            text: 'الكاميرا',
            handler: () => { this.get_camera('Camera'); }
          }, {
            text: 'الغاء',
            role: 'cancel',
            handler: () => { }
          }
        ],
        cssClass: 'camera_sheet'
      }
      );
      await actionSheet.present();
    }
  }
  get_camera(source) {
    const options: CameraOptions = {
      quality: 100, destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG, mediaType: this.camera.MediaType.PICTURE
      , allowEdit: true, targetWidth: 512, targetHeight: 512, correctOrientation: true
    };
    if (source === 'Gallery') {
      options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    } else {
      options.sourceType = this.camera.PictureSourceType.CAMERA;
    }

    this.camera.getPicture(options).then((imageData) => {
      this.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => { });

  }


}
