import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController, ToastController } from '@ionic/angular';
import { switchMap, tap, shareReplay, map, takeWhile } from 'rxjs/operators';
import { CardFormComponent } from '../card-form/card-form.component';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.scss'],
})
export class DeckDetailComponent implements OnInit {

  deck;

  cards;
  filtered;

  isFront: boolean;
  stageCount: number[] = [0, 0, 0, 0, 0, 0];

  filter = new BehaviorSubject(null);

  constructor(
    private route: ActivatedRoute
    , public db: DbService
    , public auth: AuthService
    , public modal: ModalController
    , public toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { deck: any }) => {
        console.log(JSON.stringify(data));
        this.deck = data.deck;
        this.isFront = true;
      });

    this.cards = this.auth.user$.pipe(
      switchMap(user => {
        console.log(this.deck);
        return this.db.collection$('cards', ref =>
        ref
          .where('uid', '==', user.uid)
          .where('deckid', '==', this.deck.deckid)
          .orderBy('modifiedDate', 'asc')
        )
      }
        
      ),
      // TODO: Manage stage count in the cloud functions
      tap(ref =>  {
        this.stageCount.forEach((element, stage) => {
          const filteredArr = ref.filter((obj: any) => obj.stage === stage);
          this.stageCount[stage] = filteredArr.length;
        });
        console.log(`Total: ${ref.length}, Stage count: ${this.stageCount}`);
      }),
      // set card direction to front
      tap(_ => this.isFront = true),
      shareReplay(1)
    );

    // TODO: Understanding this code
    // Get first item with specific stage
    this.filter.pipe(
      switchMap(stage => {
        return this.cards.pipe(
          map(arr =>
            (arr as any[]).filter(
              obj => (stage ? obj.stage === stage : true)
            )
          )
        );
      })
    ).subscribe(cards => {
      this.filtered = cards[0];
    });

    this.updateFilter(1);
  }

  updateFilter(val) {
    this.filter.next(Number.parseInt(val, 10));
    this.isFront = true;
  }

  async presentCardForm(card?: any) {

    const modal = await this.modal.create({
      component: CardFormComponent,
      componentProps: { card, deck: this.deck }
    });

    return await modal.present();
  }

  flipCard() {
    this.isFront = !this.isFront;
  }

  fillStage() {
    this.cards.pipe(
      map(arr =>
        (arr as any[]).filter(
          obj => obj.stage === 0)
        ),
      // take(this.isStageFull(1) ? 0 : 1)
      takeWhile(_ => !this.isStageFull(1))
    ).subscribe(querySnapshot => {
      if (!this.isStageFull(1)) {
        querySnapshot[0].stage = 1;
        querySnapshot[0].modifiedDate = Date.now();
        const id = querySnapshot[0].id;
        delete querySnapshot[0].id;
        this.db.updateAt(`cards/${id}`, querySnapshot[0]);
      }
    });
  }

  isStageFull(stage): boolean {
    let isFull = false;

    switch (stage) {
      case 1:
        isFull = this.stageCount[1] >= 30 ? true : false;
        break;
      case 2:
        isFull = this.stageCount[2] >= 30 * 2 ? true : false;
        break;
      case 3:
        isFull = this.stageCount[3] >= 30 * 5 ? true : false;
        break;
      case 4:
        isFull = this.stageCount[4] >= 30 * 8 ? true : false;
        break;
      case 5:
        isFull = this.stageCount[5] >= 30 * 15 ? true : false;
        break;
    }

    return isFull;
  }

  success() {
    // When the stage of the card is not more than 5 and not full
    if (this.filtered.stage !== 5 && !this.isStageFull(this.filtered.stage + 1)) {
      this.filtered.stage++;
      this.filtered.modifiedDate = Date.now();
      // TODO: implement card history
      // this.filtered.repetition++;

      const id = this.filtered.id;
      delete this.filtered.id;
      console.table({ id, ...this.filtered});
      this.db.updateAt(`cards/${id}`, this.filtered);

      this.presentToast('success', 'success');
    } else {
      this.presentToast('Next stage is full or end of stage...', 'tertiary');
    }

  }

  fail() {
    // When the stage of the card is not 1 and there is room for stage 1
    if (this.filtered.stage !== 1 && !this.isStageFull(1)) {
      this.filtered.stage = 1;
      this.filtered.modifiedDate = Date.now();
      // TODO: implement card history
      // this.filtered.repetition++;
      const id = this.filtered.id;
      delete this.filtered.id;
      console.table({ id, ...this.filtered});
      this.db.updateAt(`cards/${id}`, this.filtered);

      this.presentToast('fail', 'danger');
    } else if (this.filtered.stage === 1) {
      this.filtered.modifiedDate = Date.now();
      // TODO: implement card history
      // this.filtered.repetition++;
      const id = this.filtered.id;
      delete this.filtered.id;
      console.table({ id, ...this.filtered});
      this.db.updateAt(`cards/${id}`, this.filtered);

      this.presentToast('fail', 'danger');
    } else {
      this.presentToast('Stage 1 is full...', 'tertiary');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      buttons: [
        {
          text: 'undo'
          , role: 'cancel'
        }
      ],
      duration: 1000,
      color: color
    });
    toast.present();
  }

  openBrowser(url) {
    console.log(url);
    // Only use for native
    // const browser = this.iab.create(url);

    // PWA
    window.open(url, '_blank');
  }

}
