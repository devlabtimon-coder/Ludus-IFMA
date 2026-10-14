## Purpose

Mostrar na tela "Sobre o Ludus" do aplicativo o conteúdo publicado pela gestão no painel, com reserva para quando a API não responde.

## ADDED Requirements

### Requirement: Conteúdo vindo do painel
A tela Sobre SHALL exibir o conteúdo de `GET /about`: identidade com chips, funcionalidades, propósito, projeto, versão com status e histórico, e integrações com status, omitindo seções vazias ou desligadas.

#### Scenario: Conteúdo publicado
- **WHEN** a gestão publica um texto novo, um chip e o status "Beta"
- **THEN** ao abrir a tela Sobre o app mostra o texto, o chip e o status novos

#### Scenario: Seção desligada
- **WHEN** a API devolve `mission` como `null`
- **THEN** a seção "Propósito" não aparece

### Requirement: Versão do aparelho
A tela MUST mostrar como número da versão o do aplicativo instalado, ao lado do status publicado no painel.

#### Scenario: Status Beta
- **WHEN** o status publicado é "Beta"
- **THEN** a tela mostra o número da versão instalada com o selo "Beta"

### Requirement: Histórico recolhível
O histórico de versões SHALL aparecer recolhido e abrir ao toque, listando versão, título e descrição de cada atualização.

#### Scenario: Abrir o histórico
- **WHEN** o usuário toca em "Histórico de versões"
- **THEN** a lista de atualizações aparece na ordem publicada

### Requirement: Funcionamento sem internet
A tela MUST abrir com a última versão recebida guardada no aparelho e, sem nenhuma guardada, com o conteúdo padrão, sem mostrar erro quando a API falhar.

#### Scenario: API fora do ar no primeiro acesso
- **WHEN** a API não responde e nada foi guardado antes
- **THEN** a tela mostra o conteúdo padrão sem alerta de erro
