import { Component, OnDestroy } from '@angular/core';
import { InfectionTreeComponent } from '../infection-tree/infection-tree.component';
import { SliderComponent } from '../slider/slider.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {StoryCardComponent} from '../story-card/story-card.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, InfectionTreeComponent, StoryCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  popSize: number = 25;

  stories = [
    { title: 'Story 1', progress: 100, id: 1 },
    { title: 'Story 2', progress: 100, id: 2 },
    { title: 'Story 3', progress: 20,  id: 3 },
    { title: 'Story 4', progress: 0,   id: 4 },
    { title: 'Story 5', progress: 0,   id: 5 },
    { title: 'Story 6', progress: 0,   id: 6 },
  ];

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
