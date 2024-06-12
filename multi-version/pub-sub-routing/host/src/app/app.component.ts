import {
  Component,
  inject,
  NgZone,
  signal,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
  RouterState,
} from '@angular/router';
import PubSub from 'pubsub-js';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { ROUTING_CONSTANTS, RoutingAPI } from 'micro-frontends-config-lib';

declare var require: any;
const packageJson = require('../../package.json');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private subscription!: Subscription;

  isDarkMode = signal(false);
  title = signal('host');
  ngVersion = signal(packageJson.dependencies['@angular/core']);
  primeNgVersion = signal(packageJson.dependencies['primeng']);

  constructor() {
    (globalThis as any).ngZone = inject(NgZone);
  }

  ngOnInit() {
    this.subscribeToPubSubRoutingEvents();
    this.subscribeToHostRoutingChanges();
  }

  private subscribeToPubSubRoutingEvents() {
    PubSub.subscribe(ROUTING_CONSTANTS.NOTIFYHOST, (__, data: RoutingAPI) => {
      this.router.navigate([data.url], { state: data.state });
    });
  }

  private subscribeToHostRoutingChanges() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        PubSub.publish(ROUTING_CONSTANTS.NOTIFYMF, {
          url: event.urlAfterRedirects,
          state: this.location.getState() as RouterState,
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    PubSub.unsubscribe(ROUTING_CONSTANTS.NOTIFYHOST);
  }
}
