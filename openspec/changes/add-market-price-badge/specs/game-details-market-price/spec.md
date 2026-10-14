## Purpose

Mostrar ao usuário, na tela de detalhe do jogo, o valor de mercado atual do jogo segundo a Ludopedia.

## ADDED Requirements

### Requirement: Selo de valor de mercado
A tela de detalhe do jogo SHALL exibir, abaixo do título e do tier, o valor de mercado em reais e a quantidade de anúncios usados no cálculo.

#### Scenario: Jogo com preço
- **WHEN** a API devolve mediana de R$ 316,49 calculada com 25 anúncios
- **THEN** a tela mostra "Valor de mercado: R$ 316,49" e "Mediana de 25 anúncios de venda na Ludopedia"

### Requirement: Link para a fonte
Tocar na linha da fonte SHALL abrir a página do jogo na Ludopedia quando a API informar o link.

#### Scenario: Abrir a Ludopedia
- **WHEN** o usuário toca em "Mediana de … na Ludopedia ›"
- **THEN** o app abre o link do jogo na Ludopedia

### Requirement: Sem preço, sem selo
O selo MUST ficar oculto quando não houver preço ou a consulta falhar, sem mostrar erro ao usuário.

#### Scenario: Jogo sem vínculo com a Ludopedia
- **WHEN** a API devolve `marketPrice` nulo
- **THEN** a tela não mostra o selo e nenhum alerta aparece
