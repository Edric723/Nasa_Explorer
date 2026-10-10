import { Injectable, signal } from '@angular/core';
import { Tarjeta } from '../models/tarjeta.model';

@Injectable({
    providedIn: 'root'
})

/**
 * LOS SERVICIOS SON PARA LA LOGICA DE NEGOCIO, 
 * NO PARA LA INTERFAZ DE USUARIO, 
 * POR ESO NO TIENEN ALERTAS NI TOASTS, 
 * ESO VA EN EL COMPONENTE QUE ES LA INTERFAZ DE USUARIO.
 * AQUI LAS FUNCIONES SON PARA CREAR, EDITAR Y ELIMINAR TARJETAS,
 * Y PARA VALIDAR EL INPUT.
 */


export class CardService {
    private readonly estadoTarjetas = signal<Tarjeta[]>([]);
    readonly tarjetas = this.estadoTarjetas.asReadonly();
    constructor() {
        this.cargarStorage();
    }

    /**
   * @function validarInput
   * @description Valida que el input recibido no sea nulo, indefinido o una cadena vacía.  
   * @param input Objeto que contiene el campo titulo a validar.
   * @return Retorna true si el input es válido, de lo contrario retorna false.
   */
    validarInput(input: any): boolean {
        return input && input.titulo && input.titulo.trim() !== '';
    }


    /**
   * @function crearTarjeta
   * @description Crea una nueva tarjeta con el nombre proporcionado y la agrega al estado de tarjetas.    
   * @param nombreTarjeta Nombre de la tarjeta a crear.
   * @return Retorna el nombre de la tarjeta creada.
   */        
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



    /**
   * @function eliminarTarjeta
   * @description Muestra en consola la tarjeta que se desea eliminar.  
   * @param tarjeta Objeto de tipo Tarjeta que contiene la información de la tarjeta a eliminar.
   * @return No retorna ningún valor.
   */ 
    eliminarTarjeta(tarjeta: Tarjeta) {
        this.estadoTarjetas.update((tarjetas) => tarjetas.filter((tarjeta) => tarjeta.id !== tarjeta.id));
        this.persistirStorage();
    }


    /**
   * @function editarTarjeta
   * @description Muestra en consola la tarjeta que se desea editar.  
   * @param tarjeta Objeto de tipo Tarjeta que contiene la información de la tarjeta a editar.
   * @return No retorna ningún valor.
   */ 
    editarTarjeta(tarjeta: Tarjeta) { 
    let tarjetaEditar = this.tarjetas().find((tarjeta) => tarjeta.id === tarjeta.id); 
        if (tarjetaEditar) { 
            tarjetaEditar.titulo = tarjeta.titulo; 
            this.guardarStorage(); 
        } 
 } 
}
