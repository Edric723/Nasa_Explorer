import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  constructor(
    private oidcSecurityService: OidcSecurityService
  ) {}

  login() {
    this.oidcSecurityService.authorize();
  }

}