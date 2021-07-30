import { TestBed } from '@angular/core/testing';

import { DataLookupService } from './data-lookup.service';

describe('DataLookupService', () => {
  let service: DataLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
