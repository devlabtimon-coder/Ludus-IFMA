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
