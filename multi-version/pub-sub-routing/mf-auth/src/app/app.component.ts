import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { connectRouter } from './connect-router';
import { MatButtonModule } from '@angular/material/button';
import PubSub from 'pubsub-js';
import { ROUTING_CONSTANTS, RoutingAPI } from 'micro-frontends-config-lib';

declare var require: any;
const packageJson = require('../../package.json');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private readonly router = inject(Router);

  isDarkMode = signal(false);
  title = signal('mf-auth');
  ngVersion = signal(packageJson.dependencies['@angular/core']);
  materialVersion = signal(packageJson.dependencies['@angular/material']);

  constructor() {
    connectRouter();
  }

  ngOnInit(): void {
    this.subscribeToPubSubRoutingEvents();
  }

  private subscribeToPubSubRoutingEvents() {
    PubSub.subscribe(
      ROUTING_CONSTANTS.NOTIFYMF,
      (__, { url, state }: RoutingAPI) => {
        if (url.includes('authentication')) {
          this.router.navigate([url], { state: state });
        }
      }
    );
  }

  ngOnDestroy(): void {
    PubSub.unsubscribe(ROUTING_CONSTANTS.NOTIFYMF);
  }
}
