import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaNeo } from '../models/neo.model';

/**
 * Servicio que consulta la API NeoWs de la NASA
 * (objetos cercanos a la Tierra).
 */
@Injectable({
    providedIn: 'root'
})
export class NeoService {
    private apiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';

    // Misma key que usa apod.service.ts, tomada del archivo de environment
    private apiKey = environment.nasaApiKey;

    constructor(private http: HttpClient) { }

    /**
     * Devuelve los objetos cercanos entre dos fechas (máximo 7 días de rango).
     * @param desde fecha de inicio en formato AAAA-MM-DD
     * @param hasta fecha de fin en formato AAAA-MM-DD
     */
    obtenerObjetos(desde: string, hasta: string): Observable<RespuestaNeo> {
        return this.http.get<RespuestaNeo>(this.apiUrl, {
            params: {
                start_date: desde,
                end_date: hasta,
                api_key: this.apiKey
            }
        });
    }
}