import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout/layout.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withFetch  } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(LayoutComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule)
  ]
}).catch((err) => console.error(err));
