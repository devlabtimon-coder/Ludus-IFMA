# Ludus — Aplicativo

Aplicativo mobile do **Ludus**, sistema de empréstimo de jogos de tabuleiro do IFMA Campus Timon. Alunos e servidores consultam o acervo, reservam exemplares, acompanham seus aluguéis e participam do ranking de temporadas.

O app consome a API do projeto **Backend-Ludus**.

## Funcionalidades

- Cadastro com e-mail institucional (ou Google) e verificação por e-mail ou telefone
- Envio de documentos para aprovação do cadastro
- Catálogo com busca e filtros por mecânica, jogadores, tempo e categoria
- Reserva de exemplares com calendário de disponibilidade e feriados
- Acompanhamento e cancelamento de aluguéis
- Favoritos, avaliações e aviso de disponibilidade de jogos
- Ranking, níveis, temporadas e carteira de cupons
- Notificações push com abertura direta da tela relacionada
- Área administrativa: aluguéis, jogos, exemplares e categorias de clientes

## Tecnologias

- [Expo](https://expo.dev) SDK 54 e React Native 0.81
- TypeScript (modo `strict`)
- Expo Router (rotas baseadas em arquivos)
- Axios para a API, Expo Secure Store para o token de sessão
- Firebase Auth (verificação de telefone) e Google Sign-In
- Expo Notifications

## Pré-requisitos

- Node.js 20 ou superior
- Conta Expo com acesso ao projeto no EAS
- Android Studio ou Xcode para rodar o development build

O app usa módulos nativos (Firebase, Google Sign-In), então **não roda no Expo Go**; é preciso um development build.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo e preencha os valores:

   ```bash
   cp .env.example .env
   ```

   | Variável | Descrição |
   |---|---|
   | `EXPO_PUBLIC_API_URL` | URL da API (Backend-Ludus) |
   | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Client ID web do Google, usado pelo Google Sign-In |
   | `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Client ID iOS do Google |
   | `EXPO_PUBLIC_IFMA_MODE` | `true` para aceitar apenas e-mails do IFMA |

3. Os arquivos `google-services.json` (Android) e `GoogleService-Info.plist` (iOS) do Firebase devem estar na raiz do projeto.

## Executando

```bash
npm run android   # compila e abre no Android
npm run ios       # compila e abre no iOS
npm start         # inicia o Metro para um development build já instalado
```

## Qualidade

```bash
npm run lint       # ESLint (eslint-config-expo)
npx tsc --noEmit   # checagem de tipos
```

## Builds (EAS)

| Perfil | Uso |
|---|---|
| `development` | Development client para desenvolvimento local |
| `preview` | Distribuição interna para testes |
| `production` | Loja; versão incrementada automaticamente |

```bash
eas build --profile production --platform android
```

As variáveis do perfil `production` ficam em `eas.json`.

## Estrutura

```
app/                 Rotas (Expo Router); cada arquivo reexporta uma tela
  admin/             Rotas da área administrativa
  profile/           Rotas do perfil do usuário
  game/[id].tsx      Detalhes de um jogo
src/
  screens/           Telas
  components/        Componentes agrupados por funcionalidade
  contexts/          AuthContext (sessão) e FiltersContext (filtros do catálogo)
  services/          Cliente da API, push, navegação e alertas
  constants/         Constantes compartilhadas
assets/              Imagens e ícones
```
