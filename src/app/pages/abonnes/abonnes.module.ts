import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AbonnesListComponent } from './abonnes-list/abonnes-list.component';
import { AbonnesFormComponent } from './abonnes-form/abonnes-form.component';



const routes: Routes = [
  {
    path: '',
    component: AbonnesListComponent,
  },
  { path: 'newAbn', component: AbonnesFormComponent },
  { path: 'editAbn', component: AbonnesFormComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [AbonnesListComponent,
    AbonnesFormComponent

  ]
})
export class AbonnesPageModule { }
