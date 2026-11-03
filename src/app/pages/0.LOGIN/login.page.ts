import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);


  modo: 'login' | 'registro' | 'confirmacion' | 'recuperacion' = 'login';

  email = '';
  password = '';
  nickname = '';
  fechaNacimiento = '';
  codigo = '';
  nuevaPassword = '';

  cargando = signal(false);
  error = signal('');
  mensaje = signal('');

  mostrarLogin() {
    this.modo = 'login';
    this.limpiarMensajes();
  }

  mostrarRegistro() {
    this.modo = 'registro';
    this.limpiarMensajes();
  }

  login() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.iniciarSesion(
      this.email,
      this.password
    ).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);

        if (respuesta.AuthenticationResult) {
          this.authService.guardarSesion(
            respuesta.AuthenticationResult
          );

          this.router.navigateByUrl('/tabs/tab1');
        } else {
          this.error.set(
            'Cognito requiere un paso adicional de autenticación.'
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError(error);
      }
    });
  }

  registrar() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.registrar(
      this.email,
      this.password,
      this.nickname,
      this.fechaNacimiento
    ).subscribe({
      next: () => {
        this.cargando.set(false);
        this.modo = 'confirmacion';

        this.mensaje.set(
          'Cuenta creada. Revisá tu correo para obtener el código.'
        );
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError(error);
      }
    });
  }

  confirmarRegistro() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.confirmarRegistro(
      this.email,
      this.codigo
    ).subscribe({
      next: () => {
        this.cargando.set(false);
        this.modo = 'login';
        this.password = '';
        this.codigo = '';

        this.mensaje.set(
          '¡Cuenta confirmada! Ya podés iniciar sesión.'
        );
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError(error);
      }
    });
  }

  private mostrarError(error: HttpErrorResponse) {
    if (error.error && error.error.message) {
      this.error.set(error.error.message);
    } else {
      this.error.set(
        'No se pudo completar la operación. Intentá nuevamente.'
      );
    }
  }

  cumpleRequisitosPassword(): boolean {
    if (!this.password) {
      return false;
    }

    const longitud = this.password.length >= 8;
    const mayuscula = /[A-Z]/.test(this.password);
    const minuscula = /[a-z]/.test(this.password);
    const numero = /[0-9]/.test(this.password);
    const especial = /[^A-Za-z0-9]/.test(this.password);

    return longitud && mayuscula && minuscula && numero && especial;
  }

  private limpiarMensajes() {
    this.error.set('');
    this.mensaje.set('');
  }


  recuperarContrasena() {
    this.limpiarMensajes();

    if (!this.email.trim()) {
      this.error.set('Ingresá tu correo electrónico para recuperar tu contraseña.');
      return;
    }

    this.cargando.set(true);

    this.authService.recuperarContrasena(
      this.email
    ).subscribe({
      next: () => {
        this.cargando.set(false);
        this.modo = 'recuperacion';

        this.mensaje.set(
          'Te enviaremos un código de recuperación a tu correo electrónico.'
        );
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError(error);
      }
    });
  }

  confirmarRecuperacion() {
    this.cargando.set(true);

    this.authService.confirmarRecuperacion(
      this.email,
      this.codigo,
      this.nuevaPassword
    ).subscribe({
      next: () => {
        this.cargando.set(false);
        this.modo = 'login';
        this.password = '';
        this.codigo = '';
        this.nuevaPassword = '';
        this.mensaje.set('Contraseña actualizada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError(error);
      }
    });
  }

}