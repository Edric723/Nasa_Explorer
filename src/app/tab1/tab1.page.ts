
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Apod, ApodService } from '../services/apod';
import { SIGNAL } from '@angular/core/primitives/signals';

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

  imagenAmpliada = false;

  constructor(
    private apodService: ApodService,
    private cdr: ChangeDetectorRef
  ) { }

  get imagenUrl(): string {
    const url = this.apod?.hdurl;
    if (!url) return '';
    return url.replace(/w=\d+/, 'w=1200').replace(/&h=\d+/, '');
  }

  ngOnInit() {
    this.apodService.obtenerApod().subscribe({
      next: (respuesta) => {
        this.apod = Array.isArray(respuesta) ? (respuesta[0] ?? null) : respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar APOD:', err);
        this.error = 'No se pudo cargar la imagen astronómica.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ampliarImagen() {
    this.imagenAmpliada = true;
  }

  cerrarImagen() {
    this.imagenAmpliada = false;
  }
}





