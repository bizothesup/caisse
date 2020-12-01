import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';


import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [SettingsPage],
  providers: [
    SqliteDbCopy,
  ],
})
export class SettingsPageModule { }
