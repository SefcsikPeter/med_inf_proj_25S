import { TestBed } from '@angular/core/testing';

import { EpiModelService } from './epi-model.service';

describe('EpiModelService', () => {
  let service: EpiModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpiModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
