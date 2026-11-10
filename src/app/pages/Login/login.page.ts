import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { mensajeErrorCognito } from '../../auth/errores-cognito';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  modo = signal<'login' | 'registro' | 'confirmacion' | 'solicitud-recuperacion' | 'recuperacion'>('login');

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
    this.modo.set('login');
    this.limpiarMensajes();
  }

  mostrarRegistro() {
    this.modo.set('registro');
    this.limpiarMensajes();
  }

  login() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.iniciarSesion(
      this.email,
      this.password
    ).pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: (respuesta) => {
        if (respuesta.AuthenticationResult) {
          this.router.navigateByUrl('/tabs/apod');
        } else {
          this.error.set('Cognito requiere un paso adicional de autenticación.');
        }
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
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
    ).pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: () => {
        this.modo.set('confirmacion');
        this.mensaje.set('Cuenta creada. Revisá tu correo para obtener el código.');
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  confirmarRegistro() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.confirmarRegistro(
      this.email,
      this.codigo
    ).pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: () => {
        this.modo.set('login');
        this.password = '';
        this.codigo = '';
        this.mensaje.set('¡Cuenta confirmada! Ya podés iniciar sesión.');
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  mostrarSolicitudRecuperacion() {
    this.limpiarMensajes();
    this.modo.set('solicitud-recuperacion');
  }
  
  recuperarContrasena() {
    this.limpiarMensajes();
  
    if (!this.email.trim()) {
      this.error.set('Ingresá tu correo electrónico.');
      return;
    }
  
    this.cargando.set(true);
  
    this.authService.recuperarContrasena(
      this.email.trim()
    ).pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: () => {
        this.modo.set('recuperacion');
        this.mensaje.set('Te enviamos un código de recuperación a tu correo electrónico.');
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  confirmarRecuperacion() {
    this.limpiarMensajes();
    this.cargando.set(true);

    this.authService.confirmarRecuperacion(
      this.email,
      this.codigo,
      this.nuevaPassword
    ).pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: () => {
        this.modo.set('login');
        this.password = '';
        this.codigo = '';
        this.nuevaPassword = '';
        this.mensaje.set('Contraseña actualizada correctamente.');
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  private mostrarError(error: HttpErrorResponse) {
    this.error.set(mensajeErrorCognito(error));
  }

  private limpiarMensajes() {
    this.error.set('');
    this.mensaje.set('');
  }
}