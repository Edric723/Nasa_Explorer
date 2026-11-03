import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, map, catchError, throwError } from 'rxjs';

import {
  COGNITO_URL,
  COGNITO_CLIENT_ID,
  COGNITO_HEADERS,
  STORAGE_KEYS
} from '../auth/cognito.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);


  private url = COGNITO_URL;
  private clientId = COGNITO_CLIENT_ID;
  private headers = new HttpHeaders(COGNITO_HEADERS);

  private sesion: any = null;
  private expiracionAccessToken = 0;

  private temporizadorRenovacion:
    ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.recuperarSesion();
  }

  // GUARDADO Y PERSISTENCIA DE SESION/TOKEN
  // Guardado en storage para testeo web...
  private guardarSesion(respuesta: any) {
    this.sesion = respuesta;

    const duracion = respuesta.ExpiresIn || 3600;

    this.expiracionAccessToken =
      Date.now() + duracion * 1000;

    this.guardarSesionEnStorage();
    this.programarRenovacion();
  }

  recuperarSesion() {
    const sesionGuardada = localStorage.getItem(
      STORAGE_KEYS.SESION
    );

    if (!sesionGuardada) {
      return;
    }

    try {
      const datos = JSON.parse(sesionGuardada);

      this.sesion = datos.sesion;
      this.expiracionAccessToken =
        datos.expiracionAccessToken || 0;

      if (this.sesion && this.sesion.RefreshToken) {
        this.programarRenovacion();
      } else {
        this.cerrarSesion();
      }
    } catch {
      this.cerrarSesion();
    }
  }

  cerrarSesion() {
    if (this.temporizadorRenovacion !== null) {
      clearTimeout(this.temporizadorRenovacion);
      this.temporizadorRenovacion = null;
    }

    this.sesion = null;
    this.expiracionAccessToken = 0;

    localStorage.removeItem(STORAGE_KEYS.SESION);
  }

  private programarRenovacion() {
    if (this.temporizadorRenovacion !== null) {
      clearTimeout(this.temporizadorRenovacion);
      this.temporizadorRenovacion = null;
    }

    if (!this.sesion || !this.sesion.RefreshToken) {
      return;
    }

    const tiempoRestante =
      this.expiracionAccessToken - Date.now();

    const margenRenovacion = 60 * 1000;

    let tiempoEspera =
      tiempoRestante - margenRenovacion;

    if (tiempoEspera < 0) {
      tiempoEspera = 0;
    }

    this.temporizadorRenovacion = setTimeout(() => {
      this.renovarSesion().subscribe({
        next: () => {
        },
        error: () => {
          this.router.navigateByUrl('/login', {
            replaceUrl: true
          });
        }
      });
    }, tiempoEspera);
  }

  renovarSesion(): Observable<any> {
    if (!this.sesion || !this.sesion.RefreshToken) {
      this.cerrarSesion();

      return throwError(
        () => new Error('No hay un Refresh Token disponible.')
      );
    }

        return this.llamarCognito('InitiateAuth', {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: this.sesion.RefreshToken
      }
    }).pipe(
      map(respuesta => {
        if (!respuesta.AuthenticationResult) {
          throw new Error(
            'Cognito no devolvió nuevos tokens.'
          );
        }

        const tokensNuevos =
          respuesta.AuthenticationResult;

        this.sesion = {
          ...this.sesion,
          ...tokensNuevos,
          RefreshToken: tokensNuevos.RefreshToken
            || this.sesion.RefreshToken
        };

        const duracion =
          tokensNuevos.ExpiresIn || 3600;

        this.expiracionAccessToken =
          Date.now() + duracion * 1000;

        this.guardarSesionEnStorage();
        this.programarRenovacion();

        return this.sesion;
      }),
      catchError(error => {
        this.cerrarSesion();

        return throwError(() => error);
      })
    );
  }

  comprobarSesion(): Observable<any> {
    if (!this.sesion) {
      return throwError(
        () => new Error('No hay una sesión iniciada.')
      );
    }

    if (Date.now() < this.expiracionAccessToken) {
      return of(this.sesion);
    }

    return this.renovarSesion();
  }

  private guardarSesionEnStorage() {
    localStorage.setItem(
      STORAGE_KEYS.SESION,
      JSON.stringify({
        sesion: this.sesion,
        expiracionAccessToken:
          this.expiracionAccessToken
      })
    );
  }

  // Llamada genérica a la API de Cognito
  private llamarCognito<T = any>(accion: string, cuerpo: object): Observable<T> {
    return this.http.post<T>(this.url, cuerpo, {
      headers: this.headers.set(
        'X-Amz-Target',
        `AWSCognitoIdentityProviderService.${accion}`
      )
    });
  }

  registrar(
    email: string,
    password: string,
    nickname: string,
    fechaNacimiento: string
  ): Observable<any> {
    return this.llamarCognito('SignUp', {
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'nickname', Value: nickname },
        { Name: 'birthdate', Value: fechaNacimiento }
      ]
    });
  }

  confirmarRegistro(email: string, codigo: string): Observable<any> {
    return this.llamarCognito('ConfirmSignUp', {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: codigo
    });
  }

  iniciarSesion(email: string, password: string): Observable<any> {
    return this.llamarCognito('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }).pipe(
      tap(respuesta => {
        if (respuesta.AuthenticationResult) {
          this.guardarSesion(respuesta.AuthenticationResult);
        }
      })
    );
  }

  recuperarContrasena(email: string): Observable<any> {
    return this.llamarCognito('ForgotPassword', {
      ClientId: this.clientId,
      Username: email
    });
  }

  confirmarRecuperacion(
    email: string,
    codigo: string,
    nuevaPassword: string
  ): Observable<any> {
    return this.llamarCognito('ConfirmForgotPassword', {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: codigo,
      Password: nuevaPassword
    });
  }
}
