import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ApodService } from '../../services/apod.service';
import { Apod, urlImagen } from '../../models/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FavoritosService } from '../../services/favoritos.service';

// Únicos hosts de video permitidos dentro del iframe.
const HOSTS_YOUTUBE = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com'
];

@Component({
  selector: 'app-apod',
  templateUrl: 'apod.page.html',
  styleUrls: ['apod.page.scss'],
  standalone: false,
})

export class ApodPage implements OnInit {
  private apodService = inject(ApodService);
  private sanitizer = inject(DomSanitizer);
  private favoritosService = inject(FavoritosService);

  apod = signal<Apod | null>(null);
  videoUrl = signal('');
  esFavorito = signal(false);
  cargando = signal(true);
  error = signal('');

  videoYoutubeUrl = signal<SafeResourceUrl | null>(null);
  esVideoYoutube = signal(false);


  // Achicar la imagen del día por si es de un tamaño desmesurado.
  imagenUrl = computed(() => {
    const apod = this.apod();

    return apod ? urlImagen(apod) : '';
  });


  ngOnInit() {
    this.apodService.obtenerApod().subscribe({
      next: ([apod]) => {
        if (apod) {
          this.apod.set(apod);
          this.detectarVideo(apod);
          this.sincronizarFavorito();
        } else {
          this.error.set('No hay una imagen astronómica disponible por el momento.');
        }

        this.cargando.set(false);
      },

      error: () => {
        this.error.set('No se pudo cargar la imagen astronómica.');
        this.cargando.set(false);
      }
    });
  }


  // Ionic cachea la página: se vuelve a consultar cada vez que se entra.
  ionViewWillEnter() {
    this.sincronizarFavorito();
  }


  private sincronizarFavorito() {
    const apod = this.apod();

    if (!apod) {
      return;
    }

    this.favoritosService.esFavorito(apod)
      .then(valor => this.esFavorito.set(valor))
      .catch(() => this.esFavorito.set(false));
  }


  /**
   * @function detectarVideo
   * @description Detecta el tipo de video, cuando el apod es un video. Distingue entre video de youtube, o video mp4.
   * @param apod
   */
  detectarVideo(apod: Apod): void {

    this.videoUrl.set('');
    this.videoYoutubeUrl.set(null);
    this.esVideoYoutube.set(false);

    if (apod.media_type !== 'video' || !apod.basic_html) {
      return;
    }

    const html = apod.basic_html;

    // Buscar un video MP4.
    const mp4 = html.match(/<source[^>]+src=["']([^"']+)["']/i);

    if (mp4) {
      this.videoUrl.set(mp4[1]);
      return;
    }

    // Buscar un video de YouTube.
    const youtube = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);

    if (!youtube) {
      return;
    }

    let url = youtube[1];

    if (url.startsWith('//')) {
      url = 'https:' + url;
    }

    // Solo se acepta https y un host de YouTube conocido.
    try {
      const { protocol, hostname } = new URL(url);

      if (protocol !== 'https:' || !HOSTS_YOUTUBE.includes(hostname)) {
        return;
      }
    } catch {
      return;
    }

    this.videoYoutubeUrl.set(
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );

    this.esVideoYoutube.set(true);
  }


  async alternarFavorito() {
    const apod = this.apod();

    if (!apod) {
      return;
    }

    try {
      if (this.esFavorito()) {
        await this.favoritosService.eliminar(apod);
      } else {
        await this.favoritosService.agregar(apod);
      }

      this.esFavorito.set(!this.esFavorito());
    } catch {
      this.error.set('No se pudo actualizar tus favoritos.');
    }
  }
}