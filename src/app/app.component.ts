import {Component, ElementRef, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DateComponent} from "./date/date.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DateComponent, JsonPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  control = new FormControl();
}
