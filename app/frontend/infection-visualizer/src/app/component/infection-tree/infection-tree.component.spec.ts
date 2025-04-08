import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfectionTreeComponent } from './infection-tree.component';

describe('InfectionTreeComponent', () => {
  let component: InfectionTreeComponent;
  let fixture: ComponentFixture<InfectionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfectionTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfectionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
