import { Component } from '@angular/core';
import { StateService } from '../../services/rxjs/state.service';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.scss'],
  providers: [
    // Local providers are specific to this component and its children
    // A specific copy of that provider is created and is considered "local"
    // for that reason
    // By uncommented this line, state will be erased when you navigate away
    // from this page
    // StateService// <-- uncomment to make StateService a local state
  ]
})
export class RxjsComponent {
  readonly pages = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  posts$ = this.stateService.posts$;
  page$ = this.stateService.page$;

  constructor(private readonly stateService: StateService) {}

  setPage(page: number): void {
    this.stateService.setPage$.next(page);
  }
}
