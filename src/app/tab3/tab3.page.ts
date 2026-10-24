import { Component, OnInit, signal } from '@angular/core';
import { EonetService } from '../services/eonet.service';
import { EventoEonet } from '../models/event-eonet.model';
import { GeolocationService, UbicacionIP } from '../services/geolocation.service';

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
  ubicacion = signal<UbicacionIP | null>(null);
  errorUbicacion = signal<string>('');
  distancias = signal<Map<string, number>>(new Map());

  constructor(
    private eonetService: EonetService,
    private geolocationService: GeolocationService
  ) { }

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
  async obtenerUbicacion() {
    this.errorUbicacion.set('Buscando ubicación aproximada por IP...');

    try {
      const ubicacion = await this.geolocationService.obtenerUbicacionPorIP();

      this.ubicacion.set(ubicacion);

      const distancias = new Map<string, number>();

      for (const evento of this.eventos()) {
        for (const geometria of evento.geometry) {
          const coordenadas = geometria.coordinates;

          if (
            geometria.type === 'Point' &&
            Array.isArray(coordenadas) &&
            typeof coordenadas[0] === 'number' &&
            typeof coordenadas[1] === 'number'
          ) {
            const distancia = this.calcularDistancia(
              ubicacion.latitude,
              ubicacion.longitude,
              coordenadas[1],
              coordenadas[0]
            );

            distancias.set(evento.id, distancia);
            break;
          }
        }
      }

      this.distancias.set(distancias);

      this.eventos.update(eventos =>
        [...eventos].sort((a, b) => {
          const distanciaA = distancias.get(a.id);
          const distanciaB = distancias.get(b.id);

          if (distanciaA === undefined) return 1;
          if (distanciaB === undefined) return -1;

          return distanciaA - distanciaB;
        })
      );

      this.errorUbicacion.set(
        'Ubicación obtenida. Eventos ordenados por cercanía.'
      );
    } catch (error) {
      console.error('Error al consultar ubicación por IP:', error);

      this.errorUbicacion.set(
        'No se pudo obtener la ubicación por IP.'
      );
    }
  }

  private calcularDistancia(
    latitud1: number,
    longitud1: number,
    latitud2: number,
    longitud2: number
  ): number {
    const radioTierra = 6371;

    const diferenciaLatitud =
      (latitud2 - latitud1) * Math.PI / 180;

    const diferenciaLongitud =
      (longitud2 - longitud1) * Math.PI / 180;

    const a =
      Math.sin(diferenciaLatitud / 2) *
      Math.sin(diferenciaLatitud / 2) +
      Math.cos(latitud1 * Math.PI / 180) *
      Math.cos(latitud2 * Math.PI / 180) *
      Math.sin(diferenciaLongitud / 2) *
      Math.sin(diferenciaLongitud / 2);

    const angulo = 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

    return radioTierra * angulo;
  }




}
