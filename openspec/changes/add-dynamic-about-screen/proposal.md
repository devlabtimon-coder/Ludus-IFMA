# Proposal

## Why

O conteúdo da tela "Sobre o Ludus" está escrito no código do app; qualquer ajuste (equipe, propósito, histórico de versões) exige publicar uma versão nova nas lojas. O painel passa a editar esse conteúdo.

## What Changes

- A tela Sobre busca o conteúdo em `GET /about` e mostra identidade, funcionalidades, propósito (missão e visão), projeto (instituição, equipe e orientação), versão com status e histórico recolhível, e APIs e integrações.
- O número da versão continua vindo do app instalado; do painel vem só o status e o histórico.
- A última versão recebida fica guardada no aparelho, para abrir com conteúdo atualizado mesmo sem internet; sem nada guardado, usa o texto padrão.

## Capabilities

### New Capabilities
- `about-screen`: tela Sobre do app alimentada pelo conteúdo publicado no painel.

### Modified Capabilities

## Impact

- Código: `src/screens/Profile/AboutScreen.tsx`, `src/constants/about.ts`, `src/services/about.service.ts`.
- API: depende de `GET /about` (Ludus-Backend-IFMA, change `add-editable-about-page`).
