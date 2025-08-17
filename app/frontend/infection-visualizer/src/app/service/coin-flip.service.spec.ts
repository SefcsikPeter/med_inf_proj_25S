import { TestBed } from '@angular/core/testing';

import { CoinFlipService } from './coin-flip.service';

describe('CoinFlipService', () => {
  let service: CoinFlipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinFlipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
