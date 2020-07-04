import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { DeckFormComponent } from './deck-form/deck-form.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { CardFormComponent } from './card-form/card-form.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [
    Tab1Page,
    DeckFormComponent,
    DeckDetailComponent,
    CardFormComponent
  ],
  entryComponents: [DeckFormComponent]
})
export class Tab1PageModule {}
