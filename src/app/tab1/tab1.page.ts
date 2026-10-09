
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';
import { ToastController } from '@ionic/angular/lazy';
import { CardService } from '../services/card.service';
import { Tarjeta } from '../models/tarjeta.model';

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
   * @description Crea una alerta para ingresar el nombre de la tarjeta y llama a la función crearTarjeta del servicio CardService.
   * @return No retorna ningún valor. La función es asíncrona.
  */
  async agregarCard() {
    const alerta = await this.alertController.create({
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
            if (this.cardService.validarInput(data)) {
              const creadaOk = this.cardService.crearTarjeta(data.titulo);
              if (creadaOk) { //Se verifica si la variable tiene un valor, es decir, que fue creada 
                this.presentToast('Tarjeta creada correctamente', 'success');
              }
            }
          }
        }
      ]
    })
    await alerta.present();
    console.log("Click en el boton");
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


  /**
   * @function editarTarjeta
   * @description Muestra en consola la tarjeta que se desea editar.  
   * @param tarjeta Objeto de tipo Tarjeta que contiene la información de la tarjeta a editar.
   * @return No retorna ningún valor.
   */ 
  editarTarjeta(tarjeta: Tarjeta) {
    console.log("Editar tarjeta:", tarjeta);
  }

  /**
   * @function eliminarTarjeta
   * @description Muestra en consola la tarjeta que se desea eliminar.  
   * @param tarjeta Objeto de tipo Tarjeta que contiene la información de la tarjeta a eliminar.
   * @return No retorna ningún valor.
   */ 
  eliminarTarjeta(tarjeta: Tarjeta) {
    console.log("Eliminar tarjeta:", tarjeta);
  }

}

