import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RoutingAPI } from 'micro-frontends-config-lib';
import { connectRouter } from './connect-router';

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

  @HostListener('document:notifyMf', ['$event'])
  onNotifyMFNavigate({ detail: { url, state } }: CustomEvent<RoutingAPI>) {
    if (url.includes('home')) {
      this.router.navigate([url], { state });
    }
  }

  constructor() {
    connectRouter();
  }
}
