import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_gHuFLW2f3',
            redirectUrl: window.location.origin + '/tabs',
            postLogoutRedirectUri: window.location.origin + '/login',
            postLoginRoute: '/tabs/tab1',
            clientId: '15kgev445afv48084b5q26fed1',
            scope: 'openid email',
            responseType: 'code',
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
