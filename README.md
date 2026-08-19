# Galeira Foto

Aplicativo Ionic + Vue para cadastro e login com uso de câmera e galeria de fotos.

## Funcionalidades

- Tela de login
- Tela de cadastro
- Home acessível somente após autenticação
- Tela de sobre
- Solicitação de permissão para acessar câmera e galeria
- Persistência local de usuários em `localStorage`

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o app em modo web:
   ```bash
   npm run dev
   ```

3. Para compilar o projeto:
   ```bash
   npm run build
   ```

4. Para rodar em Android:
   ```bash
   npx cap add android
   npx cap open android
   ```

   Ou no ambiente do Android Studio, sincronize e execute o projeto gerado em `android/`.

## Estrutura principal

- `src/views/LoginPage.vue` — tela de login
- `src/views/RegisterPage.vue` — tela de cadastro
- `src/views/HomePage.vue` — home protegida
- `src/views/AboutPage.vue` — tela sobre
- `src/utils/auth.ts` — autenticação e persistência local
- `src/router/index.ts` — roteamento com proteção de rotas

## Requisitos de permissão

O app usa o plugin `@capacitor/camera` e solicita acesso à câmera e à galeria antes de abrir a câmera ou permitir seleção de imagem.

## Observações

- O login usa armazenamento local do navegador para simular um cadastro simples.
- A home e a tela de sobre exigem autenticação válida.
- O fluxo foi implementado para rodar em Android com Capacitor.

## Link do repositório

Publicar o projeto em um repositório GitHub público e informar a URL aqui.
