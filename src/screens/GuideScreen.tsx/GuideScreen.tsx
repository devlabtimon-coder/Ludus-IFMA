import { NavFooter } from "@/src/components/common/NavFooter";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GuideTab = "mechanics" | "users" | "games";

interface Mecanica {
  id: number;
  letter: string;
  namePt: string;
  nameEn: string;
  definition: string;
  games: string[];
  chip: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const BRAND_THEMES = [
  { main: "#31358B", contrast: "#FFFFFF", light: "#EEF0FF" },
  { main: "#E62325", contrast: "#FFFFFF", light: "#FFE9EA" },
  { main: "#FBBC04", contrast: "#31358B", light: "#FFF9E6" },
];

const LETTERS_WITH_TERMS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "V",
  "Z",
];

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CHIPS = [
  { label: "Todos", icon: "dice-outline" },
  { label: "Estratégia", icon: "extension-puzzle-outline" },
  { label: "Social", icon: "people-outline" },
  { label: "Cartas", icon: "albums-outline" },
  { label: "Dados", icon: "cube-outline" },
  { label: "Movimento", icon: "navigate-outline" },
  { label: "Habilidade", icon: "bulb-outline" },
  { label: "Cooperativo", icon: "shield-checkmark-outline" },
  { label: "Construção", icon: "build-outline" },
  { label: "Criativo", icon: "color-palette-outline" },
  { label: "Econômico", icon: "cash-outline" },
  { label: "Narrativo", icon: "book-outline" },
  { label: "Lógica", icon: "search-outline" },
] as const;

