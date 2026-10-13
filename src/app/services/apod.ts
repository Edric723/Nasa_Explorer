
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Apod {
  date: string;
  title: string;
  explanation: string;
  media_type: string;
  url: string;
  hdurl?: string;
  copyright?: string;
  credit?: string;
  alt?: string;
  permalink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApodService {

  private apiUrl = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/';
  private apiKey = 'jhYIc9xpNea26akclgtBjILgmToq6quyF9m9QFjV';

  constructor(private http: HttpClient) { }

  obtenerApod(): Observable<Apod | Apod[]> {

    const hoy = new Date();

    const fecha = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0')
    ].join('-');

    const parametros = new HttpParams()
      .set('api_key', this.apiKey)
      .set('date', fecha);

    return this.http.get<Apod | Apod[]>(this.apiUrl, {
      params: parametros
    });
  }
}
