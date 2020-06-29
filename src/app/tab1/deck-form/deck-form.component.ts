import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-deck-form',
  templateUrl: './deck-form.component.html',
  styleUrls: ['./deck-form.component.scss'],
})
export class DeckFormComponent implements OnInit {

  constructor(
    private db: DbService
    , private fb: FormBuilder
    , private auth: AuthService
    , public modal: ModalController
  ) { }

  deckForm: FormGroup;

  deck;

  ngOnInit() {
    const data = {
      title: '',
      ...this.deck
    };

    this.deckForm = this.fb.group({
      title: [
        data.title,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(40)
        ]
      ]
    });
  }

  async createDeck() {
    const uid = await this.auth.uid();
    const id = this.deck ? this.deck.id : '';
    // TODO: is it right?
    // delete this.deck.id;

    const data = {
      uid,
      createdDate: Date.now(),
      ...this.deck,
      ...this.deckForm.value,
      modifiedDate: Date.now()
    };
    this.db.updateAt(`decks/${id}`, data);
    this.modal.dismiss();
  }

  cancel() {
    this.modal.dismiss();
  }

}