const MECANICAS: Mecanica[] = [
  {
    id: 1,
    letter: "A",
    namePt: "Acordos",
    nameEn: "[Agreements]",
    chip: "Social",
    icon: "hand-right-outline",
    definition:
      "Os jogadores podem estabelecer compromissos ou pactos durante a partida. Dependendo das regras, esses acordos podem ser obrigatórios, quebrados livremente ou possuir consequências caso não sejam cumpridos.",
    games: ["Catan: O Jogo", "Conselho", "Revolução dos Bichos"],
  },
  {
    id: 2,
    letter: "A",
    namePt: "Ação / Evento",
    nameEn: "[Action / Event]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "Cartas, fichas ou efeitos que representam ações realizadas pelos jogadores ou acontecimentos que alteram o estado do jogo. Um evento pode ser provocado por uma escolha, por uma carta ou automaticamente durante uma fase.",
    games: ["Bang! Dice Game", "Cartas a Vapor", "Conquest - Mystic Invasions"],
  },
  {
    id: 3,
    letter: "A",
    namePt: "Ação Cronometrada",
    nameEn: "[Timed Action]",
    chip: "Habilidade",
    icon: "time-outline",
    definition:
      "O jogador precisa realizar uma ação dentro de um limite de tempo. A pressão do relógio pode exigir rapidez, percepção ou tomada de decisão sob estresse.",
    games: ["Funocracy", "Cores com Dicas", "BrainBox Pocket: Espaço"],
  },
  {
    id: 4,
    letter: "A",
    namePt: "Acertos e Falhas Críticas",
    nameEn: "[Critical Hits and Misses]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "Resultados especialmente positivos ou negativos que acontecem quando o jogador obtém determinados valores, símbolos ou combinações em um teste. Um acerto crítico costuma gerar um efeito melhor que o normal, enquanto uma falha crítica provoca uma consequência mais severa.",
    games: ["Bang! Dice Game", "Conquest - Mystic Invasions"],
  },
  {
    id: 5,
    letter: "A",
    namePt: "Alianças",
    nameEn: "[Alliances]",
    chip: "Social",
    icon: "people-outline",
    definition:
      "Dois ou mais jogadores cooperam temporariamente para alcançar um objetivo comum. As alianças podem ser formais ou informais e nem sempre precisam durar até o final da partida.",
    games: ["Barony", "Conselho", "Revolução dos Bichos"],
  },
  {
    id: 6,
    letter: "A",
    namePt: "Alocação de Trabalhadores",
    nameEn: "[Worker Placement]",
    chip: "Estratégia",
    icon: "flag-outline",
    definition:
      "Cada jogador possui trabalhadores que são colocados em espaços de ação. Esses espaços permitem coletar recursos, construir, comprar, recrutar ou executar outras funções. Normalmente, um espaço ocupado fica bloqueado ou se torna mais caro para os demais jogadores.",
    games: ["Splendor: Marvel", "Odin"],
  },
  {
    id: 7,
    letter: "A",
    namePt: "Alocação de Diferentes Tipos de Trabalhadores",
    nameEn: "[Differentiated Worker Placement]",
    chip: "Estratégia",
    icon: "layers-outline",
    definition:
      "Variação da alocação de trabalhadores na qual os trabalhadores possuem características, habilidades ou custos diferentes. A escolha de onde colocar cada tipo é parte essencial da estratégia.",
    games: ["Odin", "Barony"],
  },
  {
    id: 8,
    letter: "A",
    namePt: "Alocação de Trabalhadores com Dados",
    nameEn: "[Dice Worker Placement]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "Os trabalhadores são representados por dados, e seus valores determinam sua força, custo, eficiência ou quais ações podem executar.",
    games: ["Bang! Dice Game", "Catan: O Jogo"],
  },
  {
    id: 9,
    letter: "A",
    namePt: "Apostas e Blefes",
    nameEn: "[Betting and Bluffing]",
    chip: "Social",
    icon: "eye-off-outline",
    definition:
      "Os jogadores apostam recursos ou dinheiro e podem tentar enganar os adversários sobre suas intenções, informações ou chances de sucesso. A avaliação do risco e a leitura dos oponentes são fundamentais.",
    games: ["Coup", "Bang! Dice Game", "Loira do Banheiro", "Duplo Risco"],
  },
  {
    id: 10,
    letter: "A",
    namePt: "Apostas em Metas",
    nameEn: "[Bidding on Goals]",
    chip: "Social",
    icon: "bar-chart-outline",
    definition:
      "Os jogadores fazem apostas sobre quem alcançará determinada condição, pontuação, posição ou objetivo. A aposta pode ser feita antes ou durante a partida e normalmente oferece uma recompensa caso a previsão esteja correta.",
    games: ["Arquimedes", "Conselho"],
  },
  {
    id: 11,
    letter: "A",
    namePt: "Árvores / Trilhas de Tecnologia",
    nameEn: "[Tech Trees / Tracks]",
    chip: "Estratégia",
    icon: "layers-outline",
    definition:
      "O jogador desbloqueia melhorias em uma sequência ou estrutura ramificada. Cada avanço pode abrir novas habilidades, ações, unidades, recursos ou caminhos estratégicos.",
    games: ["Splendor: Marvel", "Conquest - Mystic Invasions"],
  },
  {
    id: 12,
    letter: "A",
    namePt: "Atuação / Mímica",
    nameEn: "[Acting / Miming]",
    chip: "Habilidade",
    icon: "people-outline",
    definition:
      "O jogador representa uma pessoa, conceito, personagem ou situação por meio de interpretação corporal, fala, gestos ou atuação. Os demais jogadores precisam compreender ou avaliar a representação.",
    games: ["Funocracy", "Quem Disse Isso?", "Me Enganei"],
  },
  {
    id: 13,
    letter: "B",
    namePt: "Batata Quente",
    nameEn: "[Hot Potato]",
    chip: "Social",
    icon: "timer-outline",
    definition:
      "Um objeto, marcador, penalidade ou responsabilidade é passado entre os jogadores. Quem estiver com ele em determinado momento sofre uma consequência ou precisa cumprir uma condição.",
    games: ["Toca Raul", "Não Pode", "Bebê Diabo"],
  },
  {
    id: 14,
    letter: "B",
    namePt: "Bingo",
    nameEn: "[Bingo]",
    chip: "Habilidade",
    icon: "grid-outline",
    definition:
      "Os jogadores preenchem cartelas ou conjuntos de espaços conforme números, símbolos, palavras ou condições são revelados. Vence ou pontua quem completa primeiro determinados padrões.",
    games: ["BrainBox Pocket: Espaço", "Timeline: Twist"],
  },
  {
    id: 15,
    letter: "B",
    namePt: "Bônus de Fim de Jogo",
    nameEn: "[End Game Bonuses]",
    chip: "Estratégia",
    icon: "trophy-outline",
    definition:
      "Recompensas concedidas apenas na avaliação final da partida. Podem depender de objetivos secretos, conjuntos reunidos, recursos restantes, posições no tabuleiro ou outras condições.",
    games: [
      "7 Wonders: Segunda Edição",
      "Splendor: Marvel",
      "Ticket to Ride: Trem Fantasma",
    ],
  },
  {
    id: 16,
    letter: "C",
    namePt: "Cabo-de-Guerra",
    nameEn: "[Tug of War]",
    chip: "Estratégia",
    icon: "swap-horizontal-outline",
    definition:
      "Dois lados disputam uma trilha, marcador ou objetivo central. Cada ação desloca o marcador em direção a um dos lados, e a vitória ocorre quando alguém alcança determinada extremidade ou vantagem.",
    games: ["Cangaço", "Duplo Risco", "Barony"],
  },
  {
    id: 17,
    letter: "C",
    namePt: "Campanha / Batalhas Dirigidas por Cartas",
    nameEn: "[Campaign / Battle Card Driven]",
    chip: "Cartas",
    icon: "document-text-outline",
    definition:
      "As ações de uma batalha, cenário ou campanha são determinadas principalmente por cartas. Os jogadores escolhem, baixam ou revelam cartas que representam ordens, eventos, manobras ou capacidades.",
    games: ["Bang! Dice Game", "Cartas a Vapor", "Conquest - Mystic Invasions"],
  },
  {
    id: 18,
    letter: "C",
    namePt: "Cantar",
    nameEn: "[Singing]",
    chip: "Habilidade",
    icon: "musical-notes-outline",
    definition:
      "O jogador precisa cantar, reconhecer músicas, completar letras ou utilizar elementos musicais para cumprir uma tarefa.",
    games: ["Funocracy"],
  },
  {
    id: 19,
    letter: "C",
    namePt: "Captura de Peças",
    nameEn: "[Piece Capture]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "Uma peça captura outra ao ocupar seu espaço, removê-la, cercá-la ou cumprir uma condição específica. É comum em jogos abstratos, de guerra e de confronto direto.",
    games: ["Barony", "Conquest - Mystic Invasions", "Qwirkle"],
  },
  {
    id: 20,
    letter: "C",
    namePt: "Cartas Multiuso",
    nameEn: "[Multi-Use Cards]",
    chip: "Cartas",
    icon: "card-outline",
    definition:
      "Uma mesma carta pode ser utilizada de diferentes maneiras, como recurso, ação, unidade, dinheiro, tecnologia ou pagamento. O jogador precisa escolher qual uso é mais vantajoso.",
    games: ["Coup", "Uno", "Cartas a Vapor", "7 Wonders: Segunda Edição"],
  },
  {
    id: 21,
    letter: "C",
    namePt: "Colecionar Conjuntos",
    nameEn: "[Set Collection]",
    chip: "Cartas",
    icon: "albums-outline",
    definition:
      "O jogador reúne cartas, peças, símbolos ou recursos que formam conjuntos válidos. Os conjuntos podem conceder pontos, habilidades ou recompensas.",
    games: [
      "7 Wonders: Segunda Edição",
      "Splendor: Marvel",
      "Qwirkle",
      "Set",
      "Azul",
      "Timeline: Twist",
    ],
  },
  {
    id: 22,
    letter: "C",
    namePt: "Colocação de Peças",
    nameEn: "[Tile Placement]",
    chip: "Construção",
    icon: "grid-outline",
    definition:
      "Os jogadores acrescentam peças à área de jogo para construir, expandir ou modificar o tabuleiro. A posição escolhida normalmente afeta conexões, pontuação, recursos ou movimento.",
    games: [
      "Azul",
      "Qwirkle",
      "Ticket to Ride: Trem Fantasma",
      "Enquadrados",
      "Barony",
    ],
  },
  {
    id: 23,
    letter: "C",
    namePt: "Combinação",
    nameEn: "[Combination]",
    chip: "Construção",
    icon: "extension-puzzle-outline",
    definition:
      "Dois ou mais componentes são combinados para produzir um resultado diferente, como uma nova peça, recurso, carta, efeito ou unidade.",
    games: ["Azul", "Qwirkle", "Set", "Splendor: Marvel"],
  },
  {
    id: 24,
    letter: "C",
    namePt: "Comunicação Limitada",
    nameEn: "[Limited Communication]",
    chip: "Social",
    icon: "chatbubble-ellipses-outline",
    definition:
      "Os jogadores não podem conversar livremente ou compartilhar todas as informações que possuem. As regras restringem o tipo, a quantidade ou o momento da comunicação.",
    games: ["Cores com Dicas", "Duo Risco"],
  },
  {
    id: 25,
    letter: "C",
    namePt: "Compra Aberta",
    nameEn: "[Open Drafting]",
    chip: "Cartas",
    icon: "cart-outline",
    definition:
      "Os componentes disponíveis para compra ficam visíveis aos jogadores. Todos podem avaliar as opções e decidir qual carta, peça ou recurso adquirir.",
    games: ["Splendor: Marvel", "7 Wonders: Segunda Edição", "Cartas a Vapor"],
  },
  {
    id: 26,
    letter: "C",
    namePt: "Construção de Baralho, Bolsas e Peças",
    nameEn: "[Deck / Bag / Pool Building]",
    chip: "Construção",
    icon: "build-outline",
    definition:
      "Durante a partida, o jogador modifica um conjunto pessoal de cartas, fichas, dados ou peças, adicionando e removendo componentes para melhorar suas possibilidades.",
    games: ["Cartas a Vapor", "Splendor: Marvel"],
  },
  {
    id: 27,
    letter: "C",
    namePt: "Construção de Redes e Rotas",
    nameEn: "[Network and Route Building]",
    chip: "Construção",
    icon: "git-network-outline",
    definition:
      "Os jogadores conectam cidades, espaços ou pontos do tabuleiro por meio de estradas, ferrovias, rotas ou redes. A pontuação geralmente depende da extensão, eficiência ou conclusão das conexões.",
    games: ["Ticket to Ride: Trem Fantasma", "Catan: O Jogo"],
  },
  {
    id: 28,
    letter: "C",
    namePt: "Contratos",
    nameEn: "[Contracts]",
    chip: "Estratégia",
    icon: "document-text-outline",
    definition:
      "O jogador assume objetivos ou obrigações que devem ser cumpridos para receber uma recompensa. Um contrato pode exigir determinados recursos, entregas, construções ou condições.",
    games: ["Splendor: Marvel", "Cartas a Vapor", "Catan: O Jogo"],
  },
  {
    id: 29,
    letter: "C",
    namePt: "Cooperativo",
    nameEn: "[Cooperative Play]",
    chip: "Cooperativo",
    icon: "heart-outline",
    definition:
      "Todos os jogadores trabalham juntos contra um sistema controlado pelas regras do jogo. O grupo vence ou perde coletivamente, e o jogo possui procedimentos que simulam a oposição do tabuleiro.",
    games: ["Passaporte Mundo", "Cores com Dicas"],
  },
  {
    id: 30,
    letter: "C",
    namePt: "Correspondência Rápida",
    nameEn: "[Speed Matching]",
    chip: "Habilidade",
    icon: "flash-outline",
    definition:
      "Os jogadores precisam identificar rapidamente componentes correspondentes, como símbolos, imagens, palavras ou padrões. A velocidade de percepção e resposta é fundamental.",
    games: ["Set", "Cores com Dicas", "Trio", "Ímpar", "Jungo"],
  },
  {
    id: 31,
    letter: "C",
    namePt: "Corrida",
    nameEn: "[Racing]",
    chip: "Movimento",
    icon: "flag-outline",
    definition:
      "Os jogadores competem para alcançar primeiro uma posição, objetivo, pontuação, espaço ou condição de vitória.",
    games: ["Ticket to Ride: Trem Fantasma", "Superlemming", "Catan: O Jogo"],
  },
  {
    id: 32,
    letter: "D",
    namePt: "Dedução",
    nameEn: "[Deduction]",
    chip: "Habilidade",
    icon: "bulb-outline",
    definition:
      "O jogador elimina possibilidades por meio de pistas, informações conhecidas e raciocínio lógico até descobrir uma resposta, identidade, localização ou combinação.",
    games: [
      "Quem Foi?",
      "Loira do Banheiro",
      "BrainBox Pocket: Espaço",
      "Coup",
      "Cangaço",
    ],
  },
  {
    id: 33,
    letter: "D",
    namePt: "Desenhar",
    nameEn: "[Drawing]",
    chip: "Habilidade",
    icon: "pencil-outline",
    definition:
      "O jogador faz desenhos para representar palavras, conceitos, objetos ou situações que os outros precisam interpretar.",
    games: ["Me Enganei", "Funocracy"],
  },
  {
    id: 34,
    letter: "D",
    namePt: "Dilema do Prisioneiro",
    nameEn: "[Prisoner's Dilemma]",
    chip: "Social",
    icon: "bar-chart-outline",
    definition:
      "Os jogadores escolhem entre cooperar ou agir individualmente. A melhor decisão depende da escolha dos outros, criando tensão entre confiança, traição e benefício pessoal.",
    games: ["Conselho", "Revolução dos Bichos", "Coup"],
  },
  {
    id: 35,
    letter: "E",
    namePt: "Eliminação de Jogadores",
    nameEn: "[Player Elimination]",
    chip: "Estratégia",
    icon: "person-remove-outline",
    definition:
      "Um jogador deixa de participar da partida após perder todas as suas unidades, recursos, vidas ou cumprir uma condição de derrota.",
    games: ["Coup", "Bang! Dice Game", "Uno", "Bebê Diabo"],
  },
  {
    id: 36,
    letter: "E",
    namePt: "Encadeamento",
    nameEn: "[Chaining]",
    chip: "Estratégia",
    icon: "link-outline",
    definition:
      "Uma ação provoca outra ação, que pode provocar uma terceira, formando uma sequência de efeitos. O jogador busca combinar componentes para gerar cadeias mais eficientes.",
    games: [
      "Splendor: Marvel",
      "Cartas a Vapor",
      "7 Wonders: Segunda Edição",
      "Uno",
    ],
  },
  {
    id: 37,
    letter: "E",
    namePt: "Escalada",
    nameEn: "[Escalation]",
    chip: "Estratégia",
    icon: "trending-up-outline",
    definition:
      "Os valores, riscos, custos ou consequências aumentam progressivamente conforme os jogadores continuam participando de uma disputa ou tomando determinadas decisões.",
    games: ["Arquimedes", "Bang! Dice Game", "Duplo Risco"],
  },
  {
    id: 38,
    letter: "E",
    namePt: "Eu Corto, Você Escolhe",
    nameEn: "[I Cut, You Choose]",
    chip: "Social",
    icon: "cut-outline",
    definition:
      "Um jogador divide recursos, cartas ou componentes em grupos; outro jogador escolhe qual grupo receberá. O primeiro fica com o grupo restante, sendo incentivado a dividir de forma equilibrada.",
    games: ["Conselho"],
  },
  {
    id: 39,
    letter: "F",
    namePt: "Force sua Sorte",
    nameEn: "[Push Your Luck]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "O jogador pode continuar realizando ações para obter recompensas maiores, mas cada tentativa adicional aumenta o risco de perder o que já conquistou.",
    games: ["Bang! Dice Game", "Catan: O Jogo", "Bebê Diabo"],
  },
  {
    id: 40,
    letter: "I",
    namePt: "Impulso de Área",
    nameEn: "[Area Impulse]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "Um jogador ativa um grupo de unidades em uma determinada área. As unidades podem se mover ou agir em sequência, e os jogadores alternam impulsos até que todos passem.",
    games: ["Conquest - Mystic Invasions", "Barony"],
  },
  {
    id: 41,
    letter: "I",
    namePt: "Indução",
    nameEn: "[Induction]",
    chip: "Habilidade",
    icon: "bulb-outline",
    definition:
      "O jogador observa comportamentos, resultados ou padrões conhecidos para inferir uma regra, característica ou informação que não foi revelada diretamente.",
    games: ["Quem Foi?", "BrainBox Pocket: Espaço", "Loira do Banheiro"],
  },
  {
    id: 42,
    letter: "I",
    namePt: "Influência / Maioria na Área",
    nameEn: "[Area Influence / Majority]",
    chip: "Estratégia",
    icon: "bar-chart-outline",
    definition:
      "Vários jogadores podem ocupar uma mesma área. Ao final de uma fase ou rodada, quem tiver mais unidades, marcadores ou influência recebe a maior recompensa.",
    games: [
      "Barony",
      "Catan: O Jogo",
      "Conquest - Mystic Invasions",
      "7 Wonders: Segunda Edição",
    ],
  },
  {
    id: 43,
    letter: "J",
    namePt: "Jogador Juiz",
    nameEn: "[Player Judge]",
    chip: "Social",
    icon: "cash-outline",
    definition:
      "Um jogador atua como avaliador das respostas, desenhos, histórias ou propostas dos demais. Ele escolhe a melhor resposta de acordo com critérios definidos ou parcialmente subjetivos.",
    games: ["Dixit", "Quem Disse Isso?", "Me Enganei"],
  },
  {
    id: 44,
    letter: "J",
    namePt: "Jogadores com Diferentes Habilidades",
    nameEn: "[Variable Player Powers]",
    chip: "Estratégia",
    icon: "people-outline",
    definition:
      "Cada jogador possui poderes, personagens, facções ou capacidades distintas. O objetivo pode ser igual para todos, mas os caminhos estratégicos variam.",
    games: [
      "Bang! Dice Game",
      "Coup",
      "Conquest - Mystic Invasions",
      "Revolução dos Bichos",
      "Cangaço",
    ],
  },
  {
    id: 45,
    letter: "J",
    namePt: "Jogo em Equipe",
    nameEn: "[Team-Based Game]",
    chip: "Social",
    icon: "people-outline",
    definition:
      "Os jogadores são divididos em duas ou mais equipes que competem entre si. A vitória pertence à equipe, e os membros normalmente compartilham objetivos ou pontuação.",
    games: ["Funocracy", "Duplo Risco", "Cores com Dicas", "Quem Disse Isso?"],
  },
  {
    id: 46,
    letter: "L",
    namePt: "Leilão / Lances",
    nameEn: "[Auction / Bidding]",
    chip: "Social",
    icon: "cash-outline",
    definition:
      "Os jogadores competem oferecendo recursos, dinheiro ou outros valores para adquirir algo ou definir uma prioridade.",
    games: ["Arquimedes", "Conselho"],
  },
  {
    id: 47,
    letter: "L",
    namePt: "Leilão: Lance Selado",
    nameEn: "[Sealed Bid Auction]",
    chip: "Social",
    icon: "eye-off-outline",
    definition:
      "Cada jogador escolhe seu lance secretamente. Todos revelam simultaneamente, e o maior lance normalmente vence.",
    games: ["Arquimedes"],
  },
  {
    id: 48,
    letter: "M",
    namePt: "Memória",
    nameEn: "[Memory]",
    chip: "Habilidade",
    icon: "bulb-outline",
    definition:
      "O jogador precisa lembrar informações anteriormente reveladas, como posições, valores, identidades, símbolos ou cartas.",
    games: [
      "BrainBox Pocket: Espaço",
      "Quem Foi?",
      "Loira do Banheiro",
      "Timeline: Twist",
    ],
  },
  {
    id: 49,
    letter: "M",
    namePt: "Mercado",
    nameEn: "[Market]",
    chip: "Estratégia",
    icon: "cart-outline",
    definition:
      "Cartas, recursos ou produtos ficam disponíveis em uma área comum para compra, venda ou troca. O mercado pode ser renovado conforme os jogadores realizam ações.",
    games: ["Splendor: Marvel", "Catan: O Jogo", "Cartas a Vapor"],
  },
  {
    id: 50,
    letter: "M",
    namePt: "Movimento de Área",
    nameEn: "[Area Movement]",
    chip: "Movimento",
    icon: "navigate-outline",
    definition:
      "O tabuleiro é dividido em áreas conectadas. As peças podem se deslocar entre áreas adjacentes ou ligadas, sem precisar seguir uma grade precisa.",
    games: ["Barony", "Conquest - Mystic Invasions", "Catan: O Jogo"],
  },
  {
    id: 51,
    letter: "M",
    namePt: "Movimento em Trilha",
    nameEn: "[Track Movement]",
    chip: "Movimento",
    icon: "git-network-outline",
    definition:
      "As peças avançam por uma sequência linear de espaços. O movimento pode ser determinado por dados, cartas, ações ou pontos.",
    games: [
      "Ticket to Ride: Trem Fantasma",
      "Superlemming",
      "Passaporte Mundo",
    ],
  },
  {
    id: 52,
    letter: "M",
    namePt: "Movimento Programado",
    nameEn: "[Programmed Movement]",
    chip: "Movimento",
    icon: "swap-horizontal-outline",
    definition:
      "Os jogadores planejam seus movimentos antecipadamente e os executam depois. As ações podem sofrer interferência do que ocorrer antes da resolução.",
    games: ["Superlemming", "Conquest - Mystic Invasions"],
  },
  {
    id: 53,
    letter: "N",
    namePt: "Narração de Histórias",
    nameEn: "[Storytelling]",
    chip: "Social",
    icon: "book-outline",
    definition:
      "Os jogadores utilizam imagens, palavras, conceitos ou eventos para criar, continuar ou interpretar uma história.",
    games: ["Dixit", "Me Enganei", "Véio do Saco", "Loira do Banheiro"],
  },
  {
    id: 54,
    letter: "N",
    namePt: "Negociação",
    nameEn: "[Negotiation]",
    chip: "Social",
    icon: "hand-right-outline",
    definition:
      "Os jogadores discutem e trocam recursos, promessas, informações, favores ou compromissos. Dependendo das regras, as promessas podem ou não ser vinculativas.",
    games: ["Catan: O Jogo", "Conselho", "Revolução dos Bichos", "Arquimedes"],
  },
  {
    id: 55,
    letter: "O",
    namePt: "Ordem de Fases Variável",
    nameEn: "[Variable Phase Order]",
    chip: "Estratégia",
    icon: "swap-horizontal-outline",
    definition:
      "As fases do turno ou da rodada podem ocorrer em ordens diferentes. As escolhas dos jogadores, cartas ou papéis determinam quais ações estarão disponíveis e quando serão executadas.",
    games: ["7 Wonders: Segunda Edição", "Cartas a Vapor"],
  },
  {
    id: 56,
    letter: "O",
    namePt: "Ordenação",
    nameEn: "[Ordering]",
    chip: "Habilidade",
    icon: "arrow-up-outline",
    definition:
      "Os jogadores precisam organizar cartas, peças, valores ou elementos em uma ordem específica, como crescente, decrescente, cronológica ou hierárquica.",
    games: ["Timeline: Twist", "Pitágoras"],
  },
  {
    id: 57,
    letter: "P",
    namePt: "Papel e Caneta",
    nameEn: "[Paper and Pencil]",
    chip: "Habilidade",
    icon: "pencil-outline",
    definition:
      "Os jogadores utilizam papel e caneta para registrar informações, desenhar, marcar pontuações, escrever respostas ou criar combinações.",
    games: ["Pitágoras", "Enquadrados", "Passaporte Mundo"],
  },
  {
    id: 58,
    letter: "P",
    namePt: "Papéis com Informações Assimétricas",
    nameEn: "[Asymmetric Information Roles]",
    chip: "Social",
    icon: "eye-off-outline",
    definition:
      "Os jogadores possuem papéis com informações diferentes entre si. Cada participante sabe algo que os demais não sabem.",
    games: [
      "Coup",
      "Bang! Dice Game",
      "Loira do Banheiro",
      "Cangaço",
      "Cores com Dicas",
    ],
  },
  {
    id: 59,
    letter: "P",
    namePt: "Papéis Ocultos",
    nameEn: "[Hidden Roles]",
    chip: "Social",
    icon: "person-remove-outline",
    definition:
      "A identidade, função ou objetivo de cada jogador é mantido em segredo. A partida envolve dedução, blefe, suspeita ou manipulação.",
    games: [
      "Coup",
      "Loira do Banheiro",
      "Bang! Dice Game",
      "Revolução dos Bichos",
      "Cangaço",
    ],
  },
  {
    id: 60,
    letter: "P",
    namePt: "Pedra, Papel e Tesoura",
    nameEn: "[Rock-Paper-Scissors]",
    chip: "Estratégia",
    icon: "cut-outline",
    definition:
      "As opções possuem uma relação circular de vantagem: uma vence a segunda, a segunda vence a terceira e a terceira vence a primeira.",
    games: ["Duplo Risco", "Conquest - Mystic Invasions"],
  },
  {
    id: 61,
    letter: "P",
    namePt: "Pegar e Entregar",
    nameEn: "[Pick Up and Deliver]",
    chip: "Movimento",
    icon: "cube-outline",
    definition:
      "O jogador coleta uma mercadoria, passageiro, recurso ou objeto em um local e precisa transportá-lo até outro para receber uma recompensa.",
    games: ["Passaporte Mundo", "Catan: O Jogo"],
  },
  {
    id: 62,
    letter: "P",
    namePt: "Perguntas e Respostas",
    nameEn: "[Questions and Answers]",
    chip: "Habilidade",
    icon: "help-circle-outline",
    definition:
      "Os jogadores respondem perguntas ou formulam respostas para obter pontos, descobrir informações ou cumprir objetivos.",
    games: [
      "BrainBox Pocket: Espaço",
      "Timeline: Twist",
      "Quem Disse Isso?",
      "Quem Foi?",
      "Pool Party Stars",
    ],
  },
  {
    id: 63,
    letter: "P",
    namePt: "Pontos de Ação",
    nameEn: "[Action Points]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "Cada jogador recebe uma quantidade de pontos que pode gastar em ações. Mover, atacar, comprar, construir ou coletar podem ter custos diferentes.",
    games: [
      "Splendor: Marvel",
      "Barony",
      "Odin",
      "Conquest - Mystic Invasions",
    ],
  },
  {
    id: 64,
    letter: "P",
    namePt: "Preparação Variável",
    nameEn: "[Variable Setup]",
    chip: "Estratégia",
    icon: "settings-outline",
    definition:
      "A configuração inicial muda entre partidas. O mapa, os recursos, os objetivos, as posições ou as cartas iniciais podem ser sorteados ou escolhidos de maneiras diferentes.",
    games: [
      "Catan: O Jogo",
      "7 Wonders: Segunda Edição",
      "Barony",
      "Ticket to Ride: Trem Fantasma",
    ],
  },
  {
    id: 65,
    letter: "P",
    namePt: "Produção Aleatória",
    nameEn: "[Random Production]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "A geração de recursos, mercadorias ou resultados de produção depende de sorteio, dados, cartas ou outro procedimento aleatório.",
    games: ["Catan: O Jogo", "Bang! Dice Game", "Odin"],
  },
  {
    id: 66,
    letter: "R",
    namePt: "Reconhecimento de Padrões",
    nameEn: "[Pattern Recognition]",
    chip: "Habilidade",
    icon: "eye-outline",
    definition:
      "O jogador precisa identificar sequências, cores, formas, números, símbolos ou relações que atendam às regras do jogo.",
    games: ["Set", "Qwirkle", "Azul", "Trio", "Ímpar", "Jungo", "Enquadrados"],
  },
  {
    id: 67,
    letter: "R",
    namePt: "Rolagem de Dados",
    nameEn: "[Dice Rolling]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "Os dados são utilizados para gerar resultados aleatórios, determinar ações, resolver conflitos, produzir recursos ou verificar sucesso.",
    games: [
      "Bang! Dice Game",
      "Catan: O Jogo",
      "Conquest - Mystic Invasions",
      "Odin",
    ],
  },
  {
    id: 68,
    letter: "R",
    namePt: "Rolar / Girar e Mover",
    nameEn: "[Roll and Move]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "O jogador rola dados ou gira uma roleta e movimenta uma peça de acordo com o resultado.",
    games: ["Catan: O Jogo", "Superlemming"],
  },
  {
    id: 69,
    letter: "S",
    namePt: "Seleção de Ação",
    nameEn: "[Action Selection]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "O jogador escolhe quais ações realizará entre várias opções disponíveis. Em alguns jogos, a ação escolhida pode bloquear a escolha para os demais.",
    games: ["Splendor: Marvel", "7 Wonders: Segunda Edição", "Barony", "Odin"],
  },
  {
    id: 70,
    letter: "S",
    namePt: "Seleção de Ação Simultânea",
    nameEn: "[Simultaneous Action Selection]",
    chip: "Estratégia",
    icon: "people-outline",
    definition:
      "Todos escolhem ações em segredo e revelam ao mesmo tempo. As ações são resolvidas segundo uma ordem ou regra predefinida.",
    games: [
      "7 Wonders: Segunda Edição",
      "Revolução dos Bichos",
      "Cangaço",
      "Duplo Risco",
    ],
  },
  {
    id: 71,
    letter: "S",
    namePt: "Semi-Cooperativo",
    nameEn: "[Semi-Cooperative]",
    chip: "Cooperativo",
    icon: "shield-checkmark-outline",
    definition:
      "Os jogadores precisam cooperar parcialmente para evitar uma ameaça ou alcançar um objetivo comum, mas existem interesses individuais ou condições que permitem que apenas alguns vençam.",
    games: ["Barony", "Conselho", "Cangaço"],
  },
  {
    id: 72,
    letter: "S",
    namePt: "Solo / Solitário",
    nameEn: "[Solo / Solitaire]",
    chip: "Cooperativo",
    icon: "person-outline",
    definition:
      "O jogo pode ser jogado por uma única pessoa, normalmente contra um sistema automatizado, objetivos próprios, um cenário ou uma pontuação de referência.",
    games: ["Passaporte Mundo", "BrainBox Pocket: Espaço"],
  },
  {
    id: 73,
    letter: "T",
    namePt: "Tabuleiro Modular",
    nameEn: "[Modular Board]",
    chip: "Construção",
    icon: "grid-outline",
    definition:
      "O tabuleiro é formado por peças, cartas ou módulos que podem ser organizados de maneiras diferentes a cada partida.",
    games: ["Catan: O Jogo", "Conquest - Mystic Invasions"],
  },
  {
    id: 74,
    letter: "T",
    namePt: "Toma Essa",
    nameEn: "[Take That]",
    chip: "Cartas",
    icon: "flash-outline",
    definition:
      "O jogador utiliza cartas, efeitos ou ações para prejudicar diretamente outro participante, destruindo recursos, removendo cartas, aplicando penalidades ou interrompendo planos.",
    games: [
      "Uno",
      "Bang! Dice Game",
      "Bebê Diabo",
      "Não Pode",
      "Toca Raul",
      "Me Enganei",
    ],
  },
  {
    id: 75,
    letter: "T",
    namePt: "Traidor",
    nameEn: "[Traitor]",
    chip: "Social",
    icon: "person-remove-outline",
    definition:
      "Um ou mais jogadores possuem secretamente um objetivo contrário ao grupo. Eles podem fingir cooperar enquanto sabotam os demais.",
    games: ["Coup", "Loira do Banheiro", "Revolução dos Bichos", "Cangaço"],
  },
  {
    id: 76,
    letter: "V",
    namePt: "Vazas / Truques",
    nameEn: "[Trick Taking]",
    chip: "Cartas",
    icon: "card-outline",
    definition:
      "Cada jogador joga uma carta em uma rodada, formando uma vaza. Conforme as regras de valor, naipe e trunfo, um jogador vence a disputa e captura as cartas ou marca pontos.",
    games: ["Ímpar", "Trio"],
  },
  {
    id: 77,
    letter: "V",
    namePt: "Votação",
    nameEn: "[Voting]",
    chip: "Social",
    icon: "people-outline",
    definition:
      "Os jogadores discutem ou escolhem entre alternativas por meio de votos. A votação pode decidir expulsões, ações, leis, objetivos, mudanças de regra ou o jogador que receberá um benefício.",
    games: [
      "Conselho",
      "Revolução dos Bichos",
      "Loira do Banheiro",
      "Funocracy",
    ],
  },
  {
    id: 78,
    letter: "Z",
    namePt: "Zona de Controle",
    nameEn: "[Zone of Control]",
    chip: "Estratégia",
    icon: "shield-checkmark-outline",
    definition:
      "Uma unidade ou peça exerce influência sobre espaços próximos. Oponentes que entram, saem ou atravessam essa zona podem sofrer restrições, custos, ataques ou perda de movimento.",
    games: ["Barony", "Conquest - Mystic Invasions"],
  },
  {
    id: 79,
    letter: "A",
    namePt: "Acting",
    nameEn: "[Atuação Teatral]",
    chip: "Criativo",
    icon: "people-outline",
    definition:
      "Mecânica em que os jogadores precisam representar fisicamente palavras, frases, situações ou personagens sem falar, utilizando gestos, expressões e movimentos corporais para que os colegas de equipe adivinhem o que está sendo representado. É uma das mecânicas mais inclusivas e divertidas para grupos variados, pois não exige conhecimento prévio de regras complexas — apenas criatividade e disposição para se expressar.",
    games: ["Imagem e Ação", "Gesticulando", "Charada"],
  },
  {
    id: 80,
    letter: "A",
    namePt: "Advantage Token",
    nameEn: "[Ficha de Vantagem]",
    chip: "Estratégia",
    icon: "star-outline",
    definition:
      "O sistema de Ficha de Vantagem funciona como um marcador físico que confere ao jogador que o possui algum benefício especial durante a partida. Esse marcador pode ser transferido entre jogadores conforme certas condições são atendidas — geralmente pela realização de uma ação específica, vitória em um confronto ou escolha estratégica.",
    games: ["Coup", "Star Wars Rebellion", "Blood Rage"],
  },
  {
    id: 81,
    letter: "B",
    namePt: "Bag Building",
    nameEn: "[Construção de Sacola]",
    chip: "Estratégia",
    icon: "bag-outline",
    definition:
      "Variação da mecânica de Construção de Baralho na qual os componentes são peças físicas colocadas em uma sacola opaca. O jogador saca peças aleatoriamente da sacola no início de cada turno. A sacola garante aleatoriedade com controle — quanto mais peças poderosas você adiciona, maior a chance de sacá-las futuramente, mas a ordem nunca é garantida.",
    games: ["Orléans", "Quacks of Quedlinburg", "A Feast for Odin"],
  },
  {
    id: 82,
    letter: "B",
    namePt: "Bluffing",
    nameEn: "[Blefe]",
    chip: "Social",
    icon: "eye-off-outline",
    definition:
      "Uma das mecânicas mais antigas e psicológicas dos jogos. Blefar consiste em enganar os outros jogadores sobre o estado real do jogo — esconder cartas boas, fingir ter algo que não possui, agir com confiança quando está em desvantagem ou demonstrar fraqueza quando está vencendo. A mecânica exige leitura de comportamento humano e capacidade de manter uma expressão neutra.",
    games: [
      "Poker",
      "Coup",
      "The Resistance",
      "Bang!",
      "Sheriff of Nottingham",
      "Cockroach Poker",
    ],
  },
  {
    id: 83,
    letter: "C",
    namePt: "Communication Limits",
    nameEn: "[Limitação de Comunicação]",
    chip: "Cooperativo",
    icon: "chatbubble-ellipses-outline",
    definition:
      "Esta mecânica é um recurso muito usado em jogos cooperativos para aumentar o desafio. As regras impõem restrições explícitas sobre o que os jogadores podem ou não comunicar entre si. Essas restrições podem ser totais — proibindo qualquer comunicação verbal — ou parciais, limitando o tipo de informação compartilhável.",
    games: [
      "Hanabi",
      "The Mind",
      "Mysterium",
      "Forbidden Island",
      "Captain Sonar",
    ],
  },
  {
    id: 84,
    letter: "C",
    namePt: "Connections",
    nameEn: "[Conexões]",
    chip: "Estratégia",
    icon: "share-social-outline",
    definition:
      "Mecânica em que o objetivo principal envolve criar conexões entre dois ou mais pontos do tabuleiro. O jogador deve traçar caminhos contínuos ou garantir que determinados pontos estejam ligados por uma cadeia ininterrupta. Diferente de Rotas, nas Conexões o foco é a ligação entre extremidades específicas.",
    games: ["Hive", "Blokus", "Twixt", "GIPF"],
  },
  {
    id: 85,
    letter: "C",
    namePt: "Contracts",
    nameEn: "[Contratos por Objetivos]",
    chip: "Econômico",
    icon: "document-text-outline",
    definition:
      "Jogadores assumem compromissos voluntários ou obrigatórios que determinam quais objetivos devem ser cumpridos. O cumprimento traz recompensas significativas enquanto o descumprimento gera penalidades pesadas. Exige planejamento de longo prazo e adaptação às mudanças do jogo.",
    games: [
      "Lords of Waterdeep",
      "Viticulture",
      "Istanbul",
      "Century: Spice Road",
    ],
  },
  {
    id: 86,
    letter: "C",
    namePt: "Cube Tower",
    nameEn: "[Torre de Cubos]",
    chip: "Estratégia",
    icon: "cube-outline",
    definition:
      "Componente físico especial que funciona como resolução de combate. Os jogadores jogam cubos coloridos dentro de uma torre com obstáculos internos. Os cubos caem de forma imprevisível e os que saem pela base determinam o resultado. Cubos podem ficar presos dentro da torre e sair em momentos inesperados em rodadas futuras.",
    games: ["Wallenstein", "Shogun", "Amerigo"],
  },
  {
    id: 87,
    letter: "D",
    namePt: "Deduction",
    nameEn: "[Dedução por Pistas]",
    chip: "Lógica",
    icon: "search-outline",
    definition:
      "Mecânica em que os jogadores coletam informações parciais e devem usar raciocínio lógico para inferir informações ocultas — como a identidade de um suspeito, a localização de um objeto ou as intenções dos adversários. A dedução pode ser pura ou probabilística. É a mecânica central dos jogos de mistério e detetive.",
    games: [
      "Clue (Detetive)",
      "Codenames",
      "Sherlock Holmes Consulting Detective",
      "Mr. Jack",
      "Mastermind",
    ],
  },
  {
    id: 88,
    letter: "D",
    namePt: "Delayed Purchase",
    nameEn: "[Compra Atrasada]",
    chip: "Econômico",
    icon: "time-outline",
    definition:
      "O jogador reserva ou marca itens que deseja comprar mas não pode adquiri-los imediatamente. Deve cumprir condições adicionais — como acumular recursos por mais rodadas ou completar tarefas — antes de finalizar a aquisição. Cria tensão pelo risco de outro jogador comprar o item antes.",
    games: ["Century: Golem Edition", "Tokaido", "Azul"],
  },
  {
    id: 89,
    letter: "D",
    namePt: "Dice Selection",
    nameEn: "[Seleção de Dados]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "Diferente da simples rolagem, na Seleção de Dados os jogadores primeiro rolam um conjunto de dados e depois escolhem quais faces usar para executar ações. Cada dado pode representar um tipo diferente de ação, recurso ou habilidade. A escolha de qual dado usar é a decisão estratégica central da mecânica.",
    games: [
      "Stone Age",
      "Kingsburg",
      "Castles of Burgundy",
      "Alien Frontiers",
      "Quarriors!",
    ],
  },
  {
    id: 90,
    letter: "D",
    namePt: "Drafting",
    nameEn: "[Seleção / Draft]",
    chip: "Estratégia",
    icon: "layers-outline",
    definition:
      "Mecânica abrangente de seleção onde os jogadores escolhem entre um conjunto de opções. O Draft pode envolver cartas, dados, tiles ou personagens. Em jogos de cartas o draft clássico funciona passando o conjunto de cartas de mão em mão e cada jogador retira uma antes de passar adiante. A ordem de seleção é frequentemente alternada para garantir equilíbrio.",
    games: [
      "7 Wonders: Segunda Edição",
      "Sushi Go!",
      "Blood Rage",
      "Terraforming Mars",
      "Wingspan",
    ],
  },
  {
    id: 91,
    letter: "E",
    namePt: "Engine Building",
    nameEn: "[Construção de Motor]",
    chip: "Estratégia",
    icon: "settings-outline",
    definition:
      "Uma das mecânicas mais populares dos jogos modernos. O jogador constrói ao longo da partida um conjunto de cartas, peças ou habilidades que interagem entre si de forma sinérgica, criando um motor que gera benefícios crescentes a cada rodada. No início o motor é lento e ineficiente, mas com o tempo e as escolhas certas ele se torna poderoso e autossuficiente.",
    games: [
      "Wingspan",
      "Terraforming Mars",
      "Race for the Galaxy",
      "Splendor: Marvel",
      "Scythe",
    ],
  },
  {
    id: 92,
    letter: "E",
    namePt: "Events",
    nameEn: "[Eventos]",
    chip: "Estratégia",
    icon: "flash-outline",
    definition:
      "Mecânica na qual acontecimentos aleatórios ou programados afetam o estado do jogo durante a partida, modificando regras temporariamente, alterando o tabuleiro ou impondo condições especiais que atingem todos os jogadores. Os Eventos podem ser benéficos, prejudiciais ou ambíguos dependendo da situação de cada jogador.",
    games: [
      "Pandemic",
      "Spirit Island",
      "Arkham Horror",
      "Gloomhaven",
      "Viticulture",
    ],
  },
  {
    id: 93,
    letter: "F",
    namePt: "Finale Scoring",
    nameEn: "[Pontuação Final]",
    chip: "Estratégia",
    icon: "trophy-outline",
    definition:
      "Mecânica em que uma parte significativa da pontuação é calculada apenas ao final da partida, e não durante o jogo. Os jogadores constroem sua posição ao longo das rodadas sem saber exatamente o placar dos adversários. A pontuação final frequentemente envolve objetivos secretos ou combinações de elementos coletados.",
    games: [
      "Terraforming Mars",
      "7 Wonders: Segunda Edição",
      "Wingspan",
      "Viticulture",
      "Everdell",
    ],
  },
  {
    id: 94,
    letter: "F",
    namePt: "Follow",
    nameEn: "[Seguir / Copiar Ação]",
    chip: "Estratégia",
    icon: "arrow-up-outline",
    definition:
      "Quando um jogador executa uma ação em seu turno, os demais podem seguir essa ação — geralmente pagando um custo menor ou recebendo uma versão reduzida do benefício. Cria interação constante entre os turnos e encoraja observar as ações dos adversários. Quem escolhe a ação ganha a versão completa enquanto quem segue ganha uma versão parcial.",
    games: [
      "Puerto Rico",
      "Race for the Galaxy",
      "Concordia",
      "Sidereal Confluence",
    ],
  },
  {
    id: 95,
    letter: "H",
    namePt: "Hidden Movement",
    nameEn: "[Movimento Oculto]",
    chip: "Habilidade",
    icon: "navigate-outline",
    definition:
      "Um ou mais jogadores movem-se pelo tabuleiro de forma secreta, sem revelar sua posição aos demais. Os jogadores adversários devem deduzir, rastrear e interceptar o jogador oculto com base em pistas, rastros deixados e eliminação de possibilidades. Cria uma atmosfera de tensão e assimetria única.",
    games: [
      "Scotland Yard",
      "Fury of Dracula",
      "Letters from Whitechapel",
      "Ghost Stories",
      "Specter Ops",
    ],
  },
  {
    id: 96,
    letter: "H",
    namePt: "Hidden Roles",
    nameEn: "[Papéis Secretos]",
    chip: "Social",
    icon: "person-remove-outline",
    definition:
      "No início da partida cada jogador recebe secretamente um papel ou lealdade que define seus objetivos reais. Alguns jogadores cooperam para um objetivo comum enquanto outros — os traidores — sabotam sutilmente sem se revelar. A tensão vem de não saber quem é aliado e quem é inimigo, tornando cada decisão carregada de significado.",
    games: [
      "The Resistance",
      "Secret Hitler",
      "Battlestar Galactica",
      "Coup",
      "Bang!",
    ],
  },
  {
    id: 97,
    letter: "I",
    namePt: "Income",
    nameEn: "[Renda Periódica]",
    chip: "Econômico",
    icon: "trending-up-outline",
    definition:
      "Mecânica em que os jogadores recebem automaticamente recursos, dinheiro ou pontos em momentos fixos da partida — geralmente no início ou fim de cada rodada. O valor da renda geralmente varia conforme o desenvolvimento do jogador: construções realizadas, territórios controlados ou cartas jogadas aumentam ou diminuem a renda futura.",
    games: [
      "Brass: Birmingham",
      "Power Grid",
      "Ticket to Ride: Trem Fantasma",
      "Castles of Burgundy",
    ],
  },
  {
    id: 98,
    letter: "I",
    namePt: "Interrupts",
    nameEn: "[Interrupções]",
    chip: "Cartas",
    icon: "flash-outline",
    definition:
      "Cartas, habilidades ou ações que podem ser usadas fora do turno do jogador, em resposta a uma ação de um adversário. A interrupção pode cancelar, modificar ou criar uma reação à ação sendo executada. Cria uma camada adicional de estratégia: além de planejar o próprio turno, o jogador deve monitorar as actions dos outros.",
    games: [
      "Android Netrunner",
      "Magic: The Gathering",
      "Star Realms",
      "Dominion",
    ],
  },
  {
    id: 99,
    letter: "K",
    namePt: "Kingdom Building",
    nameEn: "[Construção de Reino]",
    chip: "Estratégia",
    icon: "flag-outline",
    definition:
      "Os jogadores expandem e desenvolvem seu próprio território ao longo da partida, construindo estruturas, recrutando unidades e desenvolvendo infraestrutura que gera poder crescente. Cada decisão de construção influencia as opções futuras, criando uma narrativa de crescimento e desenvolvimento. Frequentemente combinada com Controle de Área.",
    games: [
      "Dominion",
      "Suburbia",
      "Castles of Mad King Ludwig",
      "Among the Stars",
    ],
  },
  {
    id: 100,
    letter: "L",
    namePt: "Ladder Climbing",
    nameEn: "[Escalar Escada]",
    chip: "Cartas",
    icon: "arrow-up-outline",
    definition:
      "Mecânica de jogo de cartas em que os jogadores devem jogar cartas de valor igual ou superior à carta mais recentemente jogada na mesa, seguindo uma escada crescente. O jogador que não conseguir ou não quiser jogar passa a vez. Quem esvaziar a mão primeiro geralmente vence. A tensão vem de saber quando jogar cartas poderosas.",
    games: ["Tichu", "Big Two", "The Crew", "President"],
  },
  {
    id: 101,
    letter: "L",
    namePt: "Legacy",
    nameEn: "[Legado]",
    chip: "Narrativo",
    icon: "book-outline",
    definition:
      "As decisões tomadas em uma sessão de jogo afetam permanentemente as sessões futuras — componentes são destruídos, cartas rasgadas, adesivos colados no tabuleiro, regras riscadas do manual. O jogo lembra do passado e evolui ao longo de uma campanha de múltiplas sessões. Cada grupo terá uma experiência única e irrepetível.",
    games: [
      "Pandemic Legacy",
      "Risk Legacy",
      "Gloomhaven",
      "Charterstone",
      "Betrayal Legacy",
    ],
  },
  {
    id: 102,
    letter: "M",
    namePt: "Majority / Influence",
    nameEn: "[Maioria por Marcadores]",
    chip: "Estratégia",
    icon: "bar-chart-outline",
    definition:
      "Os jogadores colocam marcadores em diferentes regiões e a pontuação é proporcional à quantidade de marcadores de cada jogador em cada região. Ter a maioria absoluta não é obrigatório — ter mais que os adversários já é suficiente. Cria disputas acirradas e reversões de última hora.",
    games: [
      "El Grande",
      "Small World",
      "Ticket to Ride: Trem Fantasma",
      "Blood Rage",
      "Ethnos",
    ],
  },
  {
    id: 103,
    letter: "M",
    namePt: "Map Addition",
    nameEn: "[Adição de Mapa]",
    chip: "Construção",
    icon: "map-outline",
    definition:
      "O tabuleiro não está completo no início — novas regiões, áreas ou setores são adicionados ao mapa durante a partida conforme o jogo progride. A expansão do mapa pode ser controlada pelos jogadores, aleatória ou resultado de eventos. Cria uma sensação de exploração e descoberta, além de mudar dinamicamente as opções estratégicas.",
    games: [
      "Carcassonne",
      "Betrayal at House on the Hill",
      "Above and Below",
      "Near and Far",
    ],
  },
  {
    id: 104,
    letter: "M",
    namePt: "Map Deformation",
    nameEn: "[Deformação de Mapa]",
    chip: "Estratégia",
    icon: "map-outline",
    definition:
      "Ao contrário da Adição de Mapa, a Deformação permite que o tabuleiro seja modificado, reduzido ou transformado durante a partida. Regiões podem ser destruídas, inundadas, bloqueadas ou alteradas por ações dos jogadores ou eventos. Cria cenários dinâmicos onde o campo de batalha muda drasticamente.",
    games: ["Betrayal at House on the Hill", "Pandemic", "Forbidden Island"],
  },
  {
    id: 105,
    letter: "M",
    namePt: "Melding and Splaying",
    nameEn: "[Fundir e Espalhar]",
    chip: "Cartas",
    icon: "layers-outline",
    definition:
      "Mecânica onde os jogadores organizam cartas em pilhas (fundir) e depois podem espalhar essas pilhas em direções específicas para revelar partes de cartas cobertas. Cada símbolo revelado nas bordas das cartas conta como recurso ou bônus. A gestão de qual carta colocar em qual posição na pilha é o desafio central.",
    games: ["Innovation", "Mottainai", "Glory to Rome"],
  },
  {
    id: 106,
    letter: "M",
    namePt: "Movement Template",
    nameEn: "[Molde de Movimento]",
    chip: "Estratégia",
    icon: "options-outline",
    definition:
      "Mecânica usada em jogos de simulação onde o movimento de naves, veículos ou unidades é determinado por moldes físicos. O jogador posiciona o molde adjacente à peça e move-a para o outro extremo. Cria movimentos mais realistas e fluidos que grades quadradas, simulando inércia e manobras.",
    games: ["X-Wing Miniatures", "Wings of War", "Star Wars Armada"],
  },
  {
    id: 107,
    letter: "M",
    namePt: "Multi-Use Cards",
    nameEn: "[Cartas de Uso Múltiplo]",
    chip: "Cartas",
    icon: "card-outline",
    definition:
      "Cada carta na mão do jogador pode ser usada de múltiplas formas diferentes, geralmente mutuamente exclusivas. O jogador deve decidir qual uso dar a cada carta — por exemplo, usá-la como recurso, como ação, como ponto de vitória ou como defesa. A mesma carta que seria excelente de uma forma pode ser adequada de outra.",
    games: [
      "7 Wonders: Segunda Edição",
      "Hanabi",
      "San Juan",
      "Citadels",
      "Glass Road",
    ],
  },
  {
    id: 108,
    letter: "M",
    namePt: "Murder Mystery",
    nameEn: "[Mistério de Assassinato]",
    chip: "Lógica",
    icon: "search-outline",
    definition:
      "Mecânica narrativa e dedutiva em que um crime deve ser solucionado pelos jogadores. Cada jogador coleta pistas, interroga suspeitos, analisa evidências e tenta chegar à solução antes dos demais. O jogo termina quando um jogador acusa o culpado com evidências suficientes ou quando o crime permanece não resolvido.",
    games: [
      "Clue (Detetive)",
      "Sherlock Holmes Consulting Detective",
      "Mysterium",
      "Chronicles of Crime",
    ],
  },
  {
    id: 109,
    letter: "N",
    namePt: "Narrative Choice",
    nameEn: "[Escolha Narrativa]",
    chip: "Narrativo",
    icon: "book-outline",
    definition:
      "Os jogadores encontram momentos de decisão narrativa onde devem escolher entre diferentes opções que afetam a história do jogo. A mecânica traz elementos de livro-jogo e RPG para o tabuleiro, criando narrativas ramificadas e únicas a cada sessão. A recontagem da história do grupo ao final é parte do prazer.",
    games: [
      "Above and Below",
      "Near and Far",
      "Gloomhaven",
      "Tales of the Arabian Nights",
      "Sleeping Gods",
    ],
  },
  {
    id: 110,
    letter: "N",
    namePt: "Negotiation",
    nameEn: "[Negociação Aberta]",
    chip: "Social",
    icon: "hand-right-outline",
    definition:
      "Jogadores negociam abertamente entre si durante a partida, propondo e aceitando trocas de recursos, territórios, pontos, aliâncias ou favores futuros. A negociação pode ser vinculante ou não vinculante. Cria uma dinâmica social intensa onde habilidades de persuasão e diplomacia são tão importantes quanto a estratégia pura.",
    games: [
      "Catan: O Jogo",
      "Sidereal Confluence",
      "Chinatown",
      "Bohnanza",
      "Diplomacy",
      "Junta",
    ],
  },
  {
    id: 111,
    letter: "N",
    namePt: "Network and Route Building",
    nameEn: "[Rede e Conexões]",
    chip: "Construção",
    icon: "git-network-outline",
    definition:
      "Versão ampliada da Construção de Rotas, onde o objetivo vai além de conectar dois pontos — o jogador constrói uma rede inteira de conexões que maximiza eficiência, cobertura ou valor estratégico. A rede pode ser de ferrovias, estradas, rotas comerciais ou linhas de energia. Cada nova conexão aumenta o valor da rede.",
    games: [
      "Ticket to Ride: Trem Fantasma",
      "Power Grid",
      "Railways of the World",
      "Brass: Birmingham",
      "Concordia",
    ],
  },
  {
    id: 112,
    letter: "O",
    namePt: "Once-Per-Game Abilities",
    nameEn: "[Habilidades de Uso Único]",
    chip: "Estratégia",
    icon: "shield-checkmark-outline",
    definition:
      "Cada jogador ou personagem possui uma ou mais habilidades especiais que só podem ser usadas uma única vez durante toda a partida. A decisão de quando usar essa habilidade é frequentemente a mais importante da sessão — usar cedo para obter vantagem imediata ou guardar para um momento decisivo.",
    games: ["Scythe", "Blood Rage", "Cyclades", "Small World"],
  },
  {
    id: 113,
    letter: "O",
    namePt: "Ordering",
    nameEn: "[Ordenação por Sequência]",
    chip: "Lógica",
    icon: "arrow-up-outline",
    definition:
      "Mecânica em que a posição relativa de peças, cartas ou elements na sequência importa mais do que os elementos em si. O jogador deve organizar, reordenar ou prever a ordem em que os elementos serão ativados, revelados ou pontuados. A posição de um item na pilha pode transformar completamente seu valor estratégico.",
    games: ["Ticket to Ride: Trem Fantasma", "Sushi Go!", "The Crew"],
  },
  {
    id: 114,
    letter: "P",
    namePt: "Physical Dexterity",
    nameEn: "[Destreza Física]",
    chip: "Habilidade",
    icon: "pulse-outline",
    definition:
      "Mecânica onde a habilidade manual, reflexos, precisão ou equilíbrio físico do jogador determinam o resultado de uma ação. Não há elementos de sorte por dados — o resultado depende inteiramente da destreza real do jogador. Pode envolver empilhar peças, lançar discos em alvos, encaixar peças em posições precisas ou qualquer ação física cronometrada.",
    games: ["Jenga", "Rhino Hero", "Flick 'Em Up!", "Crokinole", "PitchCar"],
  },
  {
    id: 115,
    letter: "P",
    namePt: "Platform Building",
    nameEn: "[Construção de Plataforma]",
    chip: "Habilidade",
    icon: "layers-outline",
    definition:
      "Os jogadores constroem fisicamente estruturas tridimensionais durante a partida, adicionando peças umas sobre as outras. A colocação de peças deve respeitar regras de estabilidade, e a falha estrutural — quando a construção cai — tem consequências dentro do jogo. Combina Destreza Física com planejamento estrutural.",
    games: ["Rhino Hero", "Super Rhino", "Beasts of Balance", "Villa Paletti"],
  },
  {
    id: 116,
    letter: "P",
    namePt: "Political Maneuvering",
    nameEn: "[Manobra Política]",
    chip: "Social",
    icon: "people-outline",
    definition:
      "Mecânica em que os jogadores formam, desfazem e manipulam alianças políticas, votam em decisões coletivas e exercem influência de forma indireta. Um jogador pode dominar o jogo não pelo poder direto de suas peças, mas pela influência que exerce sobre os demais. Diferente da Negociação simples, envolve blocos de poder e coalizões.",
    games: [
      "Twilight Imperium",
      "Cosmic Encounter",
      "Republic of Rome",
      "Game of Thrones",
    ],
  },
  {
    id: 117,
    letter: "P",
    namePt: "Predictive Bid",
    nameEn: "[Lance Preditivo]",
    chip: "Econômico",
    icon: "cash-outline",
    definition:
      "Variação da mecânica de Leilão onde os jogadores fazem lances baseados em previsões sobre o resultado futuro do jogo ou sobre as ações dos adversários. O valor do lance não é sobre o que está sendo leiloado no presente, mas sobre o que o jogador acredita que acontecerá no futuro. Recompensa boa leitura do estado geral do jogo.",
    games: ["Power Grid", "Camel Up", "Hol's der Geier"],
  },
  {
    id: 118,
    letter: "R",
    namePt: "Race",
    nameEn: "[Corrida por Destino]",
    chip: "Movimento",
    icon: "flag-outline",
    definition:
      "O objetivo principal é ser o primeiro a chegar a um destino, completar uma série de tarefas ou acumular uma quantidade específica de algo. A mecânica de Corrida cria urgência e pressão constante, pois qualquer atraso pode significar derrota. Os jogadores devem equilibrar velocidade com eficiência e antecipar os movimentos dos adversários.",
    games: [
      "Elfenland",
      "Tokaido",
      "Flamme Rouge",
      "Camel Up",
      "The Quest for El Dorado",
    ],
  },
  {
    id: 119,
    letter: "R",
    namePt: "Random Production",
    nameEn: "[Produção por Sorteio]",
    chip: "Dados",
    icon: "cube-outline",
    definition:
      "Os recursos gerados a cada rodada são determinados por um elemento aleatório — geralmente dados, cartas ou um mecanismo giratório. Cada jogador recebe recursos diferentes dependendo do resultado aleatório. A habilidade está em adaptar a estratégia aos recursos disponíveis em vez de apenas otimizar um plano fixo.",
    games: ["Catan: O Jogo", "Kingsburg", "Agricola", "Lords of Waterdeep"],
  },
  {
    id: 120,
    letter: "R",
    namePt: "Real-Time",
    nameEn: "[Tempo Real]",
    chip: "Habilidade",
    icon: "time-outline",
    definition:
      "Todos os jogadores agem simultaneamente sem esperar turnos, geralmente dentro de um limite de tempo físico. O jogo ocorre em tempo real com todos jogando ao mesmo tempo, criando caos controlado, pressão de relógio e reações rápidas. A habilidade de processar informações e agir rapidamente é tão importante quanto a estratégia.",
    games: [
      "Escape: The Curse of the Temple",
      "Space Alert",
      "Galaxy Trucker",
      "Fuse",
      "Kitchen Rush",
    ],
  },
  {
    id: 121,
    letter: "R",
    namePt: "Resource Management",
    nameEn: "[Gestão de Recursos]",
    chip: "Estratégia",
    icon: "cube-outline",
    definition:
      "Mecânica central em muitos jogos modernos. Os jogadores coletam, armazenam, transformam e gastam diferentes tipos de recursos para realizar ações, construir estruturas ou avançar objetivos. O desafio está em equilibrar a coleta com o gasto, nunca ficando sem recursos essenciais enquanto busca os mais raros.",
    games: [
      "Agricola",
      "Catan: O Jogo",
      "Viticulture",
      "Terraforming Mars",
      "Stone Age",
      "Everdell",
      "Wingspan",
    ],
  },
  {
    id: 122,
    letter: "R",
    namePt: "Roles",
    nameEn: "[Funções Especializadas]",
    chip: "Cooperativo",
    icon: "shield-checkmark-outline",
    definition:
      "Cada jogador assume uma função específica com habilidades únicas que complementam as dos demais. As funções criam especialização natural — cada jogador é o melhor em algo diferente — e exigem coordenação para que o grupo aproveite ao máximo as habilidades coletivas. Diferente dos Papéis Ocultos, aqui as funções são conhecidas de todos.",
    games: [
      "Pandemic",
      "Forbidden Island",
      "Spirit Island",
      "Flash Point: Fire Rescue",
      "Gloomhaven",
    ],
  },
  {
    id: 123,
    letter: "R",
    namePt: "Rondel",
    nameEn: "[Rondel]",
    chip: "Estratégia",
    icon: "refresh-outline",
    definition:
      "Mecanismo de seleção de ações representado por um círculo dividido em setores. O marcador de cada jogador se move ao redor deste círculo e o custo ou benefício de uma ação depende de quantas casas o marcador avança. Mover-se pouco é barato mas limita as opções; avançar muito permite escolher qualquer ação mas tem custo alto.",
    games: ["Navegador", "Imperial", "Antike", "Hamburg"],
  },
  {
    id: 124,
    letter: "S",
    namePt: "Scenario / Mission",
    nameEn: "[Cenário / Missão]",
    chip: "Narrativo",
    icon: "map-outline",
    definition:
      "O jogo é composto por múltiplos cenários ou missões distintos, cada um com condições especiais, objetivos únicos e configurações de tabuleiro diferentes. Os jogadores escolhem ou seguem uma sequência de cenários, criando grande variedade de experiências com os mesmos componentes.",
    games: [
      "Gloomhaven",
      "Descent: Journeys in the Dark",
      "Pandemic Legacy",
      "Imperial Assault",
    ],
  },
  {
    id: 125,
    letter: "S",
    namePt: "Semi-Cooperative",
    nameEn: "[Semi-Cooperativo]",
    chip: "Cooperativo",
    icon: "shield-checkmark-outline",
    definition:
      "Variação do Cooperativo onde os jogadores trabalham juntos para um objetivo comum mas existe a possibilidade de vitória individual dentro da vitória coletiva. Todos podem perder juntos se o desafio coletivo não for superado, mas caso sejam bem-sucedidos, um único jogador é declarado o grande vencedor.",
    games: [
      "Dead of Winter",
      "Archipelago",
      "Battlestar Galactica",
      "Merchants and Marauders",
    ],
  },
  {
    id: 126,
    letter: "S",
    namePt: "Solo / Solitaire",
    nameEn: "[Modo Solitário]",
    chip: "Cooperativo",
    icon: "person-outline",
    definition:
      "Modo de jogo — ou jogos projetados exclusivamente — para um único jogador. O jogador enfrenta um sistema autônomo controlado pelas regras do próprio jogo, objetivos de pontuação, crises programadas ou narrativas ramificadas. A popularidade dos jogos solo cresceu enormemente nos últimos anos.",
    games: [
      "Friday",
      "Mage Knight",
      "Arkham Horror",
      "Wingspan",
      "Spirit Island",
      "Pandemic",
    ],
  },
  {
    id: 127,
    letter: "S",
    namePt: "Stacking and Balancing",
    nameEn: "[Empilhar e Equilibrar]",
    chip: "Habilidade",
    icon: "layers-outline",
    definition:
      "Os jogadores devem empilhar fisicamente peças uns sobre os outros mantendo a estrutura equilibrada. A falha — quando a torre cai — tem consequências dentro do jogo. A precisão dos movimentos é fundamental e o tremor das mãos, a respiração e até a posição do corpo influenciam o resultado.",
    games: [
      "Jenga",
      "Rhino Hero Super Battle",
      "Beasts of Balance",
      "Bausack",
      "Suspend",
    ],
  },
  {
    id: 128,
    letter: "T",
    namePt: "Tableau Building",
    nameEn: "[Construção de Tableau]",
    chip: "Estratégia",
    icon: "grid-outline",
    definition:
      "Os jogadores constroem uma área de jogo pessoal (tableau) adicionando cartas, tiles ou peças que interagem entre si e geram habilidades, recursos ou pontuações crescentes. Diferente do Deck Building, o tableau é permanente e visível. A sinergia entre os elementos do tableau é o coração da mecânica.",
    games: [
      "Race for the Galaxy",
      "Wingspan",
      "Everdell",
      "Agricola",
      "Through the Ages",
    ],
  },
  {
    id: 129,
    letter: "T",
    namePt: "Technology Tree",
    nameEn: "[Árvore de Tecnologia]",
    chip: "Estratégia",
    icon: "layers-outline",
    definition:
      "Os jogadores desbloqueiam melhorias, habilidades ou edificações seguindo uma estrutura hierárquica de pré-requisitos. Para desbloquear uma tecnologia avançada é necessário ter desbloqueado primeiro as tecnologias básicas. Diferentes ramos da árvore representam especializações e determinam o estilo de jogo.",
    games: [
      "Terraforming Mars",
      "Through the Ages",
      "Sid Meier's Civilization",
      "Clash of Cultures",
      "Eclipse",
    ],
  },
  {
    id: 130,
    letter: "T",
    namePt: "Turn Order Selection",
    nameEn: "[Seleção de Ordem de Turno]",
    chip: "Estratégia",
    icon: "swap-horizontal-outline",
    definition:
      "A ordem em que os jogadores agem em cada rodada não é fixa — ela pode ser comprada, leiloada, negociada ou determinada por ações realizadas na rodada anterior. Jogar primeiro pode dar vantagem de acesso a ações e recursos. A gestão estratégica de quando priorizar ir primeiro versus aceitar ir depois é frequentemente a decisão mais sutil do jogo.",
    games: [
      "Viticulture",
      "Agricola",
      "Terra Mystica",
      "Puerto Rico",
      "Gaia Project",
      "Lords of Waterdeep",
    ],
  },
];

