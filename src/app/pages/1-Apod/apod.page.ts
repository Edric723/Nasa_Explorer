import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ApodService } from '../../services/apod.service';
import { Apod } from '../../models/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-apod',
  templateUrl: 'apod.page.html',
  styleUrls: ['apod.page.scss'],
  standalone: false,
})

export class ApodPage implements OnInit {
  private apodService = inject(ApodService);
  private sanitizer = inject(DomSanitizer);

  apod = signal<Apod | null>(null);
  videoUrl = signal('');
  cargando = signal(true);
  error = signal('');

  videoYoutubeUrl = signal<SafeResourceUrl | null>(null);
  esVideoYoutube = signal(false);

  
  // Achicar la imagen del día por si es de un tamaño desmesurado.
  imagenUrl = computed(() => {
    const url = this.apod()?.hdurl || this.apod()?.url;
  
    return url ? url.replace(/w=\d+/, 'w=1200').replace(/&h=\d+/, '') : '';
  });


  ngOnInit() {

    this.apodService.obtenerApod().subscribe({
      next: ([apod]) => {
        if (apod) {
          this.apod.set(apod);
          this.detectarVideo(apod);
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


  /**
   * @function detectarVideo
   * @description Detecta el tipo de video, cuando el apod es un video. Distingue entre video de youtube, o video mp4.
   * @param apod 
   * @returns 
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

  this.videoYoutubeUrl.set(
    this.sanitizer.bypassSecurityTrustResourceUrl(url)
  );

  this.esVideoYoutube.set(true);

  }
}
