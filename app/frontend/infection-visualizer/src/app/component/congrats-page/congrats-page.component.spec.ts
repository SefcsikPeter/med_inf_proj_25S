import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratsPageComponent } from './congrats-page.component';

describe('CongratsPageComponent', () => {
  let component: CongratsPageComponent;
  let fixture: ComponentFixture<CongratsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongratsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongratsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
