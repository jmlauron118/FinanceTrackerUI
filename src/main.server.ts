import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout/layout.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(LayoutComponent, config, context);

export default bootstrap;
