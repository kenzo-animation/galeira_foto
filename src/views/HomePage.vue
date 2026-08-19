<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <ion-button color="medium" @click="logout">Sair</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Olá, {{ currentUser?.name || 'usuário' }}</ion-card-title>
          <ion-card-subtitle>Galeira de fotos</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p>Adicione quantas fotos quiser usando a câmera ou a galeria.</p>
        </ion-card-content>
      </ion-card>

      <div v-if="fotos.length" class="photo-grid">
        <div v-for="(foto, index) in fotos" :key="`${foto}-${index}`" class="photo-item">
          <img :src="foto" :alt="`Foto ${index + 1}`" />
        </div>
      </div>

      <ion-card v-else>
        <ion-card-content>Nenhuma foto adicionada ainda.</ion-card-content>
      </ion-card>

      <ion-button expand="block" class="ion-margin-top" @click="tirarFoto">
        Tirar foto
      </ion-button>

      <ion-button expand="block" fill="outline" class="ion-margin-top" @click="abrirGaleria">
        Escolher da galeria
      </ion-button>

      <ion-button expand="block" fill="clear" class="ion-margin-top" @click="openAbout">
        Sobre
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  toastController,
} from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { ref, onMounted } from 'vue'
import router from '@/router'
import { getActiveUser, logoutUser } from '@/utils/auth'

const currentUser = ref(getActiveUser())
const fotos = ref<string[]>([])

async function showToast(message: string, color: string = 'primary') {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'bottom',
  })

  await toast.present()
}

async function verificarPermissao() {
  try {
    const status = await Camera.checkPermissions()

    if (status.camera !== 'granted' && status.photos !== 'granted') {
      const result = await Camera.requestPermissions()

      if (result.camera !== 'granted' && result.photos !== 'granted') {
        await showToast('Permissão de câmera e galeria negada.', 'warning')
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
    const autorizado = await verificarPermissao()

    if (!autorizado) {
      return
    }

    const foto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source,
      quality: 90,
      width: 1200,
    })

    if (foto.dataUrl) {
      fotos.value = [foto.dataUrl, ...fotos.value]
    }
  } catch (err: unknown) {
    if (String(err).includes('cancelled')) {
      return
    }

    await showToast('Não foi possível acessar a mídia.', 'danger')
  }
}

async function tirarFoto() {
  await adicionarFoto(CameraSource.Prompt)
}

async function abrirGaleria() {
  await adicionarFoto(CameraSource.Photos)
}

function logout() {
  logoutUser()
  router.replace('/login')
}

function openAbout() {
  router.push('/sobre')
}

onMounted(() => {
  currentUser.value = getActiveUser()
  void verificarPermissao()
})
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.photo-item {
  overflow: hidden;
  border-radius: 12px;
  background: #f4f5f8;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
}

.photo-item img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}
</style>
