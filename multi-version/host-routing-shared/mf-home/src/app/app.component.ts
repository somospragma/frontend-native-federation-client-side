import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { connectRouter } from './connect-router';
import { ButtonModule } from 'primeng/button';

declare var require: any;
const packageJson = require('../../package.json');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = signal('mf-home');
  ngVersion = signal(packageJson.dependencies['@angular/core']);
  primeNgVersion = signal(packageJson.dependencies['primeng']);

  constructor() {
    connectRouter();
  }
}
