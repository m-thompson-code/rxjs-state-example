import { Component } from '@angular/core';
import { StateStore } from './services/ngrx/state.store';
import { StateService } from './services/rxjs/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StateService, StateStore]
})
export class AppComponent {
  title = 'rxjs-state';
}
