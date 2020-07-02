import { TestBed } from '@angular/core/testing';

import { PreloadGuard } from './preload.guard';

describe('PreloadGuard', () => {
  let guard: PreloadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreloadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
