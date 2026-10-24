import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) { }

  // async obtenerUbicacion() {
  //   return await Geolocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 30000,
  //     maximumAge: 0
  //   });
  // }

  async obtenerUbicacionPorIP(): Promise<UbicacionIP> {
    return await firstValueFrom(
      this.http.get<UbicacionIP>(
        'https://ipapi.co/json/'
      )
    );
  }
}

