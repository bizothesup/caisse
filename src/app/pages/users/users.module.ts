import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { UsersFormComponent } from './users-form/users-form.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersPwdComponent } from './users-pwd/users-pwd.component';




const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  { path: 'newUser', component: UsersFormComponent },
  { path: 'editUser', component: UsersFormComponent },
  { path: 'pwdUser', component: UsersPwdComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [UsersListComponent,
    UsersFormComponent,
    UsersPwdComponent

  ]
})
export class UsersPageModule { }
