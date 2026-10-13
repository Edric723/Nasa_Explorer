
import { Component, OnInit } from '@angular/core';
import { Apod, ApodService } from '../services/apod';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  apod: Apod | null = null;
  cargando = true;
  error = '';

  constructor(private apodService: ApodService) {}

  ngOnInit() {
    this.apodService.obtenerApod().subscribe({
      next: (respuesta) => {
        if (Array.isArray(respuesta)) {
          this.apod = respuesta.length > 0 ? respuesta[0] : null;
        } else {
          this.apod = respuesta;
        }

        if (!this.apod) {
          this.error = 'No se encontraron datos para la fecha de hoy.';
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al consultar APOD:', err);
        this.error = 'No se pudo cargar la imagen astronómica.';
        this.cargando = false;
      }
    });
  }
}





