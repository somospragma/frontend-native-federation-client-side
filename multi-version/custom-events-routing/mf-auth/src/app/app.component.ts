import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { connectRouter } from './connect-router';
import { MatButtonModule } from '@angular/material/button';
import { RoutingAPI } from 'micro-frontends-config-lib';

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

  @HostListener('document:notifyMf', ['$event'])
  onNotifyMFNavigate({ detail: { url, state } }: CustomEvent<RoutingAPI>) {
    if (url.includes('authentication')) {
      this.router.navigate([url], { state });
    }
  }

  constructor() {
    connectRouter();
  }

  navigateTo(path: string): void {
    this.router.navigate([path], { state: { pruebas: 'hola' } });
  }
}
