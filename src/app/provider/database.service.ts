import { Injectable } from '@angular/core';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categories } from '../models/categories';
import { GlobalService } from './global.service';
import { Recettes } from '../models/recettes';
import { Depenses } from '../models/depenses';
import { Users } from '../models/users';
import { Abonnes } from '../models/abonnes';
import { format } from "date-fns";
import { Journal } from '../models/journal';
import { LoadingService } from './loading.service';
import { Factures } from '../models/factures';
import { Structures } from '../models/structures';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbName = 'smartcaissev11.db';
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  users = new BehaviorSubject([]);
  categoriesRec = new BehaviorSubject([]);
  categoriesDep = new BehaviorSubject([]);
  abonnes = new BehaviorSubject([]);
  factures = new BehaviorSubject([]);
  recettes = new BehaviorSubject([]);
  depenses = new BehaviorSubject([]);
  journal = new BehaviorSubject([]);

  constructor(public global: GlobalService, private plt: Platform,
    private sqlitePorter: SQLitePorter, private sqlite: SQLite,
    private tc: ToastController,
    private alertCtrl: AlertController,
    public loadingService: LoadingService,
    private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: this.dbName,
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.seedDatabase();
      }).catch((error: Error) => {
        console.log('Error on open or create database: ', error);
        return Promise.reject(error.message || error);
      });
    });
  }
  seedDatabase() {
    this.http.get('assets/dump.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
            //this.initDemoData();
          })
          .catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
      });
  }
  initDemoData() {
    let reftab = ['BH6795MD', 'AL6795MD', 'BC6795MD', 'BA6795MD', 'AZ6795MD', 'AT6795MD', 'AH6795MD', 'BH6795MD'];
    let reftabd = ['AGJJJ', 'MOJJJ', 'VTYUU', 'VFRA'];
    let datetab = ['2020-04-25', '2020-04-26', '2020-04-27', '2020-04-04', '2020-04-05', '2020-04-06', '2019-05-29', '2019-03-25', '2019-03-26', '2019-04-27'];
    let prixtab = [1000, 2000, 3000];
    let prixtabd = [5000, 20000, 35000];
    let cattab = [1, 2, 3, 4];
    let anbtab = [1, 2, 3];
    let cattabd = [5, 6];
    let sql = "";
    for (var i = 1; i <= 300; i++) {
      let ref = reftab[Math.floor(Math.random() * reftab.length)];
      let date = datetab[Math.floor(Math.random() * datetab.length)];
      let prix = prixtab[Math.floor(Math.random() * prixtab.length)];
      let cat = cattab[Math.floor(Math.random() * cattab.length)]
      sql += "INSERT INTO recettes (datec, prix, ref, tel,payer,effecter,categorie,abonne,facid,etat) VALUES ('" + date + "', " + prix + ", '" + ref + "', '+22390000000', 'false', 'false', " + cat + ", 1, 0,1);";
    }
    for (var i = 1; i <= 100; i++) {
      let ref = reftabd[Math.floor(Math.random() * reftabd.length)];
      let date = datetab[Math.floor(Math.random() * datetab.length)];
      let prix = prixtabd[Math.floor(Math.random() * prixtabd.length)];
      let cat = cattabd[Math.floor(Math.random() * cattabd.length)]
      sql += "INSERT INTO depenses (datec, prix, ref,payer,categorie,etat) VALUES ('" + date + "', " + prix + ", '" + ref + "',  'true'," + cat + ", 1);";
    }
    // for (var i = 1; i <= 10; i++) {
    //   let ref = reftabd[Math.floor(Math.random() * reftabd.length)];
    //   let date = datetab[Math.floor(Math.random() * datetab.length)];
    //   let prix = prixtabd[Math.floor(Math.random() * prixtabd.length)];
    //   let cat = anbtab[Math.floor(Math.random() * anbtab.length)]
    //   sql += "INSERT INTO factures (datec,dated,datef, montant, ref,payer,abonne,etat) VALUES ('" + date + "', '" + date + "', '" + date + "'," + prix + ", '" + ref + "',  'true'," + cat + ", 1);";
    // }
    //this.global.showAlert(sql, '', '')
    this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(_ => {
        this.dbReady.next(true);
      })
      .catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }



  getDatabaseState() {
    return this.dbReady.asObservable();
  }
  /////////////////////////// Catégorie ////////////////////////////////////
  getCategories(nature): Observable<Categories[]> {
    if (nature === 'R') {
      return this.categoriesRec.asObservable();
    } else {
      return this.categoriesDep.asObservable();
    }

  }

  findCategories(nature): Observable<Categories[]> {
    let categories: Categories[] = [];
    this.database.executeSql('SELECT * FROM categories where etat=1 and nature="' + nature + '"', []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          categories.push(this.dataToCategorie(data, i));
        }
      }

    });
    let categoriesOp = new BehaviorSubject([]);
    categoriesOp.next(categories);
    return categoriesOp.asObservable();
  }
  loadCategories(nature) {
    return this.database.executeSql('SELECT * FROM categories where etat=1 and nature="' + nature + '"', []).then(data => {
      let categories: Categories[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          categories.push(this.dataToCategorie(data, i));
        }
      }
      if (nature === 'R') {
        this.categoriesRec.next(categories);
      } else {
        this.categoriesDep.next(categories);
      }

    });
  }
  addCategorie(nom, tarif, color, nature, frequence) {
    let data = [nom, tarif, color, nature, frequence, 1];
    return this.database.executeSql('INSERT INTO categories (nom, tarif, color,nature,frequence,etat) VALUES (?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadCategories(nature);
    });
  }
  deleteCategorie(item: Categories) {
    return this.database.executeSql('DELETE FROM categories WHERE id = ?', [item.id]).then(_ => {
      this.loadCategories(item.nature);
    });
  }
  updateCategorie(item: Categories) {
    let data = [item.nom, JSON.stringify(item.tarif), item.color, item.frequence, item.etat];
    return this.database.executeSql(`UPDATE categories SET nom = ?, tarif = ?, color = ?,frequence = ?,etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadCategories(item.nature);
    });
  }
  getCategorie(id): Promise<Categories> {
    return this.database.executeSql('SELECT * FROM categories WHERE id = ?', [id]).then(data => {
      return this.dataToCategorie(data, 0);
    });
  }

  dataToCategorie(data, i) {
    return {
      id: data.rows.item(i).id,
      nom: data.rows.item(i).nom,
      tarif: data.rows.item(i).tarif,
      color: data.rows.item(i).color,
      nature: data.rows.item(i).nature,
      frequence: data.rows.item(i).frequence,
      etat: data.rows.item(i).etat
    };
  }
  /////////////////////////// Recette ////////////////////////////////////
  getRecettes(): Observable<Recettes[]> {
    return this.recettes.asObservable();
  }
  loadRecettes(date) {
    let sql = 'SELECT recettes.id,recettes.ordre,recettes.datec,recettes.prix,recettes.userid,  ';
    sql += ' recettes.ref,recettes.tel,recettes.payer,recettes.effecter,recettes.categorie ,recettes.abonne,recettes.etat,';
    sql += ' categories.nom categorieName,categories.color categorieColor,abonnes.nom abonneName';
    sql += ' FROM recettes INNER JOIN categories ON categories.id = recettes.categorie ';
    sql += ' LEFT JOIN abonnes ON abonnes.id = recettes.abonne';
    sql += ' WHERE recettes.etat=1';
    sql += ' AND recettes.datec=\'' + date + '\'';
    sql += ' ORDER BY recettes.effecter,recettes.id ASC';

    return this.database.executeSql(sql, []).then(data => {
      let recettes: Recettes[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          recettes.push(this.dataToRecette(data, i));
        }
      }
      this.recettes.next(recettes);

    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }


  addRecette(item: Recettes) {
    let data = [format(item.datec, "yyyy-MM-dd"), item.prix, item.ref, item.tel, item.payer, item.effecter, item.categorie, item.abonne, 0, item.etat, item.userid];
    return this.database.executeSql('INSERT INTO recettes (datec, prix, ref, tel,payer,effecter,categorie,abonne,facid,etat,userid) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadRecettes(item.datec);
    });
  }


  dataToRecette(data, i) {
    return {
      id: data.rows.item(i).id,
      ordre: (i + 1),
      datec: data.rows.item(i).datec,
      prix: data.rows.item(i).prix,
      ref: data.rows.item(i).ref,
      tel: data.rows.item(i).tel,
      payer: data.rows.item(i).payer,
      effecter: data.rows.item(i).effecter,
      categorie: data.rows.item(i).categorie,
      categorieName: data.rows.item(i).categorieName,
      categorieColor: data.rows.item(i).categorieColor,
      abonne: data.rows.item(i).abonne,
      abonneName: data.rows.item(i).abonneName,
      etat: data.rows.item(i).etat,
      userid: data.rows.item(i).userid
    };
  }

  updateRecette(item: Recettes) {
    let data = [item.prix, item.ref, item.tel, item.payer, item.effecter, item.categorie, item.abonne, item.etat];
    return this.database.executeSql(`UPDATE recettes SET  prix = ?, ref = ?,tel = ?,payer = ?,effecter = ?,categorie = ?,abonne = ?, etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadRecettes(item.datec);
    });
  }
  deleteRecette(item: Recettes) {
    return this.database.executeSql('UPDATE recettes SET etat=-1 WHERE id = ?', [item.id]).then(_ => {
      this.loadRecettes(item.datec);
    });
  }
  getTotalRecettes(date): Promise<number> {
    return this.database.executeSql('SELECT SUM(prix) as montant FROM recettes WHERE etat=1 AND datec=\'' + date + '\' ', []).then(data => {
      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    });
  }
  getTotalEncaisse(date): Promise<number> {
    return this.database.executeSql('SELECT SUM(prix) as montant FROM recettes WHERE etat=1 and payer=\'true\' AND datec=\'' + date + '\' ', []).then(data => {
      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    });
  }
  getNbFileAttente(date): Promise<number> {
    return this.database.executeSql('SELECT COUNT(id) as montant FROM recettes WHERE etat=1 and effecter=\'false\' AND datec=\'' + date + '\' ', []).then(data => {
      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    });
  }
  /////////////////////////// Dépense ////////////////////////////////////
  getDepenses(): Observable<Depenses[]> {
    return this.depenses.asObservable();
  }
  loadDepenses(date) {
    let sql = 'SELECT depenses.id,depenses.datec,depenses.prix,depenses.userid,  ';
    sql += ' depenses.ref,depenses.payer,depenses.categorie ,depenses.etat,';
    sql += ' categories.nom categorieName,categories.color categorieColor';
    sql += ' FROM depenses INNER JOIN categories ON categories.id = depenses.categorie';
    sql += ' WHERE depenses.etat=1';
    sql += ' AND depenses.datec=\'' + date + '\'';
    sql += ' ORDER BY depenses.id ASC';

    return this.database.executeSql(sql, []).then(data => {
      let depenses: Depenses[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          depenses.push(this.dataToDepense(data, i));
        }
      }
      this.depenses.next(depenses);

    }).catch(err => {
      this.global.showAlert(err, 'sss', 'ss');
    });
  }
  addDepense(item: Depenses) {
    let data = [format(item.datec, "yyyy-MM-dd"), item.prix, item.ref, item.payer, item.categorie, 1, item.userid];
    return this.database.executeSql('INSERT INTO depenses (datec, prix, ref,payer,categorie,etat,userid) VALUES (?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadDepenses(item.datec);
    });
  }


  dataToDepense(data, i) {
    return {
      id: data.rows.item(i).id,
      datec: data.rows.item(i).datec,
      prix: data.rows.item(i).prix,
      ref: data.rows.item(i).ref,
      payer: data.rows.item(i).payer,
      categorie: data.rows.item(i).categorie,
      categorieName: data.rows.item(i).categorieName,
      categorieColor: data.rows.item(i).categorieColor,
      etat: data.rows.item(i).etat,
      userid: data.rows.item(i).userid
    };
  }

  updateDepense(item: Depenses) {
    let data = [item.prix, item.ref, item.payer, item.etat];
    return this.database.executeSql(`UPDATE depenses SET prix = ?, ref = ?,payer = ?,etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadDepenses(item.datec);
    }).catch(e => {
      this.global.showAlert(e, '', '');
      return null;
    });
  }
  deleteDepense(item: Depenses) {
    return this.database.executeSql('UPDATE depenses SET etat=-1 WHERE id = ?', [item.id]).then(_ => {
      this.loadDepenses(item.datec);
    });
  }
  getTotalDepenses(date): Promise<number> {
    return this.database.executeSql('SELECT SUM(prix) as montant FROM depenses WHERE etat=1 AND datec=\'' + date + '\' ', []).then(data => {

      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    });
  }
  getTotalPaye(date): Promise<number> {
    return this.database.executeSql('SELECT SUM(prix) as montant FROM depenses WHERE etat=1 and payer=\'true\' AND datec=\'' + date + '\' ', []).then(data => {
      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    });
  }
  /////////////////////////// Abonnes ////////////////////////////////////
  getAbonnes(): Observable<Abonnes[]> {
    return this.abonnes.asObservable();

  }

  findAbonnes(): Observable<Abonnes[]> {
    let list: Abonnes[] = [];
    this.database.executeSql('SELECT * FROM abonnes where etat=1', []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToAbonne(data, i));
        }
      }

    });
    let listOp = new BehaviorSubject([]);
    listOp.next(list);
    return listOp.asObservable();
  }
  loadAbonne() {
    return this.database.executeSql('SELECT * FROM abonnes where etat=1', []).then(data => {
      let list: Abonnes[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToAbonne(data, i));
        }
      }
      this.abonnes.next(list);

    });
  }
  addAbonne(item: Abonnes) {
    let data = [item.nom, item.email, item.tel, item.address, item.tarif, 1];
    return this.database.executeSql('INSERT INTO abonnes (nom, email, tel,address,tarif,etat) VALUES (?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadAbonne();
    }).catch(e => {
      this.global.showAlert(e, '', '');
      return null;
    });
  }
  updateAbonne(item: Abonnes) {
    let data = [item.nom, item.email, item.tel, item.address, item.tarif, item.etat];
    return this.database.executeSql(`UPDATE abonnes SET nom = ?, email = ?, tel = ?,address = ?,tarif=?,etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadAbonne();
    });
  }
  deleteAbonne(item: Abonnes) {
    return this.database.executeSql('DELETE FROM abonnes WHERE id = ?', [item.id]).then(_ => {
      this.loadAbonne();
    });
  }
  getAbonne(id): Promise<Abonnes> {
    return this.database.executeSql('SELECT * FROM abonnes WHERE id = ?', [id]).then(data => {
      return this.dataToAbonne(data, 0);
    });
  }

  dataToAbonne(data, i) {
    return {
      id: data.rows.item(i).id,
      nom: data.rows.item(i).nom,
      tarif: data.rows.item(i).tarif,
      email: data.rows.item(i).email,
      address: data.rows.item(i).address,
      tel: data.rows.item(i).tel,
      etat: data.rows.item(i).etat
    };
  }
  //////////////////////////FACTURES///////////////////////////
  getFactures(): Observable<Factures[]> {
    return this.factures.asObservable();

  }

  loadFactures(date) {
    let sql = 'SELECT factures.id,factures.datec,factures.dated,factures.datef,factures.montant,factures.userid,  ';
    sql += ' factures.ref,factures.payer,factures.abonne ,factures.etat,';
    sql += ' abonnes.nom abonneName,abonnes.tel abonneTel,abonnes.address abonneAdresse';
    sql += ' FROM factures INNER JOIN abonnes ON abonnes.id = factures.abonne';
    sql += ' WHERE factures.etat=1';
    sql += ' AND factures.datec BETWEEN ' + date;
    sql += ' ORDER BY factures.datec ASC';

    return this.database.executeSql(sql, []).then(data => {
      let items: Factures[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          items.push(this.dataToFacture(data, i));
        }
      }
      this.factures.next(items);

    }).catch(err => {
      this.global.showAlert(JSON.stringify(err), 'Erreur', '');
    });
  }
  addFacture(date, item: Factures) {
    let data = [format(item.datec, "yyyy-MM-dd"), format(item.dated, "yyyy-MM-dd"), format(item.datef, "yyyy-MM-dd"), item.montant, item.ref, item.payer, item.abonne, 1, item.userid];
    return this.database.executeSql('INSERT INTO factures (datec,dated,datef, montant, ref,payer,abonne,etat,userid) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?)', data).then(data => {
      this.setFacidToRec(item, data.insertId);
    }).catch(err => {
      //this.global.showAlert(JSON.stringify(err), 'Erreur SQL', '');
    });;
  }

  setFacidToRec(item, id: number) {
    let date = "'" + format(new Date(item.dated), "yyyy-MM-dd") + "' AND '" + format(new Date(item.datef), "yyyy-MM-dd") + "'"
    let data = [id];
    let sql = "UPDATE recettes SET facid=? WHERE abonne=" + item.abonne + " and datec BETWEEN " + date
    return this.database.executeSql(sql, data).then(data => {
      this.loadFactures(date);
    });
  }
  soldeFacture(date, item: Factures) {
    return this.database.executeSql(`UPDATE factures SET payer='true' WHERE id = ${item.id}`, null).then(data => {
      let sql = "UPDATE recettes SET payer='true' WHERE facid=" + item.id
      this.database.executeSql(sql, null).then(data => {
        this.loadFactures(date);
      });
    });
  }
  deleteFacture(date, item: Factures) {
    return this.database.executeSql(`UPDATE factures SET etat=0 WHERE id = ${item.id}`, null).then(d => {
      let sql = "UPDATE recettes SET payer='false',facid=0 WHERE facid=" + item.id
      this.database.executeSql(sql, null).then(data => {
        this.loadFactures(date);
      });
    });
  }
  updateFacture(date, item: Factures) {
    let data = [item.payer, item.etat];
    return this.database.executeSql(`UPDATE factures SET payer=?,etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadFactures(date);
    });
  }
  getFactureByRef(id): Promise<Factures> {
    return this.database.executeSql('SELECT * FROM factures WHERE ref = ?', [id]).then(data => {
      return this.dataToFacture(data, 0);
    });
  }
  findRecetteByFacture(id): Observable<Recettes[]> {
    let items: Recettes[] = [];
    let sql = 'SELECT recettes.id,recettes.ordre,recettes.datec,recettes.prix, recettes.userid, ';
    sql += ' recettes.ref,recettes.tel,recettes.payer,recettes.effecter,recettes.categorie ,recettes.abonne,recettes.etat,';
    sql += ' categories.nom categorieName,categories.color categorieColor,abonnes.nom abonneName';
    sql += ' FROM recettes INNER JOIN categories ON categories.id = recettes.categorie ';
    sql += ' LEFT JOIN abonnes ON abonnes.id = recettes.abonne';
    sql += ' WHERE recettes.etat=1';
    sql += ' AND recettes.facid=' + id;
    sql += ' ORDER BY recettes.effecter,recettes.id ASC';
    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          items.push(this.dataToRecette(data, i));
        }
      }

    });
    let itemsOp = new BehaviorSubject([]);
    itemsOp.next(items);
    return itemsOp.asObservable();
  }
  dataToFacture(data, i) {
    return {
      id: data.rows.item(i).id,
      datec: data.rows.item(i).datec,
      dated: data.rows.item(i).dated,
      datef: data.rows.item(i).datef,
      montant: data.rows.item(i).montant,
      ref: data.rows.item(i).ref,
      payer: data.rows.item(i).payer,
      abonne: data.rows.item(i).abonne,
      abonneName: data.rows.item(i).abonneName,
      abonneTel: data.rows.item(i).abonneTel,
      abonneAdresse: data.rows.item(i).abonneAdresse,
      etat: data.rows.item(i).etat,
      userid: data.rows.item(i).userid
    };
  }
  /////////////////////////// Structures ////////////////////////////////////
  updateStructure(item: Structures) {
    let data = [item.nom, item.email, item.tel, item.address1, item.address2, item.nature, item.estactive];
    return this.database.executeSql(`UPDATE structures SET nom = ?, email = ?, tel = ?,address1=?,address2=?,nature=? ,estactive=?  WHERE id = ${item.id}`, data).then(data => {

    });
  }
  getStructure(): Promise<Structures> {
    return this.database.executeSql('SELECT * FROM structures WHERE id = 1', []).then(data => {
      return this.dataToStructure(data);
    }).catch(e => {
      this.global.showAlert(e, '', '');
      return null;
    });
  }

  dataToStructure(data) {
    return {
      id: data.rows.item(0).id,
      nom: data.rows.item(0).nom,
      email: data.rows.item(0).email,
      tel: data.rows.item(0).tel,
      address1: data.rows.item(0).address1,
      address2: data.rows.item(0).address2,
      nature: data.rows.item(0).nature,
      estactive: data.rows.item(0).estactive
    };
  }
  /////////////////////////// Users ////////////////////////////////////
  getUsers(): Observable<Users[]> {
    return this.users.asObservable();

  }
  loadUser() {
    return this.database.executeSql('SELECT * FROM users where etat=1', []).then(data => {
      let list: Users[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToUser(data, i));
        }
      }
      this.users.next(list);

    });
  }
  findUsers(): Observable<Users[]> {
    let items: Users[] = [];
    this.database.executeSql('SELECT * FROM users where etat=1 ', []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          items.push(this.dataToUser(data, i));
        }
      }

    });
    let itemsOp = new BehaviorSubject([]);
    itemsOp.next(items);
    return itemsOp.asObservable();
  }
  getUser(id): Promise<Users> {
    return this.database.executeSql('SELECT * FROM users WHERE id = ?', [id]).then(data => {
      return this.dataToUser(data, 0);
    });
  }
  addUser(item: Users) {
    let data = [item.pseudo, item.email, item.tel, item.estadmin, item.pin, 1];
    return this.database.executeSql('INSERT INTO users (pseudo, email, tel,estadmin,pin,etat) VALUES (?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadUser();
    }).catch(e => {
      this.global.showAlert(e, '', '');
      return null;
    });
  }
  updateUser(item: Users) {
    let data = [item.pseudo, item.email, item.tel, item.pin, item.estadmin, item.etat];
    return this.database.executeSql(`UPDATE users SET pseudo = ?, email = ?, tel = ?,pin = ?,estadmin=?,etat=? WHERE id = ${item.id}`, data).then(data => {
      this.loadUser();
    });
  }
  updateUserPwd(item: Users) {
    let data = [item.pin];
    return this.database.executeSql(`UPDATE users SET pin = ? WHERE id = ${item.id}`, data).then(data => {
      this.loadUser();
    });
  }
  deleteUser(item: Users) {
    let data = [item.etat];
    return this.database.executeSql(`UPDATE users SET etat=? WHERE id = ${item.id}`, data).then(data => {

    });
  }
  dataToUser(data, i) {
    return {
      id: data.rows.item(i).id,
      pseudo: data.rows.item(i).pseudo,
      email: data.rows.item(i).email,
      tel: data.rows.item(i).tel,
      pin: data.rows.item(i).pin,
      estadmin: data.rows.item(i).estadmin,
      etat: data.rows.item(i).etat,
    };
  }
  // async showToast(msg) {
  //   const toast = await this.tc.create({ message: msg, duration: 2000 });
  //   toast.present();
  // }

  /////////////////////////// Rapport ////////////////////////////////////
  getJournal(): Observable<Journal[]> {
    return this.journal.asObservable();
  }
  loadJournal(date, options) {
    let list = [];
    let sql = "";
    sql += ' SELECT datec, ref,categorieName,abonneName,recette,depense FROM ( ';
    sql += 'SELECT datec, ref,categories.nom categorieName,abonnes.nom abonneName,prix recette , 0 depense ';
    sql += ' FROM recettes INNER JOIN categories ON categories.id = recettes.categorie ';
    sql += ' LEFT JOIN abonnes ON abonnes.id = recettes.abonne';
    sql += ' WHERE recettes.etat=1 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND recettes.datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    sql += ' UNION ';
    sql += 'SELECT datec,ref,categories.nom categorieName,\'\' abonneName,0 recette, prix depense ';
    sql += ' FROM depenses INNER JOIN categories ON categories.id = depenses.categorie';
    sql += ' WHERE depenses.etat=1 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND depenses.datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND depenses.datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND depenses.datec BETWEEN ' + date;
    }
    sql += ') ORDER BY datec ASC';
    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToJournal(data, i));
        }
      }
      this.journal.next(list);
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }
  dataToJournal(data, i) {
    return {
      datec: data.rows.item(i).datec,
      ref: data.rows.item(i).ref,
      categorie: data.rows.item(i).categorieName,
      abonne: data.rows.item(i).abonneName,
      recette: data.rows.item(i).recette,
      depense: data.rows.item(i).depense,
    };
  }

  loadRecetteByCategorie(date, options) {
    let list = [];
    let sql = "";
    sql += ' SELECT categories.nom categorieName, SUM(prix) recette ';
    sql += ' FROM recettes INNER JOIN categories ON categories.id = recettes.categorie ';
    sql += ' WHERE recettes.etat=1 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND recettes.datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    sql += ' GROUP BY categories.id';

    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToJournal(data, i));
        }
      }
      this.journal.next(list);
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }

  loadDepenseByCategorie(date, options) {
    let list = [];
    let sql = "";
    sql += ' SELECT categories.nom categorieName, SUM(prix) depense ';
    sql += ' FROM depenses INNER JOIN categories ON categories.id = depenses.categorie ';
    sql += ' WHERE depenses.etat=1 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND depenses.datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND depenses.datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND depenses.datec BETWEEN ' + date;
    }
    sql += ' GROUP BY categories.id';

    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToJournal(data, i));
        }
      }
      this.journal.next(list);
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }
  loadRecetteByAbonne(date, options) {
    let list = [];
    let sql = "";
    sql += ' SELECT abonnes.nom abonneName, SUM(prix) recette ';
    sql += ' FROM recettes LEFT JOIN abonnes ON abonnes.id = recettes.abonne ';
    sql += ' WHERE recettes.etat=1 and abonnes.id>0 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND recettes.datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND recettes.datec BETWEEN ' + date;
    }
    sql += ' GROUP BY abonnes.id';

    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToJournal(data, i));
        }
      }
      this.journal.next(list);
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }

  getTotalRecetteDepenses(type, options, date): Promise<number> {

    let sql = "";
    sql += ' SELECT SUM(prix) montant ';
    if (type === 'R') {
      sql += ' FROM recettes ';
    }
    if (type === 'D') {
      sql += ' FROM depenses ';
    }
    sql += ' WHERE etat=1 and payer=\'true\'';
    if (options === 'jour') {
      sql += ' AND datec=\'' + date + '\'';
    }
    if (options === 'mois') {
      sql += ' AND datec BETWEEN ' + date;
    }
    if (options === 'semaine') {
      sql += ' AND datec BETWEEN ' + date;
    }
    if (options === 'annee') {
      sql += ' AND datec BETWEEN ' + date;
    }
    return this.database.executeSql(sql, []).then(data => {

      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));;
  }

  getTotalFacture(abonne, date): Promise<number> {
    let sql = "";
    sql += ' SELECT SUM(prix) montant ';
    sql += ' FROM recettes ';
    sql += ' WHERE etat=1 and facid=0 and payer=\'false\'';
    sql += ' AND abonne=' + abonne;
    sql += ' AND datec BETWEEN ' + date;
    //this.global.showAlert(sql, 'error', '');
    return this.database.executeSql(sql, []).then(data => {

      if (data.rows.length > 0) {
        let m = data.rows.item(0).montant;
        if (m) { return m; } else { return 0 };
      }
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));;
  }

  getMaxIdFacture(): Promise<number> {
    let year = new Date().getFullYear();
    let sql = "";
    sql += ' SELECT COUNT(id) id ';
    sql += ' FROM factures ';
    sql += ' WHERE STRFTIME(\'%Y\', datec)=\'' + year + '\'';
    //this.global.showAlert(sql, 'error', '');
    return this.database.executeSql(sql, []).then(data => {

      if (data.rows.length > 0) {
        let m = data.rows.item(0).id;
        if (m) { return m + 1; } else { return 1 };
      }
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));;
  }

  loadResultatMensuel(year) {
    this.loadingService.loadingPresent();
    let list = [];
    let sql = "";
    sql += ' SELECT categorieName,SUM(recette) recette,SUM(depense) depense FROM (';
    sql += ' SELECT STRFTIME(\'%m\', datec) categorieName, SUM(prix) recette , 0 depense';
    sql += ' FROM recettes ';
    sql += ' WHERE recettes.etat=1  and payer=\'true\'';
    sql += ' AND STRFTIME(\'%Y\', datec)=\'' + year + '\'';
    sql += ' GROUP BY STRFTIME(\'%m\', datec)';
    sql += ' UNION ';
    sql += ' SELECT STRFTIME(\'%m\', datec) categorieName, 0 recette, SUM(prix) depense ';
    sql += ' FROM depenses ';
    sql += ' WHERE depenses.etat=1 and payer=\'true\'';
    sql += ' AND STRFTIME(\'%Y\', datec)=\'' + year + '\'';
    sql += ' GROUP BY STRFTIME(\'%m\', datec)';
    sql += ' ) GROUP BY categorieName';
    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          list.push(this.dataToJournal(data, i));
        }
      }
      this.journal.next(list);
      this.loadingService.loadingDismiss();
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }

  loadSituationImpaye(year) {
    this.loadingService.loadingPresent();
    let list = [];
    let sql = "";
    sql += 'SELECT datec, ref,categories.nom categorieName,abonnes.nom abonneName,abonnes.tel tel,prix recette , 0 depense ';
    sql += ' FROM recettes INNER JOIN categories ON categories.id = recettes.categorie ';
    sql += ' LEFT JOIN abonnes ON abonnes.id = recettes.abonne';
    sql += ' WHERE recettes.etat=1 and payer=\'false\'';
    sql += ' AND STRFTIME(\'%Y\', datec)=\'' + year + '\'';

    this.database.executeSql(sql, []).then(data => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let d = {
            datec: data.rows.item(i).datec,
            ref: data.rows.item(i).ref,
            categorie: data.rows.item(i).categorieName,
            abonne: data.rows.item(i).abonneName,
            tel: data.rows.item(i).tel,
            recette: data.rows.item(i).recette,

          };
          list.push(d);
        }
      }
      this.journal.next(list);
      this.loadingService.loadingDismiss();
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));
  }

  getNbRecette(): Promise<number> {
    let sql = "";
    sql += ' SELECT COUNT(id) id ';
    sql += ' FROM recettes ';
    //this.global.showAlert(sql, 'error', '');
    return this.database.executeSql(sql, []).then(data => {

      if (data.rows.length > 0) {
        let m = data.rows.item(0).id;
        if (m) { return m; } else { return 1 };
      }
    }).catch(e => this.global.showAlert(JSON.stringify(e), '', ''));;
  }

}
