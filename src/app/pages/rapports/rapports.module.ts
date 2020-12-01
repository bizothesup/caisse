import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { RapportsPage } from './rapports.page';
import { JournalCaisseComponent } from './journal-caisse/journal-caisse.component';
import { DepensesCategorieComponent } from './depenses-categorie/depenses-categorie.component';
import { RecettesCategorieComponent } from './recettes-categorie/recettes-categorie.component';
import { RecettesDepensesComponent } from './recettes-depenses/recettes-depenses.component';
import { RecettesAbonnesComponent } from './recettes-abonnes/recettes-abonnes.component';
import { Printer } from '@ionic-native/printer/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ResultatMenuelComponent } from './resultat-menuel/resultat-menuel.component';
import { SituationImpayesComponent } from './situation-impayes/situation-impayes.component';
import { MonthPipe } from 'src/app/pipe/month';


const routes: Routes = [
  {
    path: '',
    component: RapportsPage,
  },
  { path: '01', component: JournalCaisseComponent },
  { path: '02', component: RecettesCategorieComponent },
  { path: '03', component: DepensesCategorieComponent },
  { path: '04', component: RecettesDepensesComponent },
  { path: '05', component: RecettesAbonnesComponent },
  { path: '06', component: ResultatMenuelComponent },
  { path: '07', component: SituationImpayesComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), TranslateModule.forChild()
  ],
  declarations: [RapportsPage,
    JournalCaisseComponent,
    DepensesCategorieComponent,
    RecettesCategorieComponent,
    ResultatMenuelComponent,
    RecettesAbonnesComponent,
    RecettesDepensesComponent,
    SituationImpayesComponent,
    MonthPipe
  ],
  providers: [
    Printer,
    EmailComposer,
    File,
    FileOpener,
  ],
})
export class RapportsPageModule { }
