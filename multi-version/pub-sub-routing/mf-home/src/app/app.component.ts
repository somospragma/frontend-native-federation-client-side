import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ROUTING_CONSTANTS, RoutingAPI } from 'micro-frontends-config-lib';
import { connectRouter } from './connect-router';
import PubSub from 'pubsub-js';

declare var require: any;
const packageJson = require('../../package.json');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly router = inject(Router);

  title = signal('mf-home');
  ngVersion = signal(packageJson.dependencies['@angular/core']);
  primeNgVersion = signal(packageJson.dependencies['primeng']);

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
        if (url.includes('home')) {
          this.router.navigate([url], { state: state });
        }
      }
    );
  }

  ngOnDestroy(): void {
    PubSub.unsubscribe(ROUTING_CONSTANTS.NOTIFYMF);
  }
}
