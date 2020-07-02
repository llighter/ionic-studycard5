import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { first, tap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PreloardGuard implements Resolve<any> {

  constructor(
    private afs: AngularFirestore
    , private router: Router
  ) {}

  resolve(
    next: ActivatedRouteSnapshot
    , state: RouterStateSnapshot): Observable<any> {
      // TODO: Check if this code can intergrated with db service..
      const id = next.paramMap.get('id');
      console.log(`[*]current id: ${id}`);

      return this.afs
        .collection('decks')
        .doc(id)
        .valueChanges()
        .pipe(
          first(),
          map(doc => {
            return  { deckid: id, ...(doc as {})};
          }),
          tap(deck => {
            if (!deck) {
              alert(`This deck dosn't exit!`);
              this.router.navigate(['/']);
            } else {
              console.log(`[+] deck's title is ${deck.title}`);
            }
          })
        );
    }
}