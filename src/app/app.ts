import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from "./board/board.component";

@Component({
  selector: 'app-root',
  imports: [BoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('agile-task-manager');
}
