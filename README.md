# Galeira Foto

Nome: Kenzo Ruthes dos Santos.
Curso: 3º info.
Unidade Curricular: codificar aplicaçoens para dispositivos moveis.

Aplicativo Ionic + Vue para cadastro e login com uso de câmera e galeria de fotos.

Repositório público: [github.com/kenzo-animation/galeira_foto](https://github.com/kenzo-animation/galeira_foto)

## Funcionalidades

- Tela de login
- Tela de cadastro
- Home acessível somente depois da autenticação
- Tabs para capturar, visualizar e gerenciar fotos e consultar informações
- Galeria persistente em banco local IndexedDB
- Exclusão e compartilhamento de fotos pelo menu nativo do Android, incluindo WhatsApp
- Tela Sobre com latitude, longitude, altitude, tema escuro persistente e status offline
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

4. Para preparar e rodar em Android Studio:
   ```bash
   npx cap sync android
   npx cap open android
   ```

   No Android Studio, execute o projeto gerado em `android/` em um emulador ou dispositivo físico.

## Estrutura principal

- `src/views/LoginPage.vue` — tela de login
- `src/views/RegisterPage.vue` — tela de cadastro
- `src/views/HomePage.vue` — home protegida
- `src/views/TabsPage.vue` — navegação principal com três tabs
- `src/views/Tab1Page.vue` — captura de fotos
- `src/views/Tab2Page.vue` — galeria com exclusão e compartilhamento
- `src/views/AboutPage.vue` — localização, tema e conectividade
- `src/utils/photoDatabase.ts` — banco local IndexedDB das fotos
- `src/utils/auth.ts` — autenticação e persistência local
- `src/router/index.ts` — roteamento com proteção de rotas

## Requisitos de permissão

O app usa os plugins `@capacitor/camera`, `@capacitor/filesystem` e `@capacitor/share` para converter cada imagem em um arquivo temporário e abrir o compartilhamento nativo. Também usa `@capacitor/geolocation` e solicita acesso à câmera, galeria e localização quando necessário. O manifesto Android declara as permissões de câmera, leitura de imagens e localização necessárias para versões atuais e anteriores do Android.

## Critérios de avaliação

- Código organizado em telas, rotas e utilitário de autenticação.
- README claro, com instruções de execução web e Android.
- Projeto preparado para execução no Android Studio com Capacitor.
- Solicitação de permissão para câmera e galeria antes do acesso às fotos.
- Dados das fotos mantidos em banco local e ações de excluir/compartilhar disponíveis na galeria.

## Observações

- O login usa armazenamento local do navegador para simular um cadastro simples.
- A home e a tela de sobre exigem autenticação válida.
- O fluxo foi implementado para rodar em Android com Capacitor.

