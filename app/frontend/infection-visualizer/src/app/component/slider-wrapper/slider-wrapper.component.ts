import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, OnDestroy } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { SliderComponent } from '../slider/slider.component';
import { SymbolsEnum } from '../../model/symbols.enum';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-slider-wrapper',
  imports: [NgIf, NgClass, SliderComponent],
  standalone: true,
  templateUrl: './slider-wrapper.component.html',
  styleUrl: './slider-wrapper.component.css'
})
export class SliderWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @Input() showSliders = false;
  @Input() sliders: any[] = [];
  @Input() containerClass: string | string[] = 'visualization-container--md';

  @Output() sliderValuesChange = new EventEmitter<Record<string, number>>();

  sliderSubjects: Record<string, Subject<number>> = {};
  sliderSubs: Record<string, Subscription> = {};
  sliderValues: Record<string, number> = {};

  protected readonly SymbolsEnum = SymbolsEnum;

  ngOnInit(): void {
    this.initFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sliders'] || changes['showSliders']) {
      this.initFromInputs();
    }
  }

  ngOnDestroy(): void {
    Object.values(this.sliderSubs).forEach(sub => sub.unsubscribe());
  }

  onSliderValueChange(key: string, value: number) {
    this.ensureSubject(key);
    this.sliderSubjects[key].next(value);
  }

  initFromInputs(): void {
    if (!this.showSliders || !this.sliders?.length) return;
    for (const slider of this.sliders) {
      const key = slider.type;
      this.ensureSubject(key);
      if (typeof this.sliderValues[key] !== 'number') {
        this.sliderValues[key] = slider.current_value;
      }
    }
    this.sliderValuesChange.emit({ ...this.sliderValues });
  }

  ensureSubject(key: string): void {
    if (!this.sliderSubjects[key]) {
      const subj = new Subject<number>();
      this.sliderSubjects[key] = subj;
      this.sliderSubs[key] = subj
        .pipe(debounceTime(100))
        .subscribe(value => {
          this.sliderValues[key] = value;
          this.sliderValuesChange.emit({ ...this.sliderValues });
        });
    }
  }
}
