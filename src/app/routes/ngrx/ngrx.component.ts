import { Component } from '@angular/core';
import { StateStore } from '../../services/ngrx/state.store';

@Component({
  selector: 'app-ngrx',
  templateUrl: './ngrx.component.html',
  styleUrls: ['./ngrx.component.scss'],
  providers: [
    // Local providers are specific to this component and its children
    // A specific copy of that provider is created and is considered "local"
    // for that reason
    // By uncommented this line, state will be erased when you navigate away
    // from this page
    // StateStore// <-- uncomment to make StateService a local state
  ]
})
export class NgrxComponent {
  readonly pages = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  posts$ = this.stateStore.posts$;
  page$ = this.stateStore.page$;

  constructor(private readonly stateStore: StateStore) {}

  setPage(page: number): void {
    this.stateStore.setPage(page);
  }
}
