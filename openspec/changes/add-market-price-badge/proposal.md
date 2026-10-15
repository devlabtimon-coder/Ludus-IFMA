# Proposal

## Why

O protótipo da tela de detalhe do jogo mostra o valor de mercado, para o usuário enxergar quanto vale o jogo que pega emprestado. O backend passa a calcular esse valor na hora a partir da Ludopedia.

## What Changes

- Selo "Valor de mercado: R$ …" abaixo do título e do tier, na tela de detalhe do jogo.
- Linha "Mediana de N anúncios de venda na Ludopedia ›" que abre a página do jogo na Ludopedia.
- Sem preço disponível (jogo sem vínculo, sem anúncios ou Ludopedia fora do ar), o selo não aparece.

## Capabilities

### New Capabilities
- `game-details-market-price`: exibição do valor de mercado na tela de detalhe do jogo.

### Modified Capabilities

## Impact

- Código: `src/components/GameDetails/MarketPriceBadge.tsx`, `src/screens/GameDetails/GameDetailsScreen.tsx`.
- API: depende de `GET /games/:id/market-price` (Ludus-Backend-IFMA, change `add-game-market-price`).
