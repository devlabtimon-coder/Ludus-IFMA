## MODIFIED Requirements

### Requirement: Selo de valor de mercado
A tela de detalhe do jogo SHALL exibir, abaixo do título e do tier, o menor preço de novo do jogo em reais e a quantidade de lojas com o jogo novo, segundo o ComparaJogos.

#### Scenario: Jogo com preço
- **WHEN** a API devolve `price` 278,07 e `storesCount` 30
- **THEN** a tela mostra "Valor de mercado: a partir de R$ 278,07" e "Menor preço novo em 30 lojas no ComparaJogos"

#### Scenario: Uma loja
- **WHEN** a API devolve `storesCount` 1
- **THEN** a linha da fonte diz "1 loja"

### Requirement: Link para a fonte
Tocar na linha da fonte SHALL abrir a página do produto no ComparaJogos quando a API informar o link.

#### Scenario: Abrir o ComparaJogos
- **WHEN** o usuário toca em "Menor preço novo em … no ComparaJogos ›"
- **THEN** o app abre o link do produto no ComparaJogos
