import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | import('@angular/router').UrlTree> {

    return this.authService.comprobarSesion().pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );

  }
}
