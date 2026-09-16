<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-chip v-if="!online" color="warning">Sem conexão com a internet</ion-chip>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Galeira Foto</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>
            O aplicativo foi desenvolvido para permitir que o usuário faça login, cadastre-se,
            acesse sua home e capture imagens por câmera ou galeria.
          </p>
          <p>
            A navegação e a autenticação foram pensadas para manter o acesso seguro e garantir
            que a home só fique disponível após o login válido.
          </p>
          <ion-list>
            <ion-item><ion-label>Latitude</ion-label><ion-note slot="end">{{ location.latitude }}</ion-note></ion-item>
            <ion-item><ion-label>Longitude</ion-label><ion-note slot="end">{{ location.longitude }}</ion-note></ion-item>
            <ion-item><ion-label>Altitude</ion-label><ion-note slot="end">{{ location.altitude }}</ion-note></ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-item lines="full">
        <ion-label>Modo escuro</ion-label>
        <ion-toggle v-model="darkMode" @ion-change="saveTheme" />
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="logout">Sair</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonChip,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/vue'
import { Geolocation } from '@capacitor/geolocation'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'
import type { PluginListenerHandle } from '@capacitor/core'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import router from '@/router'
import { logoutUser } from '@/utils/auth'

const darkMode = ref(false)
const online = ref(true)
const location = reactive({ latitude: 'Indisponível', longitude: 'Indisponível', altitude: 'Indisponível' })
let networkListener: PluginListenerHandle | undefined

function applyTheme(enabled: boolean) {
  document.documentElement.classList.toggle('ion-palette-dark', enabled)
}

async function saveTheme() {
  applyTheme(darkMode.value)
  await Preferences.set({ key: 'dark_mode', value: String(darkMode.value) })
}

async function loadLocation() {
  try {
    const position = await Geolocation.getCurrentPosition()
    location.latitude = position.coords.latitude.toFixed(6)
    location.longitude = position.coords.longitude.toFixed(6)
    location.altitude = position.coords.altitude === null ? 'Indisponível' : `${position.coords.altitude.toFixed(2)} m`
  } catch {
    location.latitude = 'Permissão não concedida'
    location.longitude = 'Permissão não concedida'
    location.altitude = 'Permissão não concedida'
  }
}

async function loadSettings() {
  const savedTheme = await Preferences.get({ key: 'dark_mode' })
  darkMode.value = savedTheme.value === 'true'
  applyTheme(darkMode.value)
  const status = await Network.getStatus()
  online.value = status.connected
  networkListener = await Network.addListener('networkStatusChange', (connection) => {
    online.value = connection.connected
  })
}

function logout() {
  logoutUser()
  router.replace('/login')
}

onMounted(() => {
  void loadSettings()
  void loadLocation()
})

onUnmounted(() => {
  void networkListener?.remove()
})
</script>
