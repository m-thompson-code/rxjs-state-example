import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { RxjsComponent } from './routes/rxjs/rxjs.component';
import { RxjsAltComponent } from './routes/rxjs-alt/rxjs-alt.component';
import { NgrxComponent } from './routes/ngrx/ngrx.component';
import { RootComponent } from './routes/root/root.component';

const routes: Routes = [
  { path: '', component: RootComponent },
  { path: 'rxjs', component: RxjsComponent },
  { path: 'rxjs-alt', component: RxjsAltComponent },
  { path: 'ngrx', component: NgrxComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RxjsComponent,
    RxjsAltComponent,
    NgrxComponent,
    RootComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
