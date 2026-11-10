import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, catchError, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

// Guard para proteger rutas que requieren autenticación, evita volver al login.
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.comprobarSesion().pipe(
    map(() => router.parseUrl('/tabs/apod')),
    catchError(() => of(true))
  );
};