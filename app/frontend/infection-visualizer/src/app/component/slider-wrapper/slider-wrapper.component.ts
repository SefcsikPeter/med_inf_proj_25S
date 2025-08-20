import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgIf, NgClass} from '@angular/common';
import {SliderComponent} from '../slider/slider.component';
import {SymbolsEnum} from '../../model/symbols.enum';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-slider-wrapper',
  imports: [
    NgIf,
    NgClass,
    SliderComponent
  ],
  standalone: true,
  templateUrl: './slider-wrapper.component.html',
  styleUrl: './slider-wrapper.component.css'
})
export class SliderWrapperComponent implements OnInit{
  @Input() showSliders: boolean = false;
  @Input() sliders: any[] = [];
  @Input() containerClass: string | string[] = 'visualization-container--md';

  @Output() sliderValuesChange = new EventEmitter<Record<string, number>>();

  sliderSubjects: Record<string, Subject<number>> = {};
  sliderValues: Record<string, number> = {};


  protected readonly SymbolsEnum = SymbolsEnum;

  ngOnInit(): void {
    if (this.showSliders) {
      for (const slider of this.sliders) {
        const key = slider.type;

        this.sliderSubjects[key] = new Subject<number>();

        this.sliderSubjects[key]
          .pipe(debounceTime(100))
          .subscribe(value => {
            this.sliderValues[key] = value;
            this.sliderValuesChange.emit({ ...this.sliderValues });
          });
      }
    }
  }

  onSliderValueChange(key: string, value: number) {
    this.sliderSubjects[key].next(value);
  }
}
