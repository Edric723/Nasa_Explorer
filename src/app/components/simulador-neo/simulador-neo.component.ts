import { Component, Input, OnChanges, OnDestroy, SimpleChanges, signal, computed } from '@angular/core';

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
  private parametros = signal({ angulo: 0, curvatura: 0, sentido: 1 });


  /**
   * Calcula los puntos de control de la trayectoria según los parámetros.
   * @returns Puntos de control (inicio, final y control) de la trayectoria.
   */
  private puntos = computed(() => {
    const { angulo, curvatura, sentido } = this.parametros();

    return {
      inicioX: 15,
      finalX: 345,
      controlX: 180,
      inicioY: 120 + angulo * sentido,
      finalY: 120 - angulo * sentido,
      controlY: 120 + curvatura * sentido
    };
  });


  /**
   * Genera la cadena de comandos SVG para la trayectoria del objeto.
   * @returns Comandos SVG para la trayectoria.
   */
  trayectoria = computed(() => {
    const p = this.puntos();

    return `M ${p.inicioX} ${p.inicioY} Q ${p.controlX} ${p.controlY} ${p.finalX} ${p.finalY}`;
  });


  /**   
   * Calcula la posición del objeto en la trayectoria según el progreso.
   * @returns Coordenadas (x, y) del objeto en la trayectoria.
   */
  posicion = computed(() => {
    const t = this.progreso() / 100;
    const p = this.puntos();

    const x = Math.pow(1 - t, 2) * p.inicioX
      + 2 * (1 - t) * t * p.controlX
      + Math.pow(t, 2) * p.finalX;

    const y = Math.pow(1 - t, 2) * p.inicioY
      + 2 * (1 - t) * t * p.controlY
      + Math.pow(t, 2) * p.finalY;

    return { x, y };
  });



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


  // Permite cambiar manualmente el progreso, ya sea mediante un control deslizante o un rango de valores.
  cambiarProgreso(valor: number | { lower: number; upper: number }) {
    if (typeof valor === 'number') {
      this.pausar();
      this.progreso.set(valor);
    }
  }


  /**
   * Genera la trayectoria del objeto según sus parámetros.
   */
  generarTrayectoria() {
    const id = Number(this.objeto?.id);

    const angulo = (id % 60) - 30;
    const sentido = id % 2 !== 0 ? -1 : 1;

    const distancia = Number(
      this.objeto?.close_approach_data[0]?.miss_distance?.lunar
    ) || 0;

    const curvatura = Math.min(
      Math.max(distancia * 5, 35),
      100
    );

    this.parametros.set({ angulo, curvatura, sentido });
  }


  // Limpia el intervalo al destruir el componente
  ngOnDestroy() {
    this.pausar();
  }

}
