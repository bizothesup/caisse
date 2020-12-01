import { GlobalService } from './../../provider/global.service';
import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { CategorieService } from 'src/app/provider/categorie.service';
import { Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/provider/database.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  mySegment: String = 'recettes';
  items: Categories[] = [];

  constructor(private platform: Platform,
    public global: GlobalService, private db: DatabaseService, private tc: ToastController) {

  }

  ngOnInit() {

  }

}
