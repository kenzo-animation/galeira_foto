<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
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
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" class="ion-margin-top" @click="goHome">
        Voltar para a home
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import router from '@/router'

function goHome() {
  router.push('/home')
}
</script>
