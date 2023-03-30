import { Component } from '@angular/core';
import { StateAltService } from '../../services/rxjs/state-alt.service';

@Component({
  selector: 'app-rxjs-alt',
  templateUrl: './rxjs-alt.component.html',
  styleUrls: ['./rxjs-alt.component.scss'],
  providers: [
    // Local providers are specific to this component and its children
    // A specific copy of that provider is created and is considered "local"
    // for that reason
    // By uncommented this line, state will be erased when you navigate away
    // from this page
    // StateAltService// <-- uncomment to make StateService a local state
  ]
})
export class RxjsAltComponent {
  readonly pages = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  posts$ = this.stateService.posts$;
  page$ = this.stateService.page$;

  constructor(private readonly stateService: StateAltService) {}

  setPage(page: number): void {
    this.stateService.setPage$.next(page);
  }
}
