import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FacListComponent } from './fac-list/fac-list.component';
import { FacFormComponent } from './fac-form/fac-form.component';
import { FacViewComponent } from './fac-view/fac-view.component';
import { Printer } from '@ionic-native/printer/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { FacDetailsComponent } from './fac-details/fac-details.component';



const routes: Routes = [
  {
    path: '',
    component: FacListComponent
  },
  { path: 'newFac', component: FacFormComponent },
  { path: 'viewFac', component: FacViewComponent },
  { path: 'detailsFac', component: FacDetailsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [
    FacListComponent,
    FacFormComponent,
    FacViewComponent,
    FacDetailsComponent
  ],
  providers: [
    Printer,
    EmailComposer,
    File,
    FileOpener,
  ],
})
export class FacturesPageModule { }
