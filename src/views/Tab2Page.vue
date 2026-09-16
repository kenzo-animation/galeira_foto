<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Galeria</ion-title>
        <ion-buttons slot="end">
          <ion-button color="medium" @click="logout">Sair</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card v-if="!fotos.length">
        <ion-card-content>Nenhuma foto salva ainda. Use o tab Capturar para adicionar imagens.</ion-card-content>
      </ion-card>

      <div v-else class="photo-grid">
        <ion-card v-for="foto in fotos" :key="foto.id" class="photo-card">
          <img :src="foto.dataUrl" :alt="`Foto salva em ${formatDate(foto.createdAt)}`" />
          <ion-card-content>
            <ion-note>{{ formatDate(foto.createdAt) }}</ion-note>
            <div class="photo-actions">
              <ion-button size="small" fill="outline" @click="compartilhar(foto.dataUrl)">
                Compartilhar
              </ion-button>
              <ion-button size="small" color="danger" fill="clear" @click="excluir(foto.id)">
                Excluir
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  alertController,
  toastController,
} from '@ionic/vue'
import { Share } from '@capacitor/share'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import { onIonViewWillEnter } from '@ionic/vue'
import { ref } from 'vue'
import router from '@/router'
import { getActiveUser, logoutUser } from '@/utils/auth'
import { listPhotos, removePhoto, type StoredPhoto } from '@/utils/photoDatabase'

const currentUser = getActiveUser()
const fotos = ref<StoredPhoto[]>([])

async function carregarFotos() {
  if (currentUser) {
    fotos.value = await listPhotos(currentUser.id)
  }
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(timestamp)
}

function dataUrlToFile(dataUrl: string) {
  const [header, base64] = dataUrl.split(',')
  const mimeType = header.match(/data:(.*?);base64/)?.[1] ?? 'image/jpeg'
  const extension = mimeType.split('/')[1] || 'jpg'

  return { base64, mimeType, extension }
}

async function compartilhar(dataUrl: string) {
  try {
    if (!Capacitor.isNativePlatform() && navigator.share) {
      const { base64, mimeType, extension } = dataUrlToFile(dataUrl)
      const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))
      const file = new File([bytes], `galeira-foto.${extension}`, { type: mimeType })
      await navigator.share({ title: 'Foto da Galeira Foto', files: [file] })
      return
    }

    const { base64, extension } = dataUrlToFile(dataUrl)
    const fileName = `galeira-foto-${Date.now()}.${extension}`
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Cache,
    })

    await Share.share({
      title: 'Foto da Galeira Foto',
      text: 'Foto compartilhada pelo Galeira Foto',
      url: savedFile.uri,
      dialogTitle: 'Compartilhar foto',
    })
  } catch {
    await showToast('O compartilhamento foi cancelado ou não está disponível.', 'warning')
  }
}

async function excluir(id: string) {
  const alert = await alertController.create({
    header: 'Excluir foto?',
    message: 'Esta ação não pode ser desfeita.',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          await removePhoto(id)
          await carregarFotos()
          await showToast('Foto excluída.', 'success')
        },
      },
    ],
  })
  await alert.present()
}

async function showToast(message: string, color: string) {
  const toast = await toastController.create({ message, duration: 2200, color, position: 'bottom' })
  await toast.present()
}

function logout() {
  logoutUser()
  router.replace('/login')
}

onIonViewWillEnter(() => {
  void carregarFotos()
})
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.photo-card {
  margin: 0;
}

.photo-card img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.photo-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}
</style>
