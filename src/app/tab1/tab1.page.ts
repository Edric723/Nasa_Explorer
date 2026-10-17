import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ApodService } from '../services/apod.service';
import { Apod } from '../models/apod.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})

export class Tab1Page implements OnInit {

  apod = signal<Apod | null>(null);
  videoUrl = signal('');
  cargando = signal(true);
  error = signal('');

  imagenAmpliada = false;

  constructor(
    private apodService: ApodService,
    // private cdr: ChangeDetectorRef
  ) { }

  get imagenUrl(): string {
    const url = this.apod()?.hdurl;
  
    if (!url) return '';
  
    return url.replace(/w=\d+/, 'w=1200').replace(/&h=\d+/, '');
  }


  ngOnInit() {
    // La respuesta devuelve un array (devuelve los últimos 25 días, incluyendo al actual.)
    this.apodService.obtenerApod().subscribe({
      next: (respuesta) => {
        // Si el array tiene al menos un elemento, se toma el elemento 0
        if (respuesta.length > 0) {
          const apod = respuesta[0];
  
          this.apod.set(apod);
          this.videoUrl.set('');
  
          if (apod.media_type === 'video' && apod.basic_html) {
            const resultado = apod.basic_html.match(/<source\s+src="([^"]+)"/);
  
            if (resultado) {
              this.videoUrl.set(resultado[1]);
            }
          }
        } else {
          this.apod.set(null);
        }
  
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al consultar APOD:', err);
  
        this.error.set('No se pudo cargar la imagen astronómica.');
        this.cargando.set(false);
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





