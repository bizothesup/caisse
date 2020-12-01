import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LikesPage } from './likes.page';

const routes: Routes = [
  {
    path: '',
    component: LikesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),TranslateModule.forChild()
  ],
  declarations: [LikesPage]
})
export class LikesPageModule {}
