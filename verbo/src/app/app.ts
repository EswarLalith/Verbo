import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Project } from './project/project';
import { Bottomnav } from './bottomnav/bottomnav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Project, Bottomnav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('verbo');
}
