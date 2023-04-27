import { TestBed } from '@angular/core/testing';

import { PonsService } from './pons.service';

describe('PonsService', () => {
  let service: PonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
