import { Component, OnDestroy } from '@angular/core';
import { InfectionTreeComponent } from '../infection-tree/infection-tree.component';
import { SliderComponent } from '../slider/slider.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, InfectionTreeComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  popSize: number = 25;

  private sliderInput$ = new Subject<number>(); // 🔁 reactive value stream
  private subscription = this.sliderInput$.pipe(
    debounceTime(200)
  ).subscribe(value => {
    this.popSize = value;
    console.log('Debounced value:', value);
  });

  onSliderChange(value: number) {
    this.sliderInput$.next(value); // 👈 send value into Subject
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // 💡 always clean up
  }
}
