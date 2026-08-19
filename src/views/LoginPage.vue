<template>
  <ion-page>
    <ion-content class="ion-padding login-screen">
      <div class="login-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Galeira Foto</ion-card-title>
            <ion-card-subtitle>Login</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Email</ion-label>
              <ion-input v-model="form.email" type="email" autocomplete="email" />
            </ion-item>

            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Senha</ion-label>
              <ion-input v-model="form.password" type="password" autocomplete="current-password" />
            </ion-item>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <ion-button expand="block" class="ion-margin-bottom" @click="handleLogin">
              Entrar
            </ion-button>

            <ion-button expand="block" fill="outline" @click="goToRegister">
              Criar conta
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  toastController,
} from '@ionic/vue'
import { reactive, ref } from 'vue'
import router from '@/router'
import { loginUser } from '@/utils/auth'

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')

async function showToast(message: string, color: string = 'primary') {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'bottom',
  })

  await toast.present()
}

async function handleLogin() {
  if (!form.email.trim() || !form.password.trim()) {
    errorMessage.value = 'Preencha email e senha para continuar.'
    return
  }

  const user = loginUser(form.email, form.password)

  if (!user) {
    errorMessage.value = 'Credenciais inválidas. Verifique os dados ou cadastre-se.'
    await showToast('Credenciais inválidas', 'danger')
    return
  }

  errorMessage.value = ''
  await showToast(`Bem-vindo, ${user.name}!`, 'success')
  await router.replace('/home')
}

function goToRegister() {
  router.push('/cadastro')
}
</script>

<style scoped>
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f4f5f8 0%, #dfe7ff 100%);
}

.login-container {
  width: min(100%, 420px);
}

.error-text {
  color: var(--ion-color-danger);
  margin: 0 0 16px;
  font-size: 0.9rem;
}
</style>
