import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CategoriesPage } from './categories.page';
import { CatRecListComponent } from './recettes/cat-rec-list/cat-rec-list.component';
import { CatRecFormComponent } from './recettes/cat-rec-form/cat-rec-form.component';
import { CatDepListComponent } from './depenses/cat-dep-list/cat-dep-list.component';
import { CatDepFormComponent } from './depenses/cat-dep-form/cat-dep-form.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPage,
  },
  { path: 'newCatRec', component: CatRecFormComponent },
  { path: 'editCatRec', component: CatRecFormComponent },
  { path: 'newCatDep', component: CatDepFormComponent },
  { path: 'editCatDep', component: CatDepFormComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [CategoriesPage,
    CatRecListComponent,
    CatRecFormComponent,
    CatDepListComponent,
    CatDepFormComponent
  ]
})
export class CategoriesPageModule { }
