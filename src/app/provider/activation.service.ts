import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Licence } from '../models/licence';
import { GlobalService } from './global.service';
import { format } from "date-fns";

@Injectable({
    providedIn: 'root'
})
export class ActivationService {
    collectionLicences: any;
    constructor(
        private firestore: AngularFirestore,
        public global: GlobalService
    ) {
        this.collectionLicences = this.firestore.collection("licences");
    }
    getcollection() {
        return this.collectionLicences;
    }

    addLicenceTest() {
        const licence = new Licence();
        licence.id = this.global.randomPhoneNumber('+223', 8);
        licence.type = 'E';
        licence.commerce = 'Lif';
        licence.isActive = false;
        licence.date = format(new Date(), "yyyy-MM-dd");
        licence.key = this.global.randomString(6);

        this.collectionLicences.doc(licence.id).set({
            commerce: licence.commerce,
            date: licence.date,
            key: licence.key,
            isActive: licence.isActive,
            type: licence.type
        }).then(data => {
            console.log("Document successfully written!");
            return data
        }).catch(err => {
            this.global.showErrorAlert(err);
            console.error("Error writing document: ", err);
        });
    }

    addLicence(licence: Licence) {
        this.collectionLicences.doc(licence.id).set({
            commerce: licence.commerce,
            date: licence.date,
            key: licence.key,
            isActive: licence.isActive,
            type: licence.type
        }).then(data => {
            console.log("Document successfully written!");
            return data
        }).catch(err => {
            this.global.showErrorAlert(err);
            console.error("Error writing document: ", err);
        });
    }
    updateLicence(id, licence: Licence) {
        this.collectionLicences.doc(id).update({
            isActive: licence.isActive
        }).then(data => {
            console.log("Document successfully written!");
        }).catch(err => {
            console.error("Error writing document: ", err);
        });
    }
    getLicences() {
        return this.firestore.collection('licences').snapshotChanges();
    }
    getLicence(id: string) {
        return this.collectionLicences.doc(id).get();
    }
    // updateLicence(recordID, record) {
    //     this.firestore.doc('licences/' + recordID).update(record);
    // }

    deleteLicence(record_id) {
        this.firestore.doc('licences/' + record_id).delete();
    }
    // private licences: Observable<Licence[]>;
    // private licenceCollection: AngularFirestoreCollection<Licence>;

    // constructor(private afs: AngularFirestore) {
    //     this.licenceCollection = this.afs.collection<Licence>('licences');
    //     this.licences = this.licenceCollection.snapshotChanges().pipe(
    //         map(actions => {
    //             return actions.map(a => {
    //                 const data = a.payload.doc.data();
    //                 const id = a.payload.doc.id;
    //                 return { id, ...data };
    //             });
    //         })
    //     );
    // }

    // getLicences(): Observable<Licence[]> {
    //     return this.licences;
    // }

    // getLicence(id: string): Observable<Licence> {
    //     return this.licenceCollection.doc<Licence>(id).valueChanges().pipe(
    //         take(1),
    //         map(licence => {
    //             licence.id = id;
    //             return licence
    //         })
    //     );
    // }

    // addLicence(licence: Licence): Promise<DocumentReference> {
    //     return this.licenceCollection.add(licence);
    // }

    // updateLicence(licence: Licence): Promise<void> {
    //     return this.licenceCollection.doc(licence.id).update({ imei: licence.imei, key: licence.key });
    // }

    // deleteLicence(id: string): Promise<void> {
    //     return this.licenceCollection.doc(id).delete();
    // }
}
