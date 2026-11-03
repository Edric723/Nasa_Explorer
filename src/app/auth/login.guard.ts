import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, catchError, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {

    return this.authService.comprobarSesion().pipe(
      map(() => this.router.createUrlTree(['/tabs'])),
      catchError(() => of(true))
    );

  }
}
