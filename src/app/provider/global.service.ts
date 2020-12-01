import { SearchPage } from './../pages/search/search.page';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController, MenuController, AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { CategoriesColors } from '../models/categories-colors';
import { Storage } from '@ionic/storage'
import { format } from "date-fns";
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  userConnecte = new BehaviorSubject<Users>(new Users());

  Dir: string;
  lang = 'fr';
  selected = 0;
  file_attente = false;
  // tslint:disable-next-line:variable-name
  font_size = 'normal';
  private htmlRoot = document.documentElement;
  // tslint:disable-next-line:ban-types
  mySegment: String = 'TOP';
  colors = [
    new CategoriesColors('#ea989d', '1'),
    new CategoriesColors('#b9d7f7', '2'),
    new CategoriesColors('#bee8bb', '3'),
    new CategoriesColors('#f9f2c0', '4'),
    new CategoriesColors('#c6bcdd', '5'),
    new CategoriesColors('#ffb554', '6'),
  ];
  data = {
    commerce: 'Smart Caisse',
    email: 'smartcaisseapp@gmail.com',
    tel: '+000 00 00 00 00',
    pin: '9999',
    address1: 'Adresse 1',
    address2: 'Adresse 2'
  };
  nb_record_eval = 25;
  constructor(public translate: TranslateService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private tc: ToastController,

    public popoverController: PopoverController, private menu: MenuController) {
    this.storage.get('file_attente').then((val) => {
      if (val) {
        this.file_attente = val;
      }
    });

  }
  // change Language
  change_lang(lang) {
    // console.log(this.currentLang);
    if (lang === 'fr') {
      this.Dir = 'ltr';
      this.menu.enable(false, 'rightMenu');
      this.menu.enable(true, 'leftMenu');
      // console.log(lang);
    } else if (lang === 'en') {
      this.Dir = 'ltr';
      this.menu.enable(false, 'rightMenu');
      this.menu.enable(true, 'leftMenu');
      // console.log(lang);

    } else if (lang === 'ar') {
      this.Dir = 'rtl';
      // console.log(lang);
      this.menu.enable(false, 'leftMenu');
      this.menu.enable(true, 'rightMenu');

    }
    // console.log(this.Dir);
    this.htmlRoot.setAttribute('dir', this.Dir);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.htmlRoot.setAttribute('lang', lang);
  }
  getUser(): Observable<Users> {
    return this.userConnecte.asObservable();

  }
  setUser(users) {
    return this.userConnecte.next(users);

  }
  // call search popover
  async search(ev: any) {
    const popover = await this.popoverController.create({
      component: SearchPage,
      event: ev,
      translucent: true,
      cssClass: 'search_pop',
    });
    return await popover.present();
  }

  async showAlert(msg, header, subHeader) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async showErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }

  // start Form message and type
  // tslint:disable-next-line:member-ordering
  validation_messages = {
    'username': [
      { type: 'required', message_en: 'Username is required.', message_fr: 'Username is required.', message_ar: 'اسم المستخدم مطلوب.' },
      // tslint:disable-next-line:max-line-length
      { type: 'minlength', message_en: 'Username must be at least 5 characters long.', message_ar: 'يجب أن يكون اسم المستخدم 5 أحرف على الأقل.' },
      // tslint:disable-next-line:max-line-length
      { type: 'maxlength', message_en: 'Username cannot be more than 25 characters long.', message_ar: 'لا يمكن أن يكون اسم المستخدم أكثر من 25 حرفًا.' },
      // tslint:disable-next-line:max-line-length
      { type: 'pattern', message_en: 'Your username must contain only numbers and letters.', message_ar: 'يجب أن يحتوي اسم المستخدم الخاص بك على أرقام وحروف فقط.' },
      { type: 'validUsername', message_en: 'Your username has already been taken.', message_ar: 'اسم المستخدم الخاص بك قد تم بالفعل.' }
    ],
    'pin': [
      { type: 'required', message_en: 'Le mot de passe est requis.', message_fr: 'Username is required.', message_ar: 'اسم المستخدم مطلوب.' },
      // tslint:disable-next-line:max-line-length
      { type: 'minlength', message_fr: 'Le mot de passe doit contenir au moins 4 caractères.', message_en: 'Password must be at least 4 characters long.', message_ar: 'يجب أن يكون اسم المستخدم 5 أحرف على الأقل.' },
      // tslint:disable-next-line:max-line-length
      { type: 'maxlength', message_fr: 'mot de passe ne doit pas comporter plus de 4 caractères.', message_en: 'Password cannot be more than 4 characters long.', message_ar: 'لا يمكن أن يكون اسم المستخدم أكثر من 25 حرفًا.' },
      // tslint:disable-next-line:max-line-length
      { type: 'pattern', message_fr: 'Votre code ne doit contenir que des chiffres et des lettres.', message_en: 'Your username must contain only numbers and letters.', message_ar: 'يجب أن يحتوي اسم المستخدم الخاص بك على أرقام وحروف فقط.' }
    ],
    'tarif': [
      { type: 'required', message_fr: 'Tarif est obligatoire.', message_en: 'Name is required.', message_ar: 'اسم مطلوب.' },
    ],
    'login': [
      { type: 'required', message_fr: 'L\'utilisateur est obligatoire.', message_en: 'Name is required.', message_ar: 'اسم مطلوب.' },
    ],
    'montant': [
      { type: 'required', message_fr: 'Montant est obligatoire.', message_en: 'Name is required.', message_ar: 'اسم مطلوب.' },
    ],
    'reference': [
      { type: 'required', message_fr: 'Référence est obligatoire.', message_en: 'Name is required.', message_ar: 'اسم مطلوب.' },
      { type: 'maxlength', message_fr: 'La référence ne doit pas comporter plus de 25 caractères.', message_en: 'Username cannot be more than 25 characters long.', message_ar: 'لا يمكن أن يكون اسم المستخدم أكثر من 25 حرفًا.' },
      { type: 'pattern', message_fr: 'La référence ne doit contenir que des chiffres et des lettres.', message_en: 'Your username must contain only numbers and letters.', message_ar: 'يجب أن يحتوي اسم المستخدم الخاص بك على أرقام وحروف فقط.' }

    ],
    'nom': [
      { type: 'required', message_fr: 'Nom est obligatoire.', message_en: 'Name is required.', message_ar: 'اسم مطلوب.' },
      { type: 'maxlength', message_fr: 'Le nom ne doit pas comporter plus de 25 caractères.', message_en: 'Username cannot be more than 25 characters long.', message_ar: 'لا يمكن أن يكون اسم المستخدم أكثر من 25 حرفًا.' },
    ],
    'email': [
      { type: 'required', message_fr: 'L\'email est requis.', message_en: 'Email is required.', message_ar: 'البريد الالكتروني مطلوب.' },
      { type: 'pattern', message_fr: 'Veuillez saisir un e-mail valide.', message_en: 'Please enter a valid email.', message_ar: 'يرجى إدخال البريد الإلكتروني الصحيح.' }
    ],
    'password': [
      { type: 'required', message_fr: 'Mot de passe requis.', message_en: 'Password is required.', message_ar: 'كلمة المرور مطلوبة.' },
      // tslint:disable-next-line:max-line-length
      { type: 'minlength', message_fr: 'Le mot de passe doit contenir au moins 5 caractères.', message_en: 'Password must be at least 5 characters long.', message_ar: 'يجب أن تتكون كلمة المرور من 5 أحرف على الأقل.' },
      // tslint:disable-next-line:max-line-length
      { type: 'pattern', message_fr: 'Votre mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.', message_en: 'Your password must contain at least one uppercase, one lowercase, and one number.', message_ar: 'يجب أن تحتوي كلمة مرورك على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد.' }
    ],
    'confirm_password': [
      { type: 'required', message_fr: 'Mot de passe requis.', message_en: 'Confirm password is required.', message_ar: 'تأكيد كلمة المرور مطلوب.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message_fr: 'Les deux mots de passe ne concordent pas.', message_en: 'Password mismatch.', message_ar: 'عدم تطابق كلمة المرور.' }
    ],
    'address': [
      { type: 'required', message_fr: 'Address is required.', message_en: 'Address is required.', message_ar: 'العنوان مطلوب.' }
    ],
    'phone': [
      { type: 'required', message_fr: 'Le numéro de téléphone est requis.', message_en: 'Phone is required.', message_ar: 'الهاتف مطلوب.' },
      // tslint:disable-next-line:max-line-length
      { type: 'validCountryPhone', message_fr: 'Le téléphone est incorrect.', message_en: 'The phone is incorrect for the selected country.', message_ar: 'الهاتف غير صحيح للبلد المختار.' }
    ],
    'code_activation': [
      { type: 'required', message_en: 'Le code activation est requis.', message_fr: 'Le code activation est requis.', message_ar: 'اسم المستخدم مطلوب.' },
      // tslint:disable-next-line:max-line-length
      { type: 'minlength', message_fr: 'Le code activation doit contenir au moins 6 caractères.', message_en: 'Le code activation doit contenir au moins 6 caractères.', message_ar: 'يجب أن يكون اسم المستخدم 5 أحرف على الأقل.' },
      // tslint:disable-next-line:max-line-length
      { type: 'maxlength', message_fr: 'Le code activation ne doit pas comporter plus de 6 caractères.', message_en: 'Le code activation ne doit pas comporter plus de 6 caractères.', message_ar: 'لا يمكن أن يكون اسم المستخدم أكثر من 25 حرفًا.' },
    ],
    'date': [
      { type: 'required', message_fr: 'Date est requise.', message_en: 'Address is required.', message_ar: 'العنوان مطلوب.' }
    ],

  };

  getPeriodeMois() {
    var t = new Date();
    let curDate = format(new Date(), "yyyy-MM-dd");
    let endMonthDate = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59).toISOString();
    let date = "'" + format(new Date(curDate), "yyyy-MM-") + "01' AND '" + format(new Date(curDate), "yyyy-MM-") + format(new Date(endMonthDate), "dd") + "'";
    return date;
  }

  getEnteteRapport(structure) {
    let content = "";
    content += '<table style="margin: 2%; width: 96%;">';
    content += '<tr>';
    content += '<th width="100%"  style="text-align: center;padding: 5px 20px;font-size: 20px;font-weight: bold;text-transform: uppercase;">';
    content += structure.nom;
    content += '</th>';
    content += '</tr>';
    content += '<tr>';
    content += '<td width="100%" style="text-align: center;padding: 0px;">';
    content += structure.address1;
    content += '</td>';
    content += '</tr>';
    content += '<tr>';
    content += '<td width="100%" style="text-align: center;padding: 0px;">';
    content += structure.address2;
    content += '</td>';
    content += '</tr>';
    content += '<tr>';
    content += '<td width="100%" style="text-align: center;padding: 0px;">';
    content += structure.tel;
    content += '</td>';
    content += '</tr>';
    content += '</table>';
    return content;
  }

  randomString(length) {
    // var rString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var rString = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) { result += rString[Math.floor(Math.random() * rString.length)]; }
    return result;
  }
  randomPhoneNumber(indicatif, length) {
    var rString = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) { result += rString[Math.floor(Math.random() * rString.length)]; }
    return indicatif + result;
  }

}
