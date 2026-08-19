<template>
  <ion-page>
    <ion-content class="ion-padding register-screen">
      <div class="register-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Criar conta</ion-card-title>
            <ion-card-subtitle>Cadastre-se para continuar</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Nome</ion-label>
              <ion-input v-model="form.name" type="text" autocomplete="name" />
            </ion-item>

            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Email</ion-label>
              <ion-input v-model="form.email" type="email" autocomplete="email" />
            </ion-item>

            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Senha</ion-label>
              <ion-input v-model="form.password" type="password" autocomplete="new-password" />
            </ion-item>

            <ion-item fill="outline" class="ion-margin-bottom">
              <ion-label position="floating">Confirmar senha</ion-label>
              <ion-input v-model="form.confirmPassword" type="password" autocomplete="new-password" />
            </ion-item>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <ion-button expand="block" class="ion-margin-bottom" @click="handleRegister">
              Cadastrar
            </ion-button>

            <ion-button expand="block" fill="clear" @click="goToLogin">
              Já tenho conta
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
import { registerUser } from '@/utils/auth'

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
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

async function handleRegister() {
  if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
    errorMessage.value = 'Preencha todos os campos para concluir o cadastro.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'As senhas não conferem.'
    return
  }

  const user = registerUser(form.name, form.email, form.password)

  if (!user) {
    errorMessage.value = 'Este email já está cadastrado.'
    await showToast('Usuário já cadastrado', 'warning')
    return
  }

  errorMessage.value = ''
  await showToast('Cadastro realizado com sucesso!', 'success')
  await router.replace('/login')
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f4f5f8 0%, #dfe7ff 100%);
}

.register-container {
  width: min(100%, 420px);
}

.error-text {
  color: var(--ion-color-danger);
  margin: 0 0 16px;
  font-size: 0.9rem;
}
</style>
