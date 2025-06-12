import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonGraphComponent } from './lesson-graph.component';

describe('LessonGraphComponent', () => {
  let component: LessonGraphComponent;
  let fixture: ComponentFixture<LessonGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
