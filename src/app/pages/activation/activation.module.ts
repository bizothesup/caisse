import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivationComponent } from './activation.component';
import { Network } from '@ionic-native/network/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

const routes: Routes = [
  {
    path: '',
    component: ActivationComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  providers: [
    Network,
    Uid,
    AndroidPermissions,
    UniqueDeviceID
  ],
  declarations: [ActivationComponent]
})
export class ActivationComponentModule { }
