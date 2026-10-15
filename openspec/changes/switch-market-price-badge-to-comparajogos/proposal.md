# Proposal

## Why

O backend trocou a fonte do preço de mercado da Ludopedia para o ComparaJogos (menor preço de novo entre as lojas). A resposta de `GET /games/:id/market-price` mudou de formato, então o selo precisa acompanhar.

## What Changes

- O selo lê `price` e `storesCount` em vez de `median` e `listingsCount`.
- Texto passa a "Valor de mercado: a partir de R$ X" e "Menor preço novo em N lojas no ComparaJogos ›".
- O link da fonte abre a página do produto no ComparaJogos.

## Capabilities

### New Capabilities

### Modified Capabilities
- `game-details-market-price`: fonte e textos do selo.

## Impact

- Código: `src/components/GameDetails/MarketPriceBadge.tsx`.
- API: depende do backend com a change `switch-market-price-to-comparajogos`. Com o backend antigo, o selo não quebra a tela, mas mostraria valor vazio; subir os dois juntos.
