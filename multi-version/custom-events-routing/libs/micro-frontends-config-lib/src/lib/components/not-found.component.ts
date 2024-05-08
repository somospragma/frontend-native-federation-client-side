import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterState, RoutingAPI } from './routing-api.interface';
import { RoutingNotifier } from '../utils/routing-notifier.util';

@Component({
  selector: 'app-not-found',
  template: '',
  standalone: true,
})
export class NotFoundComponent {
  private readonly location = inject(Location);

  constructor() {
    const routingApi: RoutingAPI = {
      url: `${location.pathname.substring(1)}${location.search}`,
      state: this.location.getState() as RouterState,
    };

    RoutingNotifier.notifyHost(routingApi);
  }
}
