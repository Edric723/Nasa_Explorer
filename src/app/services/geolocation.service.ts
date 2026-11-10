import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';



export interface UbicacionIP {
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {
  private http = inject(HttpClient);



  // Comprobar en movile luego---
  // async obtenerUbicacion() {
  //   return await Geolocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 30000,
  //     maximumAge: 0
  //   });
  // }


  // Función para obtener la ubicación aproximada por IP (para versión web)
  async obtenerUbicacionPorIP(): Promise<UbicacionIP> {
    return await firstValueFrom(
      this.http.get<UbicacionIP>(
        'https://ipapi.co/json/'
      )
    );
  }
}

