<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Galeria</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Nova foto</ion-card-title>
          <ion-card-subtitle>As imagens ficam salvas no banco local do aparelho.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          Capture uma imagem com a câmera ou escolha uma foto já existente na galeria.
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" class="ion-margin-top" @click="tirarFoto">
        Tirar foto
      </ion-button>

      <ion-button expand="block" fill="outline" class="ion-margin-top" @click="abrirGaleria">
        Escolher da galeria
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  toastController,
} from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { getActiveUser } from '@/utils/auth'
import { savePhoto } from '@/utils/photoDatabase'

const currentUser = getActiveUser()

async function mostrarToast(message: string, color: string = 'primary', duration = 2000) {
  const toast = await toastController.create({
    message,
    duration,
    color,
    position: 'bottom',
  })

  await toast.present()
}

async function verificarPermissao(source?: CameraSource) {
  try {
    const status = await Camera.checkPermissions()
    const precisaCamera = !source || source === CameraSource.Prompt
    const precisaGaleria = !source || source === CameraSource.Photos

    if ((precisaCamera && status.camera !== 'granted') || (precisaGaleria && status.photos !== 'granted')) {
      const result = await Camera.requestPermissions()

      if ((precisaCamera && result.camera !== 'granted') || (precisaGaleria && result.photos !== 'granted')) {
        await mostrarToast('Permissão de câmera e galeria negada', 'warning')
        return false
      }
    }

    return true
  } catch {
    return true
  }
}

async function adicionarFoto(source: CameraSource) {
  try {
    const autorizado = await verificarPermissao(source)

    if (!autorizado) {
      return
    }

    const foto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source,
      quality: 90,
      width: 1200,
    })

    if (foto.dataUrl && currentUser) {
      await savePhoto(currentUser.id, foto.dataUrl)
      await mostrarToast('Foto salva na galeria.', 'success')
    }
  } catch (err: unknown) {
    if (String(err).includes('cancelled')) {
      return
    }

    await mostrarToast('Não foi possível acessar a mídia', 'danger')
  }
}

async function tirarFoto() {
  await adicionarFoto(CameraSource.Prompt)
}

async function abrirGaleria() {
  await adicionarFoto(CameraSource.Photos)
}

</script>