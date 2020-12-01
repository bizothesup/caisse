import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/provider/global.service';
import { AlertController, ToastController, NavParams, PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/app/provider/database.service';
import { format } from "date-fns";
import { NavigationExtras, Router } from '@angular/router';
import { Recettes } from 'src/app/models/recettes';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  pop: PopoverController;
  items = [];
  filterData = []
  curDate: string;
  constructor(private tc: ToastController,
    private router: Router,
    navParams: NavParams) {
    this.items = navParams.get('data');
    this.pop = navParams.get('popoverController');
  }

  ngOnInit() {
    this.filterData = []
  }

  filterList(evt) {
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    if (searchTerm && searchTerm.trim() !== '') {
      this.filterData = this.items.filter((data) => {
        return (data.ref.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      })
    }
  }
  showItem(item: Recettes) {
    this.pop.dismiss();
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        recette: item
      }
    };
    this.router.navigate(['/home/editRec'], navigationExtras);

  }
  async showToast(msg) {
    const toast = await this.tc.create({ message: msg, duration: 2000 });
    toast.present();
  }


}
