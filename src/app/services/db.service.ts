import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private afs: AngularFirestore) { }

  collection$ (path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        })
      );
  }

  doc$ (path) {
    return this.afs
      .doc(path)
      .valueChanges()
      .pipe(
        map(doc => {
          // TODO: Check doc.payload.data
          return doc;
        })
      );
  }

  /**
   * @param {string} path 'collection' or 'collection/docID'
   * @param {object} data new data
   *
   * Create or updates data on a collection or document.
   */
  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
      // Odd is always a collection
      return this.afs.collection(path).add(data);
    } else {
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  /**
   * @param {string} path path to document
   *
   * Deletes document from Firestore
   */
  delete(path: string) {
    return this.afs.doc(path).delete();
  }
}


