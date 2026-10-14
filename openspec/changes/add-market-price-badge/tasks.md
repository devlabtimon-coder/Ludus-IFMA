# Tasks

## 1. Selo

- [x] 1.1 Componente `MarketPriceBadge` buscando `/games/:id/market-price`, formatando em reais e ocultando sem preço; verificar com `tsc --noEmit` e `eslint`
- [x] 1.2 Inserir o selo em `GameDetailsScreen` abaixo do título e do tier

## 2. Verificação

- [x] 2.1 Testar na tela (build web com API demo e Ludopedia real): Catan mostra R$ 316,49 com 25 anúncios; jogo sem vínculo não mostra selo
- [ ] 2.2 Conferir no celular (Expo Go ou build de desenvolvimento) o toque no link da Ludopedia

## Workflow follow-up

- Arquivar a change (`openspec archive add-market-price-badge`) depois do merge.
