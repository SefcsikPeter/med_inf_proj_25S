import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {SliderComponent} from '../slider/slider.component';
import {SymbolsEnum} from '../../model/symbols.enum';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
export class SliderWrapperComponent implements OnInit{
  @Input() showSliders: boolean = false;
  @Input() sliders: any[] = [];
  sliderSubjects: Record<string, Subject<number>> = {};
  sliderValues: Record<string, number> = {};


  protected readonly SymbolsEnum = SymbolsEnum;

  ngOnInit(): void {
    for (const slider of this.sliders) {
      const key = slider.type;

      this.sliderSubjects[key] = new Subject<number>();

      this.sliderSubjects[key]
        .pipe(debounceTime(100))
        .subscribe(value => {
          this.sliderValues[key] = value;
        });
    }
  }
}
