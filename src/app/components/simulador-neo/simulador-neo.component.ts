import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  signal
} from '@angular/core';

import { ObjetoCercano } from '../../models/neo.model';

@Component({
  selector: 'app-simulador-neo',
  templateUrl: './simulador-neo.component.html',
  styleUrls: ['./simulador-neo.component.scss'],
  standalone: false
})

export class SimuladorNeoComponent implements OnChanges, OnDestroy {

  @Input() objeto: ObjetoCercano | null = null;

  // Estado de la simulación
  progreso = signal(0);
  reproduciendo = signal(false);

  intervalo: ReturnType<typeof setInterval> | null = null;

  // Parámetros de la trayectoria
  angulo = 0;
  curvatura = 0;
  sentido = 1;
  distanciaVisual = 0;


  // Detecta la selección de un asteroide
  ngOnChanges(changes: SimpleChanges) {
    if (changes['objeto']) {

      if (this.objeto) {
        this.generarTrayectoria();
        this.reiniciar();
        this.reproducir();
      } else {
        this.reiniciar();
      }

    }
  }


  // Inicia la animación
  reproducir() {
    if (this.intervalo !== null) {
      return;
    }

    if (this.progreso() >= 100) {
      this.progreso.set(0);
    }

    this.reproduciendo.set(true);

    this.intervalo = setInterval(() => {
      this.progreso.update(valor => valor + 1);

      if (this.progreso() >= 100) {
        this.progreso.set(100);
        this.pausar();
      }
    }, 100);
  }


  // Detiene la animación
  pausar() {
    if (this.intervalo !== null) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }

    this.reproduciendo.set(false);
  }


  // Reinicia la simulación
  reiniciar() {
    this.pausar();
    this.progreso.set(0);
  }


  // Permite cambiar manualmente el progreso
  cambiarProgreso(valor: number | { lower: number; upper: number }) {
    if (typeof valor === 'number') {
      this.pausar();
      this.progreso.set(valor);
    }
  }


  // Calcula la posición actual del asteroide
  obtenerPosicion() {

    const t = this.progreso() / 100;

    const inicioX = 15;
    const finalX = 345;

    const inicioY = 120 + (this.angulo * this.sentido);
    const finalY = 120 - (this.angulo * this.sentido);

    const controlX = 180;
    const controlY = 120 + (this.curvatura * this.sentido);

    const x = Math.pow(1 - t, 2) * inicioX
      + 2 * (1 - t) * t * controlX
      + Math.pow(t, 2) * finalX;

    const y = Math.pow(1 - t, 2) * inicioY
      + 2 * (1 - t) * t * controlY
      + Math.pow(t, 2) * finalY;

    return { x, y };
  }


  // Genera el recorrido SVG
  obtenerTrayectoria() {

    const inicioX = 15;
    const finalX = 345;

    const inicioY = 120 + (this.angulo * this.sentido);
    const finalY = 120 - (this.angulo * this.sentido);

    const controlX = 180;
    const controlY = 120 + (this.curvatura * this.sentido);

    return `M ${inicioX} ${inicioY} Q ${controlX} ${controlY} ${finalX} ${finalY}`;
  }


  // Calcula los parámetros de la trayectoria
  generarTrayectoria() {

    const id = Number(this.objeto?.id);

    this.angulo = (id % 60) - 30;

    this.sentido = 1;

    if (id % 2 !== 0) {
      this.sentido = -1;
    }

    const distancia = Number(
      this.objeto?.close_approach_data[0]?.miss_distance?.lunar
    ) || 0;

    this.distanciaVisual = Math.min(
      Math.max(distancia * 5, 35),
      100
    );

    this.curvatura = this.distanciaVisual;
  }


  // Limpia el intervalo al destruir el componente
  ngOnDestroy() {
    this.pausar();
  }

}
