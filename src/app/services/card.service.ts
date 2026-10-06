import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private tarjetas: any[] = [];
    constructor() { }

    crearTarjeta(nombreTarjeta: string) {
        let ObjetoTarjeta = {
            id: 0,
            titulo: nombreTarjeta,
            creadaEn: new Date(),
            terminadaEn: null,
            completada: false,
            actividades: []
        };
        this.tarjetas.push(ObjetoTarjeta);
        console.log("Tarjeta creada:", this.tarjetas);
        this.guardarStorage();
    }

    private guardarStorage() {
        let stringTarjetas: string = JSON.stringify(this.tarjetas);
        localStorage.setItem('tarjetas', stringTarjetas);
    }
}
