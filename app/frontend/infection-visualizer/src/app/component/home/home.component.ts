import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  sliderValue = 0;

  onSliderChange(value: number) {
    this.sliderValue = value;
    console.log('Received from slider:', value);
  }
}
