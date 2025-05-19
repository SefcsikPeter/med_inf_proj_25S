import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-slider-wrapper',
  imports: [],
  standalone: true,
  templateUrl: './slider-wrapper.component.html',
  styleUrl: './slider-wrapper.component.css'
})
export class SliderWrapperComponent {
  @Input showSliders: boolean = false;

}
