import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/provider/global.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-rapports',
  templateUrl: './rapports.page.html',
  styleUrls: ['./rapports.page.scss'],
})
export class RapportsPage implements OnInit {
  items = [];
  constructor(private router: Router, public global: GlobalService) { }

  ngOnInit() {
    this.items = [
      { code: '01', nom: 'Journal de caisse' },
      { code: '02', nom: 'Recettes par catégorie' },
      { code: '03', nom: 'Dépenses par catégorie' },
      { code: '04', nom: 'Recettes vs Dépenses' },
      { code: '05', nom: 'Recettes par abonné' },
      { code: '06', nom: 'Resultat mensuel' },
      { code: '07', nom: 'Situation des impayés' },
    ]
  }

  showItem(item) {
    this.router.navigate(['/rapports/' + item.code]);

  }

}
