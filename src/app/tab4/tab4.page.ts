import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page {

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) {}

  cerrarSesion() {
    this.oidcSecurityService.logoffLocal();
  
    window.location.href =
      'https://us-east-2ghuflw2f3.auth.us-east-2.amazoncognito.com/logout' +
      '?client_id=15kgev445afv48084b5q26fed1' +
      '&logout_uri=' + encodeURIComponent('http://localhost:8100/login');
  }

}
