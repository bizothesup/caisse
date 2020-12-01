import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalService } from 'src/app/provider/global.service';
import { DatabaseService } from 'src/app/provider/database.service';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {

  items: Users[] = [];

  constructor(private router: Router,
    public global: GlobalService,
    private db: DatabaseService) { }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }
  loadItems() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadUser();
        this.db.getUsers().subscribe(cats => {
          this.items = cats;
        });
      }
    });
  }
  showItem(item: Users) {
    let navigationExtras: NavigationExtras = {
      skipLocationChange: false,
      state: {
        user: item
      }
    };
    this.router.navigate(['/users/editUser'], navigationExtras);

  }

  deleteItem(item: Users) {
    if (item.id > 1) {
      item.etat = -1;
      this.db.deleteUser(item).then(async (res) => {
        this.loadItems();
        this.global.showToast('Utilisateur supprimé avec succèss');
      });
    }

  }

}
