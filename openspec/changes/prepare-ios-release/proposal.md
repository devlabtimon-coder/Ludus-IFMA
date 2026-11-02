# Proposal

## Why

Primeira submissão do Ludus para a App Store. A auditoria encontrou bloqueios de revisão e de funcionamento no iPhone:
- login com Google com IDs de cliente de projetos diferentes;
- Firebase sem configuração nativa no iOS;
- falta de exclusão de conta;
- permissões genéricas em inglês;
- cabeçalhos por baixo da Dynamic Island;
- alertas que não aparecem quando um modal fecha;
- telas que chamam rotas inexistentes.

## What Changes

- `app.json`/`eas.json`:
  - IDs do Google iOS do projeto 706484468010;
  - plugins `@react-native-firebase/app` e `/auth`;
  - textos de câmera e fotos em português, sem pedidos de microfone e Face ID;
  - privacy manifest, `supportsTablet: false` e tema claro;
  - `remote-notification` em segundo plano.
- Remoção do termo de aluguel morto (`/rentals/accept-terms`) e da tela SUAP (`/auth/ifma/verify-suap`).
- Login: textos sem jargão técnico, "Entrar com conta IFMA (Google)" e autopreenchimento de senha.
- `useSafeTop`: cabeçalhos e botões de voltar abaixo da área segura.
- Alertas e seletor de foto esperam o modal anterior fechar.
- "Excluir minha conta" em Perfil › Conta (usa `DELETE /users/me` do backend) e Política de Privacidade atualizada.
- Sair da conta limpa a pilha de telas.

## Capabilities

### New Capabilities
- `ios-release`: requisitos para publicar e usar o app no iOS.

### Modified Capabilities

## Impact

- Configuração nativa gerada pelo EAS (`ios/` e `android/` não são versionados).
- Depende do backend com `DELETE /users/me` (change `add-account-deletion`).
- No Android, o pedido de gravação de áudio deixa de ser declarado (`microphonePermission: false`), e os cabeçalhos ficam iguais.
