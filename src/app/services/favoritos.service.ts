import { Injectable, inject } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  collection, deleteDoc, doc, getDoc, getDocs,
  getFirestore, initializeFirestore, setDoc
} from 'firebase/firestore';

import { environment } from '../../environments/environment';
import { Apod } from '../models/apod.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private authService = inject(AuthService);

  private db = this.iniciarFirestore();

  // Inicializa Firestore, reutilizando la instancia si ya existe.
  private iniciarFirestore() {
    if (getApps().length > 0) {
      return getFirestore(getApp());
    }

    return initializeFirestore(
      initializeApp(environment.firebase),
      { ignoreUndefinedProperties: true }
    );
  }

  // Obtiene la referencia a la colección de favoritos del usuario actual.
  private coleccion() {
    const idUsuario = this.authService.obtenerIdUsuario();

    if (!idUsuario) {
      throw new Error('No hay un usuario con sesión iniciada.');
    }

    return collection(this.db, 'usuarios', idUsuario, 'favoritos');
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