import { TestBed } from '@angular/core/testing';

import { Kera3ServiceService } from './kera3-service.service';

describe('Kera3ServiceService', () => {
  let service: Kera3ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Kera3ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
