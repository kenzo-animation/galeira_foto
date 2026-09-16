<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="camera" href="/home/camera">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Capturar</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="galeria" href="/home/galeria">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Galeria</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sobre" href="/home/sobre">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Sobre</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
