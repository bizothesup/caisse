import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { DatabaseService } from 'src/app/provider/database.service';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private htmlRoot = document.documentElement;
  auto_sync;
  auto_back;
  location_service;
  constructor(public global: GlobalService,
    private file: File,
    private platform: Platform,
    public db: DatabaseService,
    private storage: Storage,
    private sqliteDbCopy: SqliteDbCopy) { }

  ngOnInit() {
  }
  change_file_attente() {
    // console.log(this.global.file_attente)
    this.storage.set('file_attente', this.global.file_attente);
  }
  change_font_size() {
    if (this.global.font_size === 'big') {
      this.htmlRoot.classList.remove('small_font');
      this.htmlRoot.classList.add('big_font');
    } else if (this.global.font_size === 'small') {
      this.htmlRoot.classList.remove('big_font');
      this.htmlRoot.classList.add('small_font');
    } else {
      this.htmlRoot.classList.remove('small_font', 'big_font');
    }
  }
  sauvegarder_donnees() {
    this.platform.ready().then(() => {
      let destination = this.file.externalRootDirectory + '/SmartCaisse/db/'
      if (this.platform.is('android')) {
        this.file.checkDir(this.file.externalRootDirectory + 'SmartCaisse/', 'db').then(response => {
          this.sqliteDbCopy.copyDbToStorage(this.db.dbName, 0, destination, true)
            .then((res: any) => console.log(res))
            .catch((error: any) => this.global.showErrorAlert(JSON.stringify(error)));
          this.global.showToast('Sauvégarde effectuée avec succès')
        }).catch(err => {
          this.global.showToast('Erreur lors de la sauvegarde de la basse de donnée')

        });
      }
    });

  }

  restaurer_donnees() {
    this.platform.ready().then(() => {
      let source = this.file.externalRootDirectory + '/SmartCaisse/db/' + this.db.dbName
      if (this.platform.is('android')) {
        this.file.checkFile(this.file.externalRootDirectory + 'SmartCaisse/db/', this.db.dbName).then(response => {
          this.sqliteDbCopy.copyDbFromStorage(this.db.dbName, 0, source, true)
            .then((res: any) => console.log(res))
            .catch((error: any) => this.global.showErrorAlert(JSON.stringify(error)));
          this.global.showToast('Restauration effectuée avec succès')
        }).catch(err => {
          this.global.showToast('Erreur lors de la restaudation de la basse de donnée')
        });
      }
    })
  }
}
