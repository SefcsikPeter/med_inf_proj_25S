import { TestBed } from '@angular/core/testing';

import { InfectionTreeService } from './infection-tree.service';

describe('InfectionTreeServiceService', () => {
  let service: InfectionTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfectionTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
