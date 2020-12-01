import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { RecListComponent } from '../recettes/rec-list/rec-list.component';
import { RecFormComponent } from '../recettes/rec-form/rec-form.component';
import { DepListComponent } from '../depenses/dep-list/dep-list.component';
import { DepFormComponent } from '../depenses/dep-form/dep-form.component';
import { RecTicketComponent } from '../recettes/rec-ticket/rec-ticket.component';
import { Printer } from '@ionic-native/printer/ngx';
import { SearchPage } from '../search/search.page';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CatDepFormResolver } from 'src/app/resolver/cat-dep-form-resolver';





const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  { path: 'newRec', component: RecFormComponent },
  { path: 'editRec', component: RecFormComponent },
  { path: 'printRec', component: RecTicketComponent },
  { path: 'newDep', component: DepFormComponent, resolve: { data: CatDepFormResolver } },
  { path: 'editDep', component: DepFormComponent, resolve: { data: CatDepFormResolver } },
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
    Printer,
    SMS,
    AndroidPermissions
  ],
  declarations: [
    HomePage,
    RecListComponent,
    RecFormComponent,
    RecTicketComponent,
    DepListComponent,
    DepFormComponent
  ]
})
export class HomePageModule { }
