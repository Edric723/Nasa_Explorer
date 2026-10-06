import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) {
    this.oidcSecurityService.isAuthenticated$.subscribe(result => {
      console.log('TABS - ¿Autenticado?', result);
    });
  }

}
