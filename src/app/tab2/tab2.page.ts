import { Component, OnInit, signal } from '@angular/core';
import { NeoService } from '../services/neo.service';
import { ObjetoCercano } from '../models/neo.model';

/*Muestra los asteroides que pasan cerca de la Tierra hoy y
 en los 2 días siguientes, ordenados por fecha de acercamiento*/
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  // Señales (mismo patrón que tab1 y tab3)
  objetos = signal<ObjetoCercano[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string>('');

  constructor(private neoService: NeoService) { }

  /** Al abrir la pantalla se cargan los objetos automáticamente. */
  ngOnInit() {
    this.cargarObjetos();
  }

  cargarObjetos() {
    this.cargando.set(true);
    this.error.set('');

    const hoy = new Date();
    const fin = new Date();
    fin.setDate(hoy.getDate() + 2);

    this.neoService
      .obtenerObjetos(this.formatearFecha(hoy), this.formatearFecha(fin))
      .subscribe({
        next: (respuesta) => {
          // La API agrupa los objetos por fecha: los unimos en una sola lista
          const lista = Object.values(respuesta.near_earth_objects).flat();

          // Orden cronológico usando la fecha en milisegundos
          lista.sort((a, b) =>
            (a.close_approach_data[0]?.epoch_date_close_approach ?? 0) -
            (b.close_approach_data[0]?.epoch_date_close_approach ?? 0)
          );

          this.objetos.set(lista);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los objetos cercanos a la Tierra.');
          this.cargando.set(false);
        },
      });
  }

  /* Identifica cada tarjeta por su id para que Angular no la redibuje de más. */
  trackPorId(_indice: number, objeto: ObjetoCercano): string {
    return objeto.id;
  }

  //Año de descubrimiento, estado de la órbita
  etiquetaObjeto(nombre: string): string {
    const texto = nombre.trim();

    let estado = 'Órbita sin confirmar';
    if (/^\d+\s+[^\s(]/.test(texto)) {
      estado = 'Con nombre propio';
    } else if (/^\d+\s*\(/.test(texto)) {
      estado = 'Órbita confirmada';
    }

    // Busca el año dentro del código de descubrimiento (ej. "2019 CJ4")
    const anio = texto.match(/\b(1[89]\d{2}|20\d{2})\s[A-Z]{2}\d*\b/)?.[1];

    return anio ? `Descubierto en ${anio} · ${estado}` : estado;
  }

  /* Convierte una fecha al formato AAAA-MM-DD que pide la API. */
  private formatearFecha(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}