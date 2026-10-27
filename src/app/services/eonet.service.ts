import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaEonet } from '../models/event-eonet.model';


@Injectable({
  providedIn: 'root'
})
export class EonetService {
  private apiUrl = 'https://eonet.gsfc.nasa.gov/api/v3/events';

  constructor(private http: HttpClient) { }

  obtenerEventos(): Observable<RespuestaEonet> {
    return this.http.get<RespuestaEonet>(this.apiUrl, {
      params: {
        status: 'open',
        limit: '1200'
      }
    });
  }
}


