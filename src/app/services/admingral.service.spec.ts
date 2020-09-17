import { TestBed } from '@angular/core/testing';

import { AdmingralService } from './admingral.service';

describe('AdmingralService', () => {
  let service: AdmingralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmingralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
