import { Component } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '../../node_modules/@angular/router';
import { GlobalService } from './provider/global.service';

import { File } from '@ionic-native/file/ngx';
import { timer } from 'rxjs';
import { Users } from './models/users';
import { DatabaseService } from './provider/database.service';
import { Structures } from './models/structures';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showSplash = true;
  backButtonSubscription;
  menu;
  licenceLevel = 0;
  public appPages2 = [
    {
      title_fr: 'Accueil',
      title_ar: 'الرئيسية',
      title_en: 'Home',
      level: 0,
      url: '/home',
      icon: 'home'
    },
    {
      title_fr: 'Factures',
      title_ar: 'الاقسام',
      title_en: 'Invoices',
      level: 1,
      url: '/factures',
      icon: 'paper'
    }
  ];
  public appPages = [
    {
      title_fr: 'Accueil',
      title_ar: 'الرئيسية',
      level: 0,
      url: '/home',
      icon: 'home'
    },
    {
      title_fr: 'Factures',
      title_ar: 'الاقسام',
      title_en: 'Invoices',
      level: 1,
      url: '/factures',
      icon: 'paper'
    },
    {
      title_fr: 'Clients',
      title_ar: 'الاقسام',
      title_en: 'Customer',
      level: 1,
      url: '/abonnes',
      icon: 'contact'
    },
    {
      title_fr: 'Produits / Services',
      title_ar: 'الاقسام',
      title_en: 'Products / Services',
      level: 0,
      url: '/categories',
      icon: 'reorder'
    },
    {
      title_fr: 'Rapports / Statistiques',
      title_ar: 'الإعجابات',
      title_en: 'Reports / Statistics',
      level: 0,
      url: '/rapports',
      icon: 'pie'
    },
    {
      title_fr: 'Utilisateurs',
      title_ar: 'الإعجابات',
      title_en: 'Users',
      level: 1,
      url: '/users',
      icon: 'person'
    },
    {
      title_fr: 'Paramètres du commerce',
      title_ar: 'الملف الشخصي',
      title_en: 'Trade settings',
      level: 0,
      url: '/profile',
      icon: 'ribbon'
    },
    {
      title_fr: 'Paramètres généraux',
      title_ar: 'الإعدادات',
      title_en: 'General settings',
      level: 0,
      url: '/settings',
      icon: 'settings'
    }
  ];
  structure: Structures;
  userid: number;
  user: Users;
  licenceTYPE: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController,
    private file: File,
    private storage: Storage,
    private navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private db: DatabaseService,
    public global: GlobalService
  ) {
    this.menu = this.appPages;
    this.licenceTYPE = 'E';
    this.user = new Users();
    this.structure = new Structures();
    this.global.getUser().subscribe(u => {
      this.user = u;
    });
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStructure().then(res => {
          this.structure = res;
        });

      }
    });


    this.storage.get('licenceTYPE').then((val) => {
      // if (this.user.estadmin !== 1) {
      //   this.appPages = this.appPages2;
      // }
      if (val) {
        this.licenceTYPE = val;
        if (this.licenceTYPE === 'S') {
          this.licenceLevel = 0;
        } else {
          this.licenceLevel = 1;
        }

        this.menu = this.appPages.filter(it => {
          return it.level <= this.licenceLevel;
        });
        //console.log(this.menu);

      }

    });

    this.initializeApp();
    this.checkPermissions();
    this.createAppDir();
  }

  initializeApp() {
    // console.log(this.global.lang);
    this.global.change_lang(this.global.lang);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(200).subscribe(() => this.showSplash = false);
      this.menuCtrl.enable(false, 'rightMenu');
      this.menuCtrl.enable(false, 'leftMenu');
    });
  }

  select(i) {
    this.global.selected = i;
  }
  sign_out() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false, 'rightMenu');
    this.menuCtrl.enable(false, 'leftMenu');
    this.navCtrl.navigateRoot('/sign-in');
  }
  change_password() {
    this.menuCtrl.close();
    this.menuCtrl.enable(false, 'rightMenu');
    this.menuCtrl.enable(false, 'leftMenu');
    this.navCtrl.navigateRoot('/users/pwdUser');
  }
  checkPermissions() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]
    );
  }
  createAppDir() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.file.checkDir(this.file.externalRootDirectory, 'SmartCaisse').then(response => {
          //console.log('Directory exists' + response);
        }).catch(err => {
          //console.log('Directory doesn\'t exist' + JSON.stringify(err));
          this.file.createDir(this.file.externalRootDirectory, 'SmartCaisse', false).then(response => {
            this.file.createDir(this.file.externalRootDirectory, 'SmartCaisse/db', false).then(response => {

            })
            this.file.createDir(this.file.externalRootDirectory, 'SmartCaisse/tmp', false).then(response => {

            })
          }).catch(err => {
            //console.log('Directory no create' + JSON.stringify(err));
          });
        });
      }
    });
  }
  exitApp() {
    navigator['app'].exitApp();
  }



}
