import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) {
    this.oidcSecurityService.checkAuth().subscribe({
      next: result => {
        console.log('Usuario autenticado:', result.isAuthenticated);
      },
      error: error => {
        console.error('Error al comprobar autenticación:', error);
      }
    });
  }

}