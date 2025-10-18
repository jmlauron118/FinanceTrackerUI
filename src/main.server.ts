import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout/layout.component';
import { config } from './app/app.config.server';
import { provideHttpClient, withFetch } from '@angular/common/http';

const bootstrap = (context: BootstrapContext) => 
    bootstrapApplication(LayoutComponent, {
        ...config,
        providers: [
            ...config.providers || [],
            provideHttpClient(withFetch())
        ]
    }, context);

export default bootstrap;
