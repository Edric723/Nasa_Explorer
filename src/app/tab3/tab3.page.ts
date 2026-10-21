import { Component, OnInit, signal } from '@angular/core';
import { EonetService } from '../services/eonet.service';
import { EventoEonet } from '../models/event-eonet.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  // Señales
  eventos = signal<EventoEonet[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string>('');

  ubicacion = signal<GeolocationCoordinates | null>(null);
  errorUbicacion = signal<string>('');

  constructor(private eonetService: EonetService) { }

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando.set(true);
    this.error.set('');

    this.eonetService.obtenerEventos().subscribe({
      next: (respuesta) => {
        this.eventos.set(respuesta.events);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudieron cargar los eventos naturales.'
        );
        this.cargando.set(false);
      }
    });
  }

  // Método para pedirle la ubicación al usuario.
  // Ya que la pc no cuenta con gps tenemos que ver de testear por ip, y cuando estemos en app móvil testear la ubicación.
  // Por ahora no influye en ninguna cosa.
  obtenerUbicacion() {
    console.log('Se presionó el botón');
    this.errorUbicacion.set('Solicitando ubicación...');

    if (!navigator.geolocation) {
      this.errorUbicacion.set(
        'El navegador no admite geolocalización.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        console.log('Ubicación obtenida:', posicion.coords);

        this.ubicacion.set(posicion.coords);
        this.errorUbicacion.set('Ubicación obtenida correctamente.');
      },
      (error) => {
        console.error('Error de geolocalización:', error.code, error.message);

        this.errorUbicacion.set(
          'No se pudo obtener la ubicación. Código: ' + error.code
        );
      }
    );
  }

}
