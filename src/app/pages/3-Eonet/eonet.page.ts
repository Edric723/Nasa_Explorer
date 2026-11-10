import { computed, Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import * as L from 'leaflet';

import { EonetService } from '../../services/eonet.service';
import { GeolocationService, UbicacionIP } from '../../services/geolocation.service';
import { EventoEonet } from '../../models/event-eonet.model';
import { CATEGORIAS_EONET } from '../../models/categoria-eonet.model';


@Component({
  selector: 'app-eonet',
  templateUrl: 'eonet.page.html',
  styleUrls: ['eonet.page.scss'],
  standalone: false
})

export class EonetPage implements OnInit, OnDestroy {
  private eonetService = inject(EonetService);
  private geolocationService = inject(GeolocationService);


  // Señales
  eventos = signal<EventoEonet[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  ubicacion = signal<UbicacionIP | null>(null);
  mensajeUbicacion = signal<string>('');
  distancias = signal<Map<string, number>>(new Map());

  categoriaSeleccionada = signal<string | null>(null);

  // Variables
  categorias = Object.values(CATEGORIAS_EONET);

  private mapa?: L.Map;
  private marcadores = L.layerGroup();

  radioMaximo = 1200;

  /**
   * Obtiene los eventos filtrados por categoría.
   */
  eventosFiltrados = computed<EventoEonet[]>(() => {
    const categoria = this.categoriaSeleccionada();

    if (!categoria) {
      return this.eventos();
    }

    const configuracion = this.categorias.find(
      elemento => elemento.nombre === categoria
    );

    if (!configuracion) {
      return this.eventos();
    }

    return this.eventos().filter(evento =>
      evento.categories.some(elemento =>
        elemento.title.toLowerCase() ===
        configuracion.nombreApi.toLowerCase()
      )
    );
  });


  /**
   * Obtiene los eventos cercanos a la ubicación del usuario.
   */
  eventosCercanos = computed<EventoEonet[]>(() => {
    const distancias = this.distancias();

    return this.eventosFiltrados()
      .filter(evento => {
        const distancia = distancias.get(evento.id);

        return distancia !== undefined &&
          distancia <= this.radioMaximo;
      })
      .sort((a, b) => {
        const distanciaA = distancias.get(a.id) ?? Infinity;
        const distanciaB = distancias.get(b.id) ?? Infinity;

        return distanciaA - distanciaB;
      });
  });

  ngOnInit() {
    this.cargarEventos();
  }

  ngOnDestroy() {
    this.mapa?.remove();
    this.mapa = undefined;
  }

  ionViewDidEnter() {
    this.inicializarMapa();
    this.actualizarMarcadores();
  }

  // Funciones relacionadas al mapa
  private inicializarMapa() {
    if (this.mapa) {
      this.mapa.invalidateSize();
      return;
    }

    const elemento = document.getElementById('mapa-eventos');

    if (!elemento) {
      return;
    }

    this.mapa = L.map(elemento).setView([0, 0], 2);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    ).addTo(this.mapa);

    this.marcadores.addTo(this.mapa);
  }

  cargarEventos() {
    this.cargando.set(true);
    this.error.set('');

    this.eonetService.obtenerEventos().subscribe({
      next: (respuesta) => {
        this.eventos.set(respuesta.events);

        const lugar = this.ubicacion();

        if (lugar) {
          this.calcularDistancias(lugar);
        }

        this.cargando.set(false);
        this.actualizarMarcadores();
      },
      error: () => {
        this.error.set(
          'No se pudieron cargar los eventos naturales.'
        );

        this.cargando.set(false);
      }
    });
  }

  /**
   * Obtiene las coordenadas del evento EONET.
   * @param evento El evento EONET.
   * @returns Un objeto con latitud, longitud y fecha, o null si no se encuentran coordenadas válidas.
   */
  private obtenerCoordenadas(
    evento: EventoEonet
  ): { latitud: number; longitud: number; fecha: string } | null {

    for (let i = evento.geometry.length - 1; i >= 0; i--) {
      const { type, coordinates, date } = evento.geometry[i];

      if (
        type === 'Point' &&
        Array.isArray(coordinates) &&
        typeof coordinates[0] === 'number' &&
        typeof coordinates[1] === 'number'
      ) {
        return {
          longitud: coordinates[0],
          latitud: coordinates[1],
          fecha: date || 'Sin fecha'
        };
      }
    }

    return null;
  }

  filtrarPorCategoria(categoria: string | null) {
    this.categoriaSeleccionada.set(categoria);
    this.actualizarMarcadores();
  }

  obtenerColorCategoria(evento: EventoEonet): string {
    const nombreApi = evento.categories[0]?.title;

    const configuracion = this.categorias.find(
      categoria =>
        categoria.nombreApi.toLowerCase() ===
        nombreApi?.toLowerCase()
    );

    return configuracion?.color || '#72d7ff';
  }

  /**
   * Actualiza los marcadores en el mapa según los eventos filtrados.
   */
  private actualizarMarcadores() {
    if (!this.mapa) {
      return;
    }

    this.marcadores.clearLayers();

    for (const evento of this.eventosFiltrados()) {
      const coordenadas = this.obtenerCoordenadas(evento);

      if (!coordenadas) {
        continue;
      }

      const color = this.obtenerColorCategoria(evento);

      const icono = L.divIcon({
        className: '',
        html: `
          <div
            class="marcador-nasa"
            style="--color-marcador: ${color}"
          ></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marcador = L.marker(
        [coordenadas.latitud, coordenadas.longitud],
        { icon: icono }
      );

      const categoria =
        evento.categories[0]?.title || 'Sin categoría';

      const fecha =
        coordenadas.fecha || 'Sin fecha';

      let contenido = `
        <strong>${this.escaparHtml(evento.title)}</strong>
        <br>
        ${this.escaparHtml(categoria)}
        <br>
        Fecha: ${this.escaparHtml(fecha)}
      `;

      const distancia = this.distancias().get(evento.id);

      if (distancia !== undefined) {
        contenido += `
          <br>
          Distancia aproximada: ${distancia.toFixed(1)} km
        `;
      }

      marcador.bindPopup(contenido);
      marcador.addTo(this.marcadores);
    }

    this.mapa.invalidateSize();
  }

  // Funciones relacionadas a la ubicación
  async obtenerUbicacion() {
    this.mensajeUbicacion.set(
      'Buscando ubicación aproximada por IP...'
    );

    try {
      const lugar =
        await this.geolocationService.obtenerUbicacionPorIP();

      this.ubicacion.set(lugar);
      this.calcularDistancias(lugar);
      this.actualizarMarcadores();

      this.mensajeUbicacion.set(
        'Ubicación obtenida. Se calcularon las distancias a los eventos.'
      );

    } catch {

      this.mensajeUbicacion.set(
        'No se pudo obtener la ubicación por IP.'
      );
    }
  }


  // Funciones relacionadas a la distancia
  private calcularDistancias(lugar: UbicacionIP) {
    const distancias = new Map<string, number>();

    for (const evento of this.eventos()) {
      const coordenadas = this.obtenerCoordenadas(evento);

      if (!coordenadas) {
        continue;
      }

      const distancia = this.calcularDistancia(
        lugar.latitude,
        lugar.longitude,
        coordenadas.latitud,
        coordenadas.longitud
      );

      distancias.set(evento.id, distancia);
    }

    this.distancias.set(distancias);
  }

  /**
   * Calcula la distancia entre dos puntos en la superficie de la Tierra.
   * @param latitud1 Latitud del primer punto.
   * @param longitud1 Longitud del primer punto.
   * @param latitud2 Latitud del segundo punto.
   * @param longitud2 Longitud del segundo punto.
   * @returns La distancia en kilómetros.
   */
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

    const senoLatitud = Math.sin(diferenciaLatitud / 2);
    const senoLongitud = Math.sin(diferenciaLongitud / 2);

    const a =
      senoLatitud * senoLatitud +
      Math.cos(latitud1 * Math.PI / 180) *
      Math.cos(latitud2 * Math.PI / 180) *
      senoLongitud * senoLongitud;

    const angulo = 2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

    return radioTierra * angulo;
  }


  /** 
     * Ignora caracteres especiales en un texto para evitar problemas de seguridad.
     * @param texto El texto a escapar.
     * @returns El texto escapado.
     */
  private escaparHtml(texto: string): string {
    const caracteres: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return texto.replace(/[&<>"']/g, caracter =>
      caracteres[caracter]
    );
  }
}
