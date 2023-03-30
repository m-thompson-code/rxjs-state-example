// Needed for stackblitz to host properly
// import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => {
    console.error(
      'If this is on stackblitz, be sure to uncomment the line above to import zone.js'
    );
    console.error(err);
  });
