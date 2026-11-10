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
import { SesionCognito } from '../models/sesion-cognito.model';

const MARGEN_RENOVACION_MS = 60 * 1000;
const DURACION_POR_DEFECTO_SEGUNDOS = 3600;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private url = COGNITO_URL;
  private clientId = COGNITO_CLIENT_ID;
  private headers = new HttpHeaders(COGNITO_HEADERS);

  private sesion: SesionCognito | null = null;
  private expiracionAccessToken = 0;
  private temporizadorRenovacion: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.recuperarSesion();
  }

  // Sesión y tokens

  /**
   * Establece la sesión con los tokens obtenidos de Cognito.    
   * @param tokens 
   * @returns 
   */
  private establecerSesion(tokens: Partial<SesionCognito>): SesionCognito {
    this.sesion = {
      ...this.sesion,
      ...tokens,
      RefreshToken: tokens.RefreshToken || this.sesion?.RefreshToken
    } as SesionCognito;

    this.expiracionAccessToken =
      Date.now() + (tokens.ExpiresIn || DURACION_POR_DEFECTO_SEGUNDOS) * 1000;

    sessionStorage.setItem(
      STORAGE_KEYS.SESION,
      JSON.stringify({
        sesion: this.sesion,
        expiracionAccessToken: this.expiracionAccessToken
      })
    );

    this.programarRenovacion();

    return this.sesion;
  }

  private recuperarSesion() {
    const sesionGuardada = sessionStorage.getItem(STORAGE_KEYS.SESION);

    if (!sesionGuardada) {
      return;
    }

    try {
      const datos = JSON.parse(sesionGuardada);

      this.sesion = datos.sesion;
      this.expiracionAccessToken = datos.expiracionAccessToken || 0;

      if (this.sesion?.RefreshToken) {
        this.programarRenovacion();
      } else {
        this.cerrarSesion();
      }
    } catch {
      this.cerrarSesion();
    }
  }

  cerrarSesion() {
    this.cancelarRenovacion();

    this.sesion = null;
    this.expiracionAccessToken = 0;

    sessionStorage.removeItem(STORAGE_KEYS.SESION);
  }

  private cancelarRenovacion() {
    if (this.temporizadorRenovacion !== null) {
      clearTimeout(this.temporizadorRenovacion);
      this.temporizadorRenovacion = null;
    }
  }


  /**
   * Programa la renovación automática del Access Token antes de que expire.
   */
  private programarRenovacion() {
    this.cancelarRenovacion();

    if (!this.sesion?.RefreshToken) {
      return;
    }

    const tiempoEspera = Math.max(
      0,
      this.expiracionAccessToken - Date.now() - MARGEN_RENOVACION_MS
    );

    this.temporizadorRenovacion = setTimeout(() => {
      this.renovarSesion().subscribe({
        error: () => this.router.navigateByUrl('/login', { replaceUrl: true })
      });
    }, tiempoEspera);
  }


  /**
   * Renueva la sesión utilizando el Refresh Token.
   * @returns Observable con la nueva sesión.
   */
  renovarSesion(): Observable<SesionCognito> {
    if (!this.sesion?.RefreshToken) {
      this.cerrarSesion();

      return throwError(() => new Error('No hay un Refresh Token disponible.'));
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
          throw new Error('Cognito no devolvió nuevos tokens.');
        }

        return this.establecerSesion(respuesta.AuthenticationResult);
      }),
      catchError(error => {
        this.cerrarSesion();

        return throwError(() => error);
      })
    );
  }

  /**
   * Comprueba si hay una sesión activa y válida.
   * @returns Observable con la sesión activa o un error si no hay sesión.
   */
  comprobarSesion(): Observable<SesionCognito> {
    if (!this.sesion) {
      return throwError(() => new Error('No hay una sesión iniciada.'));
    }

    if (Date.now() < this.expiracionAccessToken) {
      return of(this.sesion);
    }

    return this.renovarSesion();
  }


  /**
   * Realiza una llamada a la API de Cognito con la acción y el cuerpo especificados.
   * @param accion Acción de Cognito (ej. 'SignUp', 'InitiateAuth').
   * @param cuerpo Objeto con los parámetros de la acción.
   * @returns Observable con la respuesta de Cognito.
   */

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
          this.establecerSesion(respuesta.AuthenticationResult);
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

  /**
   * Obtiene el ID del usuario a partir del IdToken de la sesión.
   * @returns El ID del usuario o null si no hay sesión activa.
   */
  obtenerIdUsuario(): string | null {
    const token = this.sesion?.IdToken;

    if (!token) {
      return null;
    }

    const cuerpo = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');

    return JSON.parse(atob(cuerpo)).sub;
  }
}