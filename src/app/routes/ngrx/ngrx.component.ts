import { Component } from '@angular/core';
import { StateStore } from '../../services/ngrx/state.store';

@Component({
  selector: 'app-ngrx',
  templateUrl: './ngrx.component.html',
  styleUrls: ['./ngrx.component.scss']
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