export default function GuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<GuideTab>("mechanics");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedChip, setSelectedChip] = useState<string>("Todos");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredMechanics = useMemo(() => {
    return MECANICAS.filter((m) => {
      const matchChip = selectedChip === "Todos" || m.chip === selectedChip;
      const matchLetter = !selectedLetter || m.letter === selectedLetter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.namePt.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.definition.toLowerCase().includes(q);
      return matchChip && matchLetter && matchQuery;
    });
  }, [selectedChip, selectedLetter, searchQuery]);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedLetter(null);
    setSelectedChip("Todos");
  };

  const hasActiveFilters =
    searchQuery || selectedLetter || selectedChip !== "Todos";

  const TAB_ITEMS = [
    {
      key: "mechanics" as const,
      label: "Mecânicas",
      icon: "settings" as const,
      theme: BRAND_THEMES[0],
    },
    {
      key: "users" as const,
      label: "Usuários",
      icon: "people" as const,
      theme: BRAND_THEMES[2],
    },
    {
      key: "games" as const,
      label: "Acervo",
      icon: "diamond" as const,
      theme: BRAND_THEMES[1],
    },
  ];

  return (
    <View style={styles.root}>
      <HomeBackground />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Guia Ludus</Text>
        <Text style={styles.headerSubtitle}>
          Descubra os segredos do acervo
        </Text>
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabsContainer}>
          {TAB_ITEMS.map((t) => (
            <Pressable
              key={t.key}
              style={[
                styles.tab,
                tab === t.key && { backgroundColor: t.theme.main },
              ]}
              onPress={() => setTab(t.key)}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={tab === t.key ? t.theme.contrast : "#7A8194"}
              />
              <Text
                style={[
                  styles.tabText,
                  tab === t.key && { color: t.theme.contrast },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {tab === "mechanics" && (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.letterScroll}
              >
                {ALL_LETTERS.map((letter, index) => {
                  const hasTerms = LETTERS_WITH_TERMS.includes(letter);
                  const isActive = selectedLetter === letter;
                  const theme = BRAND_THEMES[index % 3];

                  return (
                    <Pressable
                      key={letter}
                      onPress={() =>
                        hasTerms && setSelectedLetter(isActive ? null : letter)
                      }
                      style={[
                        styles.letterBtn,
                        isActive && { backgroundColor: theme.main },
                        hasTerms &&
                          !isActive && { backgroundColor: theme.light },
                      ]}
                    >
                      <Text
                        style={[
                          styles.letterText,
                          isActive && { color: theme.contrast },
                          hasTerms && !isActive && { color: theme.main },
                        ]}
                      >
                        {letter}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {CHIPS.map((chip, index) => {
                  const isActive = selectedChip === chip.label;
                  const theme = BRAND_THEMES[index % 3];

                  return (
                    <Pressable
                      key={chip.label}
                      onPress={() => setSelectedChip(chip.label)}
                      style={[
                        styles.chipBtn,
                        isActive && {
                          backgroundColor: theme.main,
                          borderColor: theme.main,
                        },
                      ]}
                    >
                      <Ionicons
                        name={chip.icon as any}
                        size={14}
                        color={isActive ? theme.contrast : "#31358B"}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isActive && { color: theme.contrast },
                        ]}
                      >
                        {chip.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.searchWrap}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#535353" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar mecânica..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {hasActiveFilters && (
                    <Pressable
                      onPress={clearAll}
                      style={styles.clearFiltersBtn}
                    >
                      <Ionicons name="close" size={14} color="#666" />
                    </Pressable>
                  )}
                </View>
                {hasActiveFilters && (
                  <Text style={styles.resultsCount}>
                    {filteredMechanics.length} resultado(s)
                  </Text>
                )}
              </View>

              <View style={styles.mechanicsList}>
                {filteredMechanics.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>
                      Nenhuma mecânica encontrada
                    </Text>
                    <Text style={styles.emptySub}>
                      Ajuste os filtros ou o termo de busca.
                    </Text>
                  </View>
                ) : (
                  filteredMechanics.map((m, index) => {
                    const isExpanded = expandedId === m.id;
                    const theme = BRAND_THEMES[index % 3];

                    return (
                      <View key={m.id} style={styles.accordionCard}>
                        <Pressable
                          style={styles.accordionHeader}
                          onPress={() =>
                            setExpandedId(isExpanded ? null : m.id)
                          }
                        >
                          <View
                            style={[
                              styles.accordionIconWrap,
                              { backgroundColor: theme.light },
                            ]}
                          >
                            <Ionicons
                              name={m.icon}
                              size={20}
                              color={theme.main}
                            />
                          </View>
                          <View style={styles.accordionTitleWrap}>
                            <Text style={styles.accordionTitle}>
                              {m.namePt}
                            </Text>
                            <Text style={styles.accordionSubTitle}>
                              {m.nameEn}
                            </Text>
                          </View>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#9CA3AF"
                          />
                        </Pressable>
                        {isExpanded && (
                          <View style={styles.accordionBody}>
                            <Text style={styles.accordionDesc}>
                              {m.definition}
                            </Text>
                            <Text style={styles.gamesLabel}>No acervo:</Text>
                            <View style={styles.gamesList}>
                              {m.games.map((g, gIndex) => {
                                const tagTheme = BRAND_THEMES[(gIndex + 1) % 3];
                                return (
                                  <Pressable
                                    key={g}
                                    style={[
                                      styles.gameTag,
                                      { backgroundColor: tagTheme.main },
                                    ]}
                                    onPress={() => {}}
                                  >
                                    <Ionicons
                                      name="game-controller"
                                      size={12}
                                      color={tagTheme.contrast}
                                    />
                                    <Text
                                      style={[
                                        styles.gameTagText,
                                        { color: tagTheme.contrast },
                                      ]}
                                    >
                                      {g}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}

          {tab === "users" && (
            <View style={styles.staticContainer}>
              <View style={styles.staticHero}>
                <Text style={styles.staticHeroIcon}>🏆</Text>
                <Text style={styles.staticMainTitle}>Progressão de Nível</Text>
                <Text style={styles.staticDesc}>
                  Entenda como evoluir sua categoria e desbloquear acesso a
                  jogos exclusivos do Ludus.
                </Text>
              </View>
              {[
                {
                  name: "Starter",
                  color: "#22C55E",
                  icon: "leaf",
                  desc: "Nível inicial após cadastro. Acesso: Latão e Bronze.",
                },
                {
                  name: "Family",
                  color: "#F59E0B",
                  icon: "home",
                  desc: "Conclua 5 aluguéis sem atraso. Acesso estendido ao Prata.",
                },
                {
                  name: "Expert",
                  color: "#7C3AED",
                  icon: "medal",
                  desc: "15+ aluguéis e avaliações. Acesso a Ouro liberado.",
                },
                {
                  name: "Ultragamer",
                  color: "#31358B",
                  icon: "trophy",
                  desc: "O auge do engajamento. Acesso VIP aos jogos Diamante.",
                },
              ].map((lvl) => (
                <View key={lvl.name} style={styles.levelCard}>
                  <View
                    style={[
                      styles.levelIconWrap,
                      { backgroundColor: lvl.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={lvl.icon as any}
                      size={26}
                      color={lvl.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.levelName}>{lvl.name}</Text>
                    <Text style={styles.levelDesc}>{lvl.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tab === "games" && (
            <View style={styles.staticContainer}>
              <View style={styles.staticHero}>
                <Text style={styles.staticHeroIcon}>🎲</Text>
                <Text style={styles.staticMainTitle}>
                  Classificação do Acervo
                </Text>
                <Text style={styles.staticDesc}>
                  Nossos jogos são divididos por Tiers que representam a
                  complexidade, tempo de jogo e exclusividade de acesso.
                </Text>
              </View>
              {[
                {
                  name: "Latão",
                  color: "#8B7355",
                  icon: "shield-outline",
                  desc: "Regras simples, rápidos. Ideais para iniciar. Acesso Livre.",
                },
                {
                  name: "Bronze",
                  color: "#CD7F32",
                  icon: "shield-half-outline",
                  desc: "Profundidade moderada, partidas até 60 min. Acesso Livre.",
                },
                {
                  name: "Prata",
                  color: "#7A7A7A",
                  icon: "shield",
                  desc: "Mecânicas complexas, múltiplas fases. Requer Family+.",
                },
                {
                  name: "Ouro",
                  color: "#B8860B",
                  icon: "star-outline",
                  desc: "Estratégia pesada, longa duração. Requer Expert+.",
                },
                {
                  name: "Diamante",
                  color: "#0277BD",
                  icon: "diamond-outline",
                  desc: "Raros e épicos. Acesso exclusivo para Ultragamer.",
                },
              ].map((tier) => (
                <View
                  key={tier.name}
                  style={[styles.tierCard, { borderLeftColor: tier.color }]}
                >
                  <View style={styles.tierHeader}>
                    <Ionicons
                      name={tier.icon as any}
                      size={20}
                      color={tier.color}
                    />
                    <Text style={[styles.tierName, { color: tier.color }]}>
                      {tier.name}
                    </Text>
                  </View>
                  <Text style={styles.tierDesc}>{tier.desc}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#31358B",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  letterScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  letterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D1D5DB",
  },
  chipsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  chipBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  clearFiltersBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  mechanicsList: {
    paddingHorizontal: 20,
  },
  accordionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  accordionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  accordionTitleWrap: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  accordionSubTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  accordionDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    fontWeight: "500",
  },
  gamesLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#31358B",
    marginTop: 18,
    marginBottom: 10,
  },
  gamesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gameTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  gameTagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  staticContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  staticHero: {
    alignItems: "center",
    marginBottom: 24,
  },
  staticHeroIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  staticMainTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#31358B",
    marginBottom: 8,
    textAlign: "center",
  },
  staticDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    textAlign: "center",
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  levelIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  levelName: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  levelDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
    lineHeight: 18,
  },
  tierCard: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 5,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tierName: {
    fontSize: 17,
    fontWeight: "900",
  },
  tierDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    fontWeight: "500",
  },
});
