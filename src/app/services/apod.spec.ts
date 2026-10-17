import { TestBed } from '@angular/core/testing';
import { Apod } from './apod.service';

describe('Apod', () => {
  let service: Apod;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Apod);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
