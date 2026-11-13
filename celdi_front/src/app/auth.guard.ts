import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  return localStorage.getItem('token') ? true : router.createUrlTree(['/login']);
};

export const roleGuard = (...roles: string[]): CanActivateFn => () => {
  const router = inject(Router);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  if (!localStorage.getItem('token')) {
    return router.createUrlTree(['/login']);
  }
  const role = localStorage.getItem('role');
  return role && roles.includes(role) ? true : router.createUrlTree(['/dashboard']);
};
