# Tasks

- [x] 1.1 Google iOS client ID e URL scheme do mesmo projeto do `GoogleService-Info.plist`
- [x] 1.2 Plugins do Firebase, `remote-notification` e URL scheme do reCAPTCHA (conferidos com `expo config --type introspect`)
- [x] 1.3 Permissões em português, sem microfone e Face ID; privacy manifest; iPad desligado; tema claro
- [x] 1.4 Remover o termo de aluguel morto e a tela SUAP
- [x] 1.5 Login sem mensagens técnicas, com `textContentType`
- [x] 1.6 `useSafeTop` nos cabeçalhos, no BackButton e na busca
- [x] 1.7 Alertas e seletor de foto depois do fechamento do modal
- [x] 1.8 Excluir conta e Política de Privacidade
- [x] 1.9 Sair da conta limpa a pilha
- [x] 1.10 `tsc --noEmit` e eslint sem erros novos

## Pendente fora do código

- [ ] Chave APNs (.p8) no EAS (`eas credentials`) e no Firebase Console (Cloud Messaging)
- [ ] App no App Store Connect com o bundle `com.ludus.ios`, URL pública da Política de Privacidade e rótulo de privacidade
- [ ] Conta de demonstração aprovada para o revisor e Review Notes (login Google só institucional, retirada presencial)
- [ ] Build de preview no iPhone: login Google, SMS, Dynamic Island, avaliar, foto de perfil, excluir conta
