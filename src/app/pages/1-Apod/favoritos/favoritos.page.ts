import { Component, inject, signal } from '@angular/core';

import { Apod, urlImagen } from '../../../models/apod.model';
import { FavoritosService } from '../../../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false
})

export class FavoritosPage {
  private favoritosService = inject(FavoritosService);

  favoritos = signal<Apod[]>([]);
  cargando = signal(true);
  error = signal('');

  readonly urlImagen = urlImagen;

  // Se recarga cada vez que se entra, por si algo cambió desde la pestaña APOD.
  async ionViewWillEnter() {
    this.cargando.set(true);
    this.error.set('');

    try {
      const lista = await this.favoritosService.listar();

      this.favoritos.set(lista.sort((a, b) => b.date.localeCompare(a.date)));
    } catch {
      this.error.set('No se pudieron cargar tus favoritos.');
    }

    this.cargando.set(false);
  }

  async quitar(apod: Apod) {
    try {
      await this.favoritosService.eliminar(apod);

      this.favoritos.update(lista =>
        lista.filter(favorito => favorito.post_id !== apod.post_id)
      );
    } catch {
      this.error.set('No se pudo quitar el favorito.');
    }
  }
}