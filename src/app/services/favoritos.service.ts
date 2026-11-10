import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  setDoc
} from 'firebase/firestore';

import { Apod } from '../models/apod.model';
import { AuthService } from './auth.service';
import { firebaseConfig } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private authService = inject(AuthService);

  private db = initializeFirestore(
    initializeApp(firebaseConfig),
    { ignoreUndefinedProperties: true }
  );

  // usuarios/{id de Cognito}/favoritos
  private coleccion() {
    return collection(
      this.db,
      'usuarios',
      this.authService.obtenerIdUsuario()!,
      'favoritos'
    );
  }

  private referencia(apod: Apod) {
    return doc(this.coleccion(), String(apod.post_id));
  }

  async listar(): Promise<Apod[]> {
    const resultado = await getDocs(this.coleccion());

    return resultado.docs.map(documento => documento.data() as Apod);
  }

  async esFavorito(apod: Apod): Promise<boolean> {
    return (await getDoc(this.referencia(apod))).exists();
  }

  async agregar(apod: Apod): Promise<void> {
    await setDoc(this.referencia(apod), apod);
  }

  async eliminar(apod: Apod): Promise<void> {
    await deleteDoc(this.referencia(apod));
  }
}