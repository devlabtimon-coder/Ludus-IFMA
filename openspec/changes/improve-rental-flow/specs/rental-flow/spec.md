## ADDED Requirements

### Requirement: Reserva sem duplicação
O app MUST repetir automaticamente apenas requisições GET, HEAD e OPTIONS, e nunca um POST de reserva.

#### Scenario: Timeout ao reservar
- **WHEN** o POST de reserva fica sem resposta
- **THEN** o app não reenvia o pedido e orienta o aluno a conferir Meus aluguéis antes de tentar de novo

### Requirement: Conta bloqueada encerra a sessão
O app SHALL encerrar a sessão, limpar a pilha de telas e abrir o login quando a API responder `ACCOUNT_BLOCKED`.

#### Scenario: Admin bloqueia o aluno
- **WHEN** uma requisição volta com 403 `ACCOUNT_BLOCKED`
- **THEN** o app sai da conta, vai para o login e mostra o aviso uma única vez

### Requirement: Cancelamento confirmado
O app MUST pedir confirmação antes de cancelar uma reserva pendente e avisar a perda de 2 pontos quando faltarem menos de 2 horas para a retirada.

#### Scenario: Cancelamento em cima da hora
- **WHEN** o aluno pede para cancelar faltando menos de 2 horas para a retirada
- **THEN** a confirmação avisa que ele perde 2 pontos

#### Scenario: Cancelamento com antecedência
- **WHEN** o aluno pede para cancelar faltando 2 horas ou mais para a retirada
- **THEN** a confirmação avisa que cancelar com antecedência não tira pontos

#### Scenario: Aluno confirma o cancelamento
- **WHEN** o aluno toca em "Cancelar reserva" e depois em "Sim, cancelar"
- **THEN** a reserva é cancelada, o modal fecha, um aviso de sucesso aparece e a lista é recarregada

#### Scenario: Falha ao cancelar
- **WHEN** a API recusa o cancelamento ou não responde
- **THEN** a mensagem de erro aparece dentro do modal de detalhes

### Requirement: Lista de aluguéis informativa
A lista SHALL mostrar a data e a faixa de horário de cada aluguel, os mesmos rótulos de status dos detalhes e, para reservas pendentes, onde e quando retirar.

#### Scenario: Reserva pendente
- **WHEN** o aluno abre Meus aluguéis com uma reserva pendente
- **THEN** o item mostra "Aguardando retirada", a data, o horário e a tolerância de 30 minutos

#### Scenario: Sem conexão
- **WHEN** a lista não carrega por erro de rede
- **THEN** o app mostra o erro com "Tentar novamente" em vez de "Nenhum aluguel em andamento"

### Requirement: Situação do cadastro única
A tela do jogo e o banner do perfil MUST usar o mesmo cálculo da situação do cadastro (não enviado, em análise, recusado, aprovado ou bloqueado).

#### Scenario: Documentos em análise
- **WHEN** um aluno com cadastro em análise toca em Alugar
- **THEN** o app informa que ele poderá alugar assim que a biblioteca aprovar, sem pedir novos documentos

#### Scenario: Documentos recusados
- **WHEN** um aluno com cadastro recusado toca em Alugar
- **THEN** o app mostra o motivo da recusa e o botão para reenviar

### Requirement: Regras exibidas iguais às do backend
Os textos de categoria e pontuação SHALL refletir as regras de produto: promoção ao completar 11, 31 e 61 aluguéis, tiers do `category.service`, -2 ao cancelar com menos de 2h de antecedência e -5 por não comparecimento.

#### Scenario: Aluno consulta o Guia
- **WHEN** o aluno abre a aba de categorias do Guia
- **THEN** cada categoria mostra quantos aluguéis a liberam e os tiers acessíveis

### Requirement: Toque em notificação abre o destino
O app MUST abrir a tela do jogo ao tocar numa notificação com rota `/details?id=<id>` ou `/game/<id>`, inclusive com o app fechado.

#### Scenario: Notificação antiga do Me avise
- **WHEN** o aluno toca numa notificação com rota `/details?id=X`
- **THEN** o app abre `/game/X`

#### Scenario: App fechado
- **WHEN** o aluno abre o app pelo toque numa notificação
- **THEN** a splash leva à Home e em seguida abre o destino da notificação

### Requirement: Aluguel grátis sem preço na tela
O app MUST NOT mostrar preço de aluguel ("R$ X / dia") em cards, favoritos ou na tela do jogo, nem oferecer filtro ou ordenação por preço. O selo "Valor de mercado" continua.

#### Scenario: Aluno abre a tela do jogo
- **WHEN** o aluno abre os detalhes de um jogo disponível
- **THEN** a barra inferior mostra "Grátis" e "Devolução no mesmo dia" ao lado de "Alugar", sem valor em reais

### Requirement: Erros de reserva das regras da rodada 2
O app SHALL mostrar um aviso claro quando o servidor recusar a reserva com `SAME_DAY_ONLY` ou `OVERDUE_RENTAL`, usando a mensagem do servidor no caso do atraso.

#### Scenario: Aluno com jogo em atraso tenta reservar
- **WHEN** o POST de reserva volta 409 `OVERDUE_RENTAL`
- **THEN** o app mostra "Jogo em atraso" com a mensagem do servidor

#### Scenario: Reserva fora do mesmo dia
- **WHEN** o POST de reserva volta 400 `SAME_DAY_ONLY`
- **THEN** o app explica que a retirada e a devolução precisam ser no mesmo dia

### Requirement: Me avise sem horário livre em breve
O app SHALL oferecer o "Me avise" quando o jogo estiver indisponível ou quando o servidor informar `hasFreeSlotSoon = false`; sem o campo, vale só a indisponibilidade.

#### Scenario: Jogo com exemplar mas sem horário nos próximos 7 dias
- **WHEN** o jogo tem `isAvailableNow = true` e `hasFreeSlotSoon = false`
- **THEN** a barra explica "Sem horários livres nos próximos 7 dias. Peça para ser avisado quando abrir um horário." e mostra "Me avise" e "Ver datas"

### Requirement: Brindes na carteira
A carteira MUST apresentar cada código como "Brinde", com a situação (Ativo, Usado em dd/mm, Expirado), a validade e a instrução de mostrar o código na biblioteca, sem textos de desconto.

#### Scenario: Brinde sem data de validade
- **WHEN** o brinde vem com `expiresAt` nulo
- **THEN** a carteira mostra "Válido até o fim da próxima temporada"

#### Scenario: Brinde já entregue
- **WHEN** o brinde vem com status usado e `usedAt`
- **THEN** a carteira mostra "Usado em dd/mm" e o código fica esmaecido

### Requirement: Aviso de jogo em atraso
A tela de aluguéis SHALL mostrar um aviso no topo quando o aluno tiver um aluguel retirado com o horário de devolução vencido.

#### Scenario: Aluno com jogo atrasado abre Meus aluguéis
- **WHEN** existe um aluguel `ACTIVE` com `endDate` no passado
- **THEN** o topo da tela mostra "Jogo em atraso — devolva na biblioteca" e que novas reservas ficam bloqueadas

### Requirement: Termo e guia com as regras da rodada 2
O Termo de Compromisso e o Guia MUST descrever aluguel grátis com retirada e devolução no mesmo dia (seg–sex, 8h às 19h), -10 pontos e bloqueio de reservas no atraso, -2 só ao cancelar com menos de 2h, -5 por não comparecimento após 30 minutos, promoção só por devolução no prazo e sem avaria e brindes válidos até o fim da temporada seguinte.

#### Scenario: Aluno lê o Termo
- **WHEN** o aluno abre Termos e Contrato
- **THEN** não há menção a "até 3 dias", tabela de preços ou pagamento
