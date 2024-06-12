import { createApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { NgZone } from '@angular/core';
import { createCustomElement } from '@angular/elements';

(async () => {
  const app = await createApplication({
    providers: [
      (globalThis as any).ngZone
        ? { provide: NgZone, useValue: (globalThis as any).ngZone }
        : [],
      provideRouter(routes),
    ],
  });

  const mfAuthenticationRoot = createCustomElement(AppComponent, {
    injector: app.injector,
  });

  customElements.define('mf-home-root', mfAuthenticationRoot);
})();
