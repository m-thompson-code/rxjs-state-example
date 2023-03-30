import { Component } from '@angular/core';
import { StateStore } from './services/ngrx/state.store';
import { StateAltService } from './services/rxjs/state-alt.service';
import { StateService } from './services/rxjs/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // Component stores are used for global and local state
  // To be "global", just provide them at the root component
  // To be "local", provide a copy at that local component's scope
  providers: [StateService, StateStore, StateAltService]
})
export class AppComponent {}
