import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { PreloardGuard } from '../guards/preload.guard';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: ':id',
    component: DeckDetailComponent,
    resolve: {
      deck: PreloardGuard
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
