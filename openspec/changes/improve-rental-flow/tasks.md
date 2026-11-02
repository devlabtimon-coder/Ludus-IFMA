# Tasks

- [x] 1.1 Retry só em GET/HEAD/OPTIONS, timeout de 15 s e 60 s para envio de fotos
- [x] 1.2 `ACCOUNT_BLOCKED` chama o logout do AuthContext e vai para o login
- [x] 1.3 Lista de aluguéis com horário, rótulos iguais aos detalhes, instruções de retirada, erro e lista vazia
- [x] 1.4 Cancelar reserva com confirmação (perda de 2 pontos só a menos de 2h da retirada), erro no modal e aviso de sucesso
- [x] 1.5 `getVerificationState` na tela do jogo e no RegistrationBanner
- [x] 1.6 BackButton nos estados de carregamento, erro e jogo não encontrado
- [x] 1.7 Guia, Sistema de Pontuação e alertas da reserva conforme o backend
- [x] 1.8 Rotas de notificação (`/details?id=` → `/game/`) e toque com o app fechado
- [x] 1.9 Mensagens de erro sem jargão e saudação com `name`
- [x] 1.10 Acessibilidade dos botões só com ícone
- [x] 1.11 `tsc --noEmit` e eslint sem erros novos

## Rodada 2 (regras de produto)

- [x] 2.1 Sem "R$ / dia" nos cards, favoritos e tela do jogo; sem ordenação por preço; PriceRange removido
- [x] 2.2 Avisos para `SAME_DAY_ONLY` e `OVERDUE_RENTAL` na reserva
- [x] 2.3 "Me avise" também com `hasFreeSlotSoon = false`, com explicação e "Ver datas"
- [x] 2.4 Termo e Guia: mesmo dia, grátis, atraso -10 e bloqueio, cancelamento, não comparecimento, promoção e brindes
- [x] 2.5 Sistema de Pontuação: -10 pts no atraso
- [x] 2.6 Carteira como brindes, com situação, validade e instrução
- [x] 2.7 Aviso de jogo em atraso na tela de aluguéis
- [ ] 2.8 Testar no aparelho contra o backend da rodada 2 (`hasFreeSlotSoon`, `usedAt`, status ATIVO/USADO/EXPIRADO)

## Pendente

- [ ] Testar no aparelho: cancelamento (modal → alerta no iOS), conta bloqueada, toque em notificação com o app fechado, VoiceOver/TalkBack no rodapé
- [x] Textos de produto: preço "R$/dia" na tela do jogo, prazo "até 3 dias" nos Termos e "+2 pts ao devolver com atraso" (vira -10)
- [ ] Backend: -2 só a menos de 2h da retirada e promoção por aluguel devolvido no prazo e sem avaria
