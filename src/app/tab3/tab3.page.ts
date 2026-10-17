import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

type Coordinate = number | Coordinate[];

interface NasaEventGeometry {
  date: string;
  coordinates: Coordinate;
}

interface NasaEvent {
  id: string;
  title: string;
  link: string;
  categories: Array<{ title: string }>;
  geometry: NasaEventGeometry[];
}

interface NasaEventsResponse {
  events: NasaEvent[];
}

interface NasaImageItem {
  title: string;
  description?: string;
  date_created?: string;
  nasa_id: string;
}

interface NasaImageSearchResponse {
  collection: {
    items: Array<{
      data: NasaImageItem[];
      links?: Array<{ href: string; rel: string }>;
    }>;
  };
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  readonly ubicacion = signal<{ latitude: number; longitude: number } | null>(null);
  readonly evento = signal<NasaEvent | null>(null);
  readonly imagen = signal<{
    url: string;
    title: string;
    description: string;
    dateCreated: string;
    nasaId: string;
  } | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  /**
   * @description obtiene la ubicacion del usuario, busca el 
   * evento activo mas cercano y carga la imagen de la NASA para
   * mostrarla en la pantalla.
   * @returns una promesa que se resuelve cuando se completa la búsqueda.
   */
  async buscarEventos(): Promise<void> {
    if (this.cargando()) {
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.evento.set(null);
    this.imagen.set(null);

    try {
      const position = await this.obtenerUbicacion();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      this.ubicacion.set(location);

      const response = await firstValueFrom(
        this.http.get<NasaEventsResponse>('https://eonet.gsfc.nasa.gov/api/v3/events', {
          params: { status: 'open', limit: '100' },
        }),
      );
      const algunEvent = this.encontrarEventoCercano(response.events, location);

      if (!algunEvent) {
        this.error.set('No se encontraron eventos naturales activos cerca de tu ubicación.');
        return;
      }

      const imagenRespuesta = await firstValueFrom(
        this.http.get<NasaImageSearchResponse>('https://images-api.nasa.gov/search', {
          params: { q: algunEvent.title, media_type: 'image' },
        }),
      );
      const imageItem = imagenRespuesta.collection.items.find(
        (item) => item.data[0] && item.links?.some((link) => link.rel === 'preview'),
      );
      const preview = imageItem?.links?.find((link) => link.rel === 'preview');

      if (!imageItem?.data[0] || !preview) {
        this.error.set(`Se encontró el evento “${algunEvent.title}”, pero NASA no quiere mostrarte nada.`);
        this.evento.set(algunEvent);
        return;
      }

      this.evento.set(algunEvent);
      this.imagen.set({
        url: preview.href,
        title: imageItem.data[0].title,
        description: imageItem.data[0].description ?? '',
        dateCreated: imageItem.data[0].date_created ?? '',
        nasaId: imageItem.data[0].nasa_id,
      });
    } catch (error) {
      console.error('No se pudo consultar, vives en otra dimensión de la NASA.', error);
      this.error.set(this.mensajeError(error));
    } finally {
      this.cargando.set(false);
    }
  }

  salir(): void {
    void this.router.navigate(['/tabs/tab1']);
  }
  /**
   * @description Descripcion: Obtiene la ubicación actual del dispositivo y devuelve
   * sus cordenadas de latitud y longitud.
   * @function obtenerUbicacion devuelve un objeto GeolocationPosition.
   * @returns tu ubicación
   */
  private obtenerUbicacion(): Promise<GeolocationPosition> {
    if (!navigator.geolocation) {
      return Promise.reject(new Error('Este dispositivo o navegador no ofrece geolocalización.'));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    });
  }
  /**
   * @description Busca el evento activo más cercano a la ubicación
   * indicada, dentro de 150 km.
   * @param recibe una lista de eventos, proporcionada por la API de NASA.   * 
   * @param recibe los parametros encontrados anteriormete.
   * @returns Devuelve el evento o no encontrado.
   */
  private encontrarEventoCercano(
    events: NasaEvent[],
    location: { latitude: number; longitude: number },
  ): NasaEvent | null {
    let cercaEstoy: NasaEvent | null = null;
    let cercaAEstaDistancia = 150;

    for (const event of events) {
      for (const geometry of event.geometry) {
        const coordinate = this.firstCoordinate(geometry.coordinates);
        if (!coordinate) {
          continue;
        }

        const distance = this.distanceInKm(location.latitude, location.longitude, coordinate[1], coordinate[0]);
        if (distance < cercaAEstaDistancia) {
          cercaEstoy = event;
          cercaAEstaDistancia = distance;
        }
      }
    }

    return cercaEstoy;
  }
  /**
   * @description Obtiene la primera coordenada de un array de coordenadas.
   * y devuelve un array con la latitud y longitud.
   * @param recibe un array de coordenadas, proporcionada por la API de NASA.   *
   * @returns una cordenadas validas o null.
   */
  private firstCoordinate(value: NasaEventGeometry['coordinates']): [number, number] | null {
    if (!Array.isArray(value)) {
      return null;
    }
    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      return [value[0], value[1]];
    }

    for (const nested of value) {
      const coordinate = this.firstCoordinate(nested);
      if (coordinate) {
        return coordinate;
      }
    }
    return null;
  }
  /**
   * @description Calcula la distancia, en Km, entre dos puntos geográficos 
   * a partir de sus latitudes y longitudes.
   * @param lat1 mi ubicacion
   * @param lon1 longitud de primer punto
   * @param lat2 ubicacion del evento.
   * @param lon2 longitud del evento.
   * @returns la distancia entre los dos puntos geográficos en kilómetros.
   */
  private distanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const latitudeDelta = toRadians(lat2 - lat1);
    const longitudeDelta = toRadians(lon2 - lon1);
    const arc =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;

    return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
  }
   /**
    * @description analiza el error recibido y devuelve un mensaje
    * para imformar al usuario sobre el problema ocurrido.
    * @param unKnown indica que puede ser de cualquier tipo.
    * @returns Devuelve un string con el mensaje correspondiente.
    */
  private mensajeError(error: unknown): string {
    if (error instanceof GeolocationPositionError) {
      if (error.code === error.PERMISSION_DENIED) {
        return 'Necesitamos permiso para acceder a tu ubicación. Habilita el GPS e inténtalo de nuevo.';
      }
      if (error.code === error.POSITION_UNAVAILABLE) {
        return 'No se pudo determinar tu ubicación. Comprueba que el GPS esté activado.';
      }
      return 'La ubicación tardó demasiado en obtenerse. Inténtalo de nuevo.';
    }

    return 'No se pudieron cargar los eventos de NASA. Comprueba tu conexión e inténtalo de nuevo.';
  }
}
