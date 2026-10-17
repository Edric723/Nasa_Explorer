
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';
import { ToastController } from '@ionic/angular/lazy';
import { firstValueFrom } from 'rxjs';
import { CardService } from '../services/card.service';

interface ApodResponse {
  date: string;
  explanation: string;
  media_type: 'image';
  title: string;
  url: string;
  hdurl?: string;
  copyright?: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  readonly imagenDelDia = signal<ApodResponse | null>(null);
  readonly cargandoImagen = signal(false);
  readonly errorImagen = signal('');
  public alertController = inject(AlertController);
  public toastController = inject(ToastController);
  public cardService = inject(CardService);
  private readonly http = inject(HttpClient);

  ionViewWillEnter(): void {
    void this.cargarImagenDelDia();
  }

  async cargarImagenDelDia(): Promise<void> {
    if (this.cargandoImagen() || this.imagenDelDia()) {
      return;
    }

    this.cargandoImagen.set(true);
    this.errorImagen.set('');

    try {
      const imagen = await firstValueFrom(
        this.http.get<ApodResponse>(
          'https://api.nasa.gov/planetary/apod?api_key=' + 'yQMSrKyjqTf6iwezcVxDgu72dfaBefnejKxXfbZw'
          
        ),
      );

      if (imagen.media_type !== 'image' || !imagen.url || !imagen.title) {
        throw new Error('La respuesta de APOD no contiene una imagen válida.');
      }

      this.imagenDelDia.set(imagen);
      console.log('Respuesta de APOD:', imagen);
    } catch (error) {
      console.error('No se pudo cargar la imagen del día de NASA.', error);
      this.errorImagen.set('No se pudo cargar la imagen. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      this.cargandoImagen.set(false);
    }
  }

  /** 
   * @function agregarCard 
   * @description Crea y muestra una alerta para ingresar el nombre de una nueva tarjeta. 
   * @param No recibe parámetros. 
   * @return No retorna ningún valor. La función es asincrónica. 
   */

  async agregarCard() {
    let alerta = await this.alertController.create({
      header: "Agregar tarjeta",
      inputs: [
        {
          type: "text",
          name: "titulo",
          placeholder: "Ingresar nombre de la tarjeta"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Crear",
          handler: (data: any) => {
            if (this.validarInput(data)) {
              this.cardService.crearTarjeta(data.titulo);
              this.presentToast('Tarjeta creada correctamente', 'success');
            };
            console.log(data);
          }
        }
      ]
    })
    await alerta.present();
  }


  /** 
   * @function validarInput
   * @description Verifica que el input exista y que el campo titulo no esté vacío.
   * @param input Objeto de tipo any que contiene el valor del campo titulo.
   * @returns Retorna un booleano: true si el campo titulo contiene un valor; de lo contrario, muestra un mensaje de error y retorna false.
   */

validarInput(input: any): boolean {
  if (input && input.titulo) {
    return true;
  }
  this.presentToast('Debe ingresar un valor', 'danger');
  return false;
}



  /**
   @function presentToast 
   @description Crea y muestra un mensaje emergente (Toast) 
   @param mensaje Texto que se mostrará en el mensaje emergente. 
   @param color Color que tendrá el mensaje emergente. 
   @return No retorna ningún valor. La función es asíncrona.
  */  

  async presentToast(mensaje: string, color: string) {
  let toast = await this.toastController.create({
    message: mensaje,
    duration: 2000,
    color: color,
  });
  toast.present();
}

}
