import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { AuthService } from '../services/auth.service';
import { switchMap, shareReplay } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { DeckFormComponent } from './deck-form/deck-form.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(
    public router: Router
    , public db: DbService
    , public auth: AuthService
    , public modal: ModalController
  ) { }

  decks;

  ngOnInit() {
    this.decks = this.auth.user$.pipe(
      switchMap(user =>
        this.db.collection$('decks', ref =>
          ref
            .where('uid', '==', user.uid)
            .orderBy('createdDate', 'desc')
        )
      ),
      shareReplay(1)
    );
  }

  // delete
  deleteDeck(deck: any) {
    this.db.delete(`decks/${deck.id}`);
  }

  // create

  async presentDeckForm(deck?: any) {
    const modal = await this.modal.create({
      component: DeckFormComponent,
      componentProps: { deck }
    });

    return await modal.present();
  }

  trackById(idx, deck) {
    return deck.id;
  }

  moveToDeckDetail(deck: any) {
    // TODO: How can I get current natigate URL?
    this.router.navigate(['tabs', 'decks', deck.id]);
  }

}
