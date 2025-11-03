import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout/layout.component';
import { config } from './app/app.config.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from 'app/app.component';

const bootstrap = (context: BootstrapContext) => 
    bootstrapApplication(AppComponent, {
        ...config,
        providers: [
            ...config.providers || [],
            provideHttpClient(withFetch())
        ]
    }, context);

export default bootstrap;
