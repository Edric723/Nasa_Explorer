import { Actividad } from "./actividad.model";

export class Tarjeta {
    id: number;
    titulo: string;
    creadaEn: Date;
    terminadaEn?: Date;
    completada: boolean;
    actividad: Actividad[];

    constructor(titulo: string) {
        this.titulo = titulo;
        this.creadaEn = new Date();
        this.completada = false;
        this.actividad = [];
        this.id = new Date().getTime();
    }
}