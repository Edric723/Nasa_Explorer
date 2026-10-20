import { TestBed } from '@angular/core/testing';
import { Eonet } from './eonet.service';

describe('Eonet', () => {
  let service: Eonet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Eonet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
