import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {SliderComponent} from '../slider/slider.component';
import {SymbolsEnum} from '../../model/symbols.enum';

@Component({
  selector: 'app-slider-wrapper',
  imports: [
    NgIf,
    SliderComponent
  ],
  standalone: true,
  templateUrl: './slider-wrapper.component.html',
  styleUrl: './slider-wrapper.component.css'
})
export class SliderWrapperComponent {
  @Input() showSliders: boolean = false;
  @Input() sliders: any[] = [];

  protected readonly SymbolsEnum = SymbolsEnum;
}
