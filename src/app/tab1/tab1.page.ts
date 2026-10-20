import { Component, OnInit, signal } from '@angular/core';
import { ApodService } from '../services/apod.service';
import { Apod } from '../models/apod.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  apod = signal<Apod | null>(null);
  videoUrl = signal('');
  cargando = signal(true);
  error = signal('');

  videoYoutubeUrl = signal<SafeResourceUrl | null>(null);
  esVideoYoutube = signal(false);

  imagenAmpliada = false;

  constructor(
    private apodService: ApodService,
    private sanitizer: DomSanitizer
  ) { }

  // Achicar la imagen del día por si es de un tamaño desmesurado.
  get imagenUrl(): string {
    const url = this.apod()?.hdurl;

    if (!url) return '';

    return url.replace(/w=\d+/, 'w=1200').replace(/&h=\d+/, '');
  }


  ngOnInit() {

    this.apodService.obtenerApod().subscribe({
      next: (respuesta) => {

        if (respuesta.length > 0) {

          const apod = respuesta[0];

          console.log(respuesta);
          this.apod.set(apod);

          this.detectarVideo(apod);

        } else {

          this.apod.set(null);

        }

        this.cargando.set(false);
      },

      error: (err) => {

        console.error('Error al consultar APOD:', err);

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





  // Por ahora sin uso...
  ampliarImagen() {
    this.imagenAmpliada = true;
  }

  cerrarImagen() {
    this.imagenAmpliada = false;
  }
}
