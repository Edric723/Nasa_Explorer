import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs';

export interface UbicacionIP {
  city?: string;
  region?: string;
  country_name?: string;
  latitude: number;
  longitude: number;
  origen?: 'gps' | 'ip';
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private http = inject(HttpClient);

  /**
   * @description Obtiene la ubicación del usuario. En un dispositivo móvil usa el GPS;
   * si el usuario niega el permiso o el GPS falla, y también en la versión web,
   * recurre a la ubicación aproximada por IP.
   * @returns Ubicación con latitud y longitud, e indicación de su origen ('gps' o 'ip').
   */
  async obtenerUbicacion(): Promise<UbicacionIP> {
    if (Capacitor.isNativePlatform()) {
      try {
        return await this.obtenerUbicacionGPS();
      } catch {
        // Sin permiso o sin señal: se usa la IP como alternativa.
      }
    }

    return this.obtenerUbicacionPorIP();
  }

  /**
   * @description Obtiene la posición con el GPS del dispositivo. Verifica el permiso
   * de ubicación y lo solicita si todavía no fue otorgado.
   * @returns Ubicación con latitud y longitud.
   * @throws Error si el usuario deniega el permiso o no se puede leer la posición.
   */
  private async obtenerUbicacionGPS(): Promise<UbicacionIP> {
    let permisos = await Geolocation.checkPermissions();

    if (permisos.location !== 'granted') {
      permisos = await Geolocation.requestPermissions();
    }

    if (permisos.location !== 'granted') {
      throw new Error('Permiso de ubicación denegado.');
    }

    const posicion = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });

    return {
      latitude: posicion.coords.latitude,
      longitude: posicion.coords.longitude,
      origen: 'gps'
    };
  }

  /**
   * @description Obtiene la ubicación aproximada a partir de la IP (usa ipapi.co).
   * @returns Ubicación con ciudad, país, latitud y longitud.
   */
  async obtenerUbicacionPorIP(): Promise<UbicacionIP> {
    const ubicacion = await firstValueFrom(
      this.http.get<UbicacionIP>('https://ipapi.co/json/')
    );

    return { ...ubicacion, origen: 'ip' };
  }
}