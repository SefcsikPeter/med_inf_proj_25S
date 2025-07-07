import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilinePlotComponent } from './multiline-plot.component';

describe('MultilinePlotComponent', () => {
  let component: MultilinePlotComponent;
  let fixture: ComponentFixture<MultilinePlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultilinePlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultilinePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
