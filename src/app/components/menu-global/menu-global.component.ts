import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

let contadorInstancias = 0;

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.scss'],
  standalone: false
})
export class MenuGlobalComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  idBoton = `boton-menu-${contadorInstancias++}`;

  @HostListener('window:resize')
  alRedimensionar() {
    document.querySelectorAll('ion-popover').forEach(popover => popover.dismiss());
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}