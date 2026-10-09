import { Injectable, signal } from '@angular/core';
import { Tarjeta } from '../models/tarjeta.model';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private readonly estadoTarjetas = signal<Tarjeta[]>([]);
    readonly tarjetas = this.estadoTarjetas.asReadonly();
    constructor() {
        this.cargarStorage();
    }

    validarInput(input: any): boolean {
        return input && input.titulo && input.titulo.trim() !== '';
    }
    crearTarjeta(nombreTarjeta: string) {
        const objetoTarjeta = new Tarjeta(nombreTarjeta);
        this.estadoTarjetas.update((tarjetas) => [...tarjetas, objetoTarjeta]);
        this.persistirStorage();

        return objetoTarjeta.titulo;
    }


    private guardarStorage() {
        this.estadoTarjetas.update((tarjetas) => [...tarjetas]);
        this.persistirStorage();
    }
    private persistirStorage() {
        const stringTarjetas = JSON.stringify(this.estadoTarjetas());
        localStorage.setItem('tarjetas', stringTarjetas);
    }

    private cargarStorage() {
        const tarjetaStorage = localStorage.getItem('tarjetas');

        if (tarjetaStorage === null) {
            this.estadoTarjetas.set([]);
            return;
        }

        const objTarjeta: any[] = JSON.parse(tarjetaStorage);
        this.estadoTarjetas.set(objTarjeta);
    }


    eliminarTarjeta(tarjeta: Tarjeta) {
        this.estadoTarjetas.update((tarjetas) => tarjetas.filter((tarjeta) => tarjeta.id !== tarjeta.id));
        this.persistirStorage();
    }

    editarTarjeta(tarjeta: Tarjeta) { 
    let tarjetaEditar = this.tarjetas().find((tarjeta) => tarjeta.id === tarjeta.id); 
        if (tarjetaEditar) { 
            tarjetaEditar.titulo = tarjeta.titulo; 
            this.guardarStorage(); 
        } 
 } 
}
