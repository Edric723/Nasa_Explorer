
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';
import { ToastController } from '@ionic/angular/lazy';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public cardService: CardService,
  ) { }


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

