import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminAdsGuard } from './admin-ads.guard';

describe('adminAdsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminAdsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
