import { Component } from '@angular/core';
import { StateService } from '../../services/rxjs/state.service';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.scss'],
  providers: []
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
