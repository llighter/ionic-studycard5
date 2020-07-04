import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent implements OnInit {

  constructor(
    private auth: AuthService
    , private db: DbService
    , public modal: ModalController
    , private fb: FormBuilder
  ) { }

  cardForm: FormGroup;

  card;
  deck;

  ngOnInit() {
    const data = {
      question: ''
      , answer: ''
      , source: ''
      , ...this.card
    };

    this.cardForm = this.fb.group({
      question: [
        data.question,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ]
      ],
      source: [
        data.source,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ]
      ],
      answer: [
        data.answer,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ]
      ]
    });
  }

  async createCard() {
    const uid = await this.auth.uid();
    const id = this.card ? this.card.id : '';
    const data = {
      uid,
      createdDate: Date.now(),
      deckid: this.deck.deckid,
      stage: 0,
      ...this.card,
      ...this.cardForm.value,
      modifiedDate: Date.now()
    };

    delete data.id;
    this.db.updateAt(`cards/${id}`, data);
    this.modal.dismiss();
  }

  cancel() {
    this.modal.dismiss();
  }

}
