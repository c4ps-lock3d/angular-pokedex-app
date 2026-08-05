import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Import chart.js/auto to register all plugins
import 'chart.js/auto';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
