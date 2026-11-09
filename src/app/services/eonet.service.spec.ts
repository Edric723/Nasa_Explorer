import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EonetService } from './eonet.service';

describe('EonetService', () => {
  let service: EonetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EonetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});