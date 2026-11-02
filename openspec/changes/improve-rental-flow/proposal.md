# Proposal

## Why

A auditoria do fluxo de aluguel encontrou problemas que fazem o aluno perder reserva, pontos ou a confiança no app:
- o retry da API repetia POST em timeout e podia duplicar a reserva;
- conta bloqueada apagava o token mas deixava o aluno nas telas logadas;
- cancelar a reserva era um toque só, sem confirmação, sem aviso dos 2 pontos e sem tratar erro;
- a lista de aluguéis não mostrava o horário, usava rótulos diferentes dos detalhes e, sem rede, dizia "Nenhum aluguel em andamento";
- a tela do jogo pedia documentos a quem já estava em análise, enquanto o perfil dizia "Em análise";
- textos de categoria e pontuação diferentes das regras do backend;
- notificações antigas do "Me avise" (`/details?id=`) não abriam o jogo, e o toque com o app fechado se perdia;
- mensagens técnicas ("Rota Inválida (404)", "verifique o backend") e botões só com ícone sem rótulo para leitor de tela.

## What Changes

- API: só GET/HEAD/OPTIONS são repetidos (rede ou 5xx), timeout de 15 s (60 s para envio de fotos). Conta bloqueada chama o logout do contexto, limpa a pilha e vai para o login.
- Aluguéis: data e faixa de horário em cada item, rótulos "Aguardando retirada"/"Com você" em lista e detalhes, instruções de retirada, estado de erro com "Tentar novamente", botão "Explorar jogos" na lista vazia.
- Cancelamento com confirmação dentro do modal, erro no próprio modal e aviso de sucesso depois que o modal fecha. Pela decisão de produto, a confirmação avisa a perda de 2 pontos só quando faltam menos de 2 horas para a retirada.
- `getVerificationState` (`src/utils/verification.ts`) usado na tela do jogo e no banner do perfil.
- Botão de voltar nos estados de carregamento, erro e jogo não encontrado; voltar sem histórico leva à Home.
- Guia e Sistema de Pontuação: marcos de 11, 31 e 61 aluguéis e tiers do `category.service`, -2 só ao cancelar com menos de 2h e -5 por não comparecimento. O Guia já descreve a promoção por aluguel devolvido no prazo e sem avaria (decisão de produto). Alertas da reserva usam a mensagem do servidor.
- Notificações: `/details?id=X` abre `/game/X`; toque com o app fechado é guardado até a splash decidir a tela inicial.
- Textos de erro sem jargão; saudação da Home com `name`; rótulos e área de toque nos botões só com ícone.

## Capabilities

### New Capabilities
- `rental-flow`: reserva, acompanhamento e cancelamento de aluguéis no app, com as regras do backend.

### Modified Capabilities

## Impact

- Só o app. Usa os códigos de erro já existentes no backend (`RENTAL_LIMIT_REACHED`, `ACCOUNT_PENDING`, `CONCURRENCY_CONFLICT`, `ONLY_PENDING_CAN_CANCEL`, `ACCOUNT_BLOCKED`).
- Requisições GET que falham por timeout não são mais repetidas; o tempo máximo de espera cai de ~2 min para 15 s.
- Preço "R$/dia" e prazo "até 3 dias" nos Termos não mudam aqui.
- O backend ainda aplica -2 em todo cancelamento e promove pela retirada confirmada; a mudança para as novas regras vem em outra rodada.
