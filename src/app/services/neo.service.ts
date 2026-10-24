import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaNeo } from '../models/neo.model';

@Injectable({
    providedIn: 'root'
})
export class NeoService {

    private apiUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
    private apiKey = environment.nasaApiKey;

    constructor(private http: HttpClient) { }

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