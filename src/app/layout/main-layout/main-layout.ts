import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../app-header/app-header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, AppHeader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}

