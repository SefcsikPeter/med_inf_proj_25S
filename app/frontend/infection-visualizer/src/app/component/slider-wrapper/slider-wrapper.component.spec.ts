import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderWrapperComponent } from './slider-wrapper.component';

describe('SliderWrapperComponent', () => {
  let component: SliderWrapperComponent;
  let fixture: ComponentFixture<SliderWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
