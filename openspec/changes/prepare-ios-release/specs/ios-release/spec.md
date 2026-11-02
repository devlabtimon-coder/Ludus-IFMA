## ADDED Requirements

### Requirement: Login com Google no iOS
O app SHALL usar no iOS o client ID e o URL scheme do mesmo projeto Google do `GoogleService-Info.plist`, e apresentar o botão como login institucional do IFMA.

#### Scenario: Entrar com Google no iPhone
- **WHEN** o aluno toca em "Entrar com conta IFMA (Google)" no iPhone
- **THEN** o fluxo do Google abre e volta ao app sem fechar

### Requirement: Permissões explicadas
O app MUST pedir só câmera e fotos no iOS, com texto em português que diga para que servem.

#### Scenario: Primeira foto do documento
- **WHEN** o aluno vai fotografar o documento
- **THEN** o iOS mostra o motivo em português, e o app não pede microfone nem Face ID

### Requirement: Excluir conta pelo app
O app SHALL oferecer "Excluir minha conta" em Perfil › Conta para alunos, com confirmação por senha e pela palavra EXCLUIR.

#### Scenario: Exclusão concluída
- **WHEN** o aluno confirma a exclusão
- **THEN** a conta é excluída, a sessão termina e o app volta ao início sem telas logadas na pilha

#### Scenario: Erro na exclusão
- **WHEN** a API recusa (senha errada ou jogo emprestado)
- **THEN** a mensagem aparece dentro do modal

### Requirement: Conteúdo abaixo da área segura
Cabeçalhos e botões de voltar MUST ficar abaixo da área segura do topo, sem mudar a posição no Android.

#### Scenario: iPhone com Dynamic Island
- **WHEN** uma tela com cabeçalho próprio abre no iPhone 15 Pro
- **THEN** o botão de voltar fica abaixo da ilha
