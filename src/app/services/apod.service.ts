import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Apod } from '../models/apod.model';


@Injectable({ providedIn: 'root' })
export class ApodService {
  private http = inject(HttpClient);

  private apiUrl = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/';
  private apiKey = environment.nasaApiKey;

  obtenerApod(): Observable<Apod[]> {
    return this.http.get<Apod[]>(this.apiUrl, {
      params: {
        api_key: this.apiKey
      }
    });
  }
}