# Tasks

## 1. Tela Sobre

- [x] 1.1 Tipos, conteúdo padrão e mapeamento de ícones/cores em `src/constants/about.ts`; verificar com `tsc --noEmit`
- [x] 1.2 Serviço `about.service.ts` com `fetchAbout` e cache no AsyncStorage; verificar com `tsc --noEmit` e `eslint`
- [x] 1.3 `AboutScreen` renderizando o conteúdo da API com versão do aparelho, histórico recolhível e integrações; verificar com `tsc --noEmit` e `eslint`

## 2. Verificação

- [x] 2.1 Testar na tela (build web com API demo): conteúdo padrão antes, conteúdo publicado pelo painel depois, histórico aberto
- [ ] 2.2 Conferir no celular (Expo Go ou build de desenvolvimento) a rolagem e o toque no histórico

## Workflow follow-up

- Arquivar a change (`openspec archive add-dynamic-about-screen`) depois do merge.
