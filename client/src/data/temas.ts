export type GameKind = "imagem" | "inverso" | "cartas";

export interface Item {
  id: string;
  termo: string;
  def: string; // significado curto (cartas)
  explica: string; // explicação ampliada (professor)
  img?: string;
}

export interface Tema {
  id: string;
  titulo: string;
  unidade: string;
  habilidades: string;
  cor: string;
  resumo: string[];
  saresp: string; // dica de prova
  jogos: GameKind[]; // primeiro = recomendado
  itens: Item[];
}


export const TEMAS: Tema[] = [
  {
    id: "maquinas",
    titulo: "Máquinas simples",
    unidade: "Matéria e Energia",
    habilidades: "EF07CI01",
    cor: "#e07a1f",
    resumo: [
      "Máquinas simples diminuem a força necessária ou mudam sua direção.",
      "Alavanca: barra + ponto de apoio + força potente + força resistente.",
      "Roldana fixa muda a direção da força; a móvel reduz a força pela metade.",
      "Plano inclinado: percurso maior, força menor.",
    ],
    saresp: "Questões trazem objetos do cotidiano (tesoura, carrinho de mão, rampa) e pedem para identificar a máquina e a vantagem mecânica.",
    jogos: ["imagem", "inverso", "cartas"],
    itens: [
      { id: "alavanca", termo: "Alavanca", img: "/img/alavanca.webp", def: "Barra rígida que gira em torno de um ponto de apoio, multiplicando a força.", explica: "Elementos: ponto de apoio (fulcro), força potente (quem faz força) e força resistente (o peso). Quanto mais longe do apoio a força é aplicada, menor o esforço. Exemplos: gangorra, tesoura, alicate, pé de cabra, carrinho de mão." },
      { id: "roldana", termo: "Roldana (polia)", img: "/img/roldana.webp", def: "Roda com sulco por onde passa uma corda, usada para erguer cargas.", explica: "Roldana fixa: não reduz a força, mas muda sua direção (puxar para baixo para subir a carga). Roldana móvel: divide a força. Associações de roldanas (talhas) reduzem ainda mais o esforço. Exemplos: poço, guindaste, varal de prédio." },
      { id: "plano", termo: "Plano inclinado", img: "/img/plano.webp", def: "Superfície inclinada que permite elevar objetos com menos força.", explica: "Troca-se força por distância: o caminho fica mais longo, porém o esforço é menor. Exemplos: rampas de acesso, escadas, estradas em serpentina. A cunha (machado) e o parafuso são variações do plano inclinado." },
      { id: "apoio", termo: "Ponto de apoio", def: "Ponto fixo em torno do qual a alavanca gira (fulcro).", explica: "A posição do ponto de apoio define o tipo de alavanca: interfixa (apoio no meio – tesoura), inter-resistente (carga no meio – carrinho de mão) e interpotente (força no meio – pinça)." },
      { id: "cunha", termo: "Cunha", def: "Peça em forma de V que separa ou corta materiais.", explica: "A cunha transforma uma força aplicada em sua base em forças laterais que separam o material. Exemplos: machado, faca, prego, talhadeira." },
    ],
  },
  {
    id: "calor",
    titulo: "Calor e temperatura",
    unidade: "Matéria e Energia",
    habilidades: "EF07CI02 · EF07CI03 · EF07CI04",
    cor: "#d1372b",
    resumo: [
      "Temperatura mede a agitação das partículas; calor é energia em trânsito.",
      "Calor flui sempre do corpo mais quente para o mais frio.",
      "Três formas de propagação: condução, convecção e irradiação.",
      "Equilíbrio térmico: corpos em contato chegam à mesma temperatura.",
    ],
    saresp: "Diferenciar calor, temperatura e sensação térmica; escolher bons condutores/isolantes (garrafa térmica, panelas, roupas).",
    jogos: ["cartas", "imagem", "inverso"],
    itens: [
      { id: "termometro", termo: "Temperatura", img: "/img/termometro.webp", def: "Medida do grau de agitação das partículas de um corpo.", explica: "É medida com o termômetro, em graus Celsius (°C). Temperatura não é energia: é um indicador do estado térmico. Calor e temperatura são conceitos diferentes – erro muito cobrado em prova." },
      { id: "conducao", termo: "Condução", img: "/img/conducao.webp", def: "Propagação do calor de partícula a partícula, típica dos sólidos.", explica: "Ocorre por contato. Metais são bons condutores (panela, colher). Madeira, plástico, isopor, lã e ar parado são isolantes térmicos – por isso cabos de panela são de madeira ou plástico." },
      { id: "conveccao", termo: "Convecção", img: "/img/conveccao.webp", def: "Propagação do calor por correntes em líquidos e gases.", explica: "O fluido aquecido fica menos denso e sobe; o frio, mais denso, desce, formando correntes de convecção. Exemplos: água fervendo, ar-condicionado instalado no alto, geladeira com congelador em cima, brisas marítimas." },
      { id: "irradiacao", termo: "Irradiação", img: "/img/irradiacao.webp", def: "Propagação do calor por ondas eletromagnéticas, inclusive no vácuo.", explica: "Não precisa de meio material. É assim que o calor do Sol chega à Terra. Superfícies escuras absorvem mais radiação; claras e espelhadas refletem (garrafa térmica tem paredes espelhadas)." },
      { id: "equilibrio", termo: "Equilíbrio térmico", def: "Situação em que corpos em contato atingem a mesma temperatura.", explica: "O corpo mais quente cede calor ao mais frio até as temperaturas se igualarem. Exemplo: café esfriando na xícara até a temperatura ambiente. A garrafa térmica dificulta esse processo." },
      { id: "sensacao", termo: "Sensação térmica", def: "Percepção de quente ou frio pelo corpo, que pode enganar.", explica: "Depende de vento, umidade e do material tocado. Metal parece mais frio que madeira à mesma temperatura porque conduz o calor da mão mais rápido." },
      { id: "isolante", termo: "Isolante térmico", def: "Material que dificulta a passagem do calor.", explica: "Exemplos: isopor, lã, madeira, cortiça, ar. Usados em caixas térmicas, roupas de inverno, cabos de panela e paredes de construção." },
    ],
  },
  {
    id: "termicas",
    titulo: "Combustíveis e máquinas térmicas",
    unidade: "Matéria e Energia",
    habilidades: "EF07CI05 · EF07CI06 · EF07CI17*",
    cor: "#8a5a2b",
    resumo: [
      "Máquinas térmicas transformam calor em movimento (trabalho).",
      "A máquina a vapor impulsionou a Revolução Industrial.",
      "Combustíveis fósseis (petróleo, carvão, gás) não são renováveis e poluem.",
      "Biocombustíveis (etanol, biodiesel) são renováveis.",
    ],
    saresp: "Relacionar o uso de combustíveis a mudanças sociais, econômicas e ambientais; comparar fontes renováveis e não renováveis.",
    jogos: ["cartas", "imagem", "inverso"],
    itens: [
      { id: "vapor", termo: "Máquina a vapor", img: "/img/vapor.webp", def: "Máquina que usa o vapor da água aquecida para gerar movimento.", explica: "Queima-se carvão para ferver água; o vapor empurra pistões que movem rodas. Foi a base da Revolução Industrial (séc. XVIII), mudando o trabalho, o transporte (trens, navios) e as cidades." },
      { id: "fossil", termo: "Combustível fóssil", def: "Combustível originado de restos de seres vivos há milhões de anos.", explica: "Petróleo (gasolina, diesel), carvão mineral e gás natural. Não renováveis e grandes emissores de CO₂, que intensifica o efeito estufa." },
      { id: "bio", termo: "Biocombustível", def: "Combustível renovável produzido a partir de vegetais.", explica: "Etanol (cana-de-açúcar) e biodiesel (soja, mamona). As plantas absorvem CO₂ ao crescer, reduzindo o impacto em relação aos fósseis." },
      { id: "revolucao", termo: "Revolução Industrial", def: "Transformação da produção artesanal para a produção em fábricas com máquinas.", explica: "Iniciada na Inglaterra no séc. XVIII. Trouxe aumento da produção, urbanização, novas relações de trabalho e também poluição e problemas ambientais." },
      { id: "motor", termo: "Motor a combustão", def: "Máquina térmica que queima combustível dentro de cilindros.", explica: "Presente em carros e motos. A explosão do combustível empurra pistões. Parte da energia é sempre perdida como calor." },
    ],
  },
  {
    id: "ecossistemas",
    titulo: "Ecossistemas brasileiros",
    unidade: "Vida e Evolução",
    habilidades: "EF07CI07 · EF07CI08",
    cor: "#2e8b57",
    resumo: [
      "Cada ecossistema tem clima, solo, água, fauna e flora próprios.",
      "Biomas: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.",
      "Mudanças (desmatamento, queimadas, poluição) afetam todas as populações.",
      "Extinção de espécies e desequilíbrio das cadeias alimentares.",
    ],
    saresp: "Reconhecer o ecossistema por imagem/características e prever impactos de catástrofes naturais ou ação humana.",
    jogos: ["imagem", "inverso", "cartas"],
    itens: [
      { id: "amazonia", termo: "Amazônia", img: "/img/amazonia.webp", def: "Floresta quente e úmida, com a maior biodiversidade e a maior bacia hidrográfica.", explica: "Clima equatorial, chuvas abundantes, árvores altas e folhas largas. Fauna: arara, boto-cor-de-rosa, onça. Ameaças: desmatamento, garimpo e queimadas." },
      { id: "cerrado", termo: "Cerrado", img: "/img/cerrado.webp", def: "Savana brasileira com árvores tortas, casca grossa e raízes profundas.", explica: "Estação seca e chuvosa bem definidas. Chamado 'berço das águas' por abrigar nascentes. Fauna: lobo-guará, tamanduá-bandeira, ema. Ameaça: expansão agropecuária." },
      { id: "caatinga", termo: "Caatinga", img: "/img/caatinga.webp", def: "Bioma do semiárido nordestino, com plantas adaptadas à seca.", explica: "Pouca chuva, solo raso. Plantas perdem folhas na seca e cactos armazenam água (mandacaru, xique-xique). Exclusivo do Brasil. Ameaça: desertificação." },
      { id: "mata", termo: "Mata Atlântica", img: "/img/mata.webp", def: "Floresta do litoral brasileiro, a mais devastada do país.", explica: "Resta cerca de 12% da área original. Alta biodiversidade: mico-leão-dourado, bromélias, palmito-juçara. Onde vive a maior parte da população brasileira." },
      { id: "pantanal", termo: "Pantanal", img: "/img/pantanal.webp", def: "Maior planície alagável do mundo, com cheias periódicas.", explica: "Alterna períodos de cheia e seca. Fauna rica: tuiuiú, jacaré, capivara, onça-pintada. Ameaças: queimadas e pecuária." },
      { id: "mangue", termo: "Manguezal", img: "/img/mangue.webp", def: "Ecossistema costeiro de água salobra, berçário de espécies marinhas.", explica: "Encontro de rio com mar. Árvores com raízes-escora e respiratórias; solo lamacento. Abriga caranguejos, peixes e aves. Ameaças: aterros e poluição." },
      { id: "desmat", termo: "Desmatamento e queimadas", img: "/img/desmat.webp", def: "Remoção da vegetação, causando perda de habitat e de espécies.", explica: "Consequências: erosão do solo, extinção de espécies, alteração do clima e das chuvas, emissão de CO₂. Exemplo de impacto humano cobrado em prova." },
    ],
  },
  {
    id: "saude",
    titulo: "Saúde coletiva e vacinas",
    unidade: "Vida e Evolução",
    habilidades: "EF07CI09 · EF07CI10 · EF07CI11",
    cor: "#2b6cb0",
    resumo: [
      "Indicadores de saúde: mortalidade infantil, saneamento, expectativa de vida.",
      "Saneamento básico: água tratada, esgoto, coleta de lixo.",
      "Vacinas preparam o sistema imunológico contra doenças.",
      "Vírus não são células; bactérias são células simples (procariontes).",
    ],
    saresp: "Interpretar tabelas/gráficos de indicadores de saúde e argumentar sobre a importância da vacinação para a saúde pública.",
    jogos: ["cartas", "imagem", "inverso"],
    itens: [
      { id: "saneamento", termo: "Saneamento básico", img: "/img/saneamento.webp", def: "Conjunto de serviços: água tratada, esgoto, lixo e drenagem.", explica: "Evita doenças como diarreia, cólera, hepatite A e verminoses. A falta de saneamento aumenta a mortalidade infantil – indicador importante da qualidade de vida." },
      { id: "vacina", termo: "Vacina", img: "/img/vacina.webp", def: "Substância que estimula o corpo a produzir defesas (anticorpos).", explica: "Contém o agente enfraquecido, inativado ou partes dele. Protege a pessoa e a comunidade (imunidade coletiva). Erradicou a varíola e controla poliomielite e sarampo. Calendário vacinal é política pública (SUS)." },
      { id: "virus", termo: "Vírus", img: "/img/virus.webp", def: "Agente acelular que só se reproduz dentro de células vivas.", explica: "Formado por material genético e cápsula de proteína. Causa gripe, COVID-19, dengue, sarampo. Antibióticos não funcionam contra vírus. Bactérias, ao contrário, são células e podem ser tratadas com antibióticos." },
      { id: "mortalidade", termo: "Mortalidade infantil", def: "Número de crianças que morrem antes de 1 ano a cada mil nascidas.", explica: "Indicador sensível às condições de saneamento, nutrição, vacinação e atendimento médico. Quanto menor, melhor a qualidade de vida da população." },
      { id: "imunidade", termo: "Imunidade coletiva", def: "Proteção da população quando a maioria está vacinada.", explica: "Quando muitas pessoas estão vacinadas, o agente circula menos e protege também quem não pode se vacinar (bebês, pessoas doentes)." },
      { id: "epidemia", termo: "Epidemia / Pandemia", def: "Aumento de casos de uma doença em uma região / no mundo todo.", explica: "Endemia: casos constantes numa região (malária na Amazônia). Epidemia: surto acima do esperado (dengue). Pandemia: espalhada por vários continentes (COVID-19)." },
    ],
  },
  {
    id: "atmosfera",
    titulo: "Atmosfera e clima",
    unidade: "Terra e Universo",
    habilidades: "EF07CI12 · EF07CI13 · EF07CI14",
    cor: "#3a8fb7",
    resumo: [
      "O ar é uma mistura: ~78% nitrogênio, ~21% oxigênio, 1% outros gases (CO₂, argônio).",
      "Efeito estufa é natural e mantém a Terra aquecida.",
      "A queima de combustíveis intensifica o efeito estufa → aquecimento global.",
      "A camada de ozônio filtra a radiação ultravioleta; os CFCs a destroem.",
    ],
    saresp: "Diferenciar efeito estufa de camada de ozônio (confusão comum) e propor ações para reduzir os impactos.",
    jogos: ["inverso", "imagem", "cartas"],
    itens: [
      { id: "estufa", termo: "Efeito estufa", img: "/img/estufa.webp", def: "Retenção de parte do calor do Sol pelos gases da atmosfera.", explica: "Fenômeno natural e essencial à vida (sem ele a Terra teria cerca de –18 °C). Gases: CO₂, metano, vapor d'água. O excesso desses gases, pela queima de combustíveis e queimadas, intensifica o efeito e causa aquecimento global." },
      { id: "ozonio", termo: "Camada de ozônio", img: "/img/ozonio.webp", def: "Camada de gás O₃ que filtra os raios ultravioleta do Sol.", explica: "Fica na estratosfera. Protege contra câncer de pele e danos a seres vivos. Os gases CFC (antigos aerossóis e geladeiras) abriram o 'buraco' sobre a Antártida. O Protocolo de Montreal proibiu os CFCs." },
      { id: "ar", termo: "Composição do ar", def: "Mistura de gases: 78% nitrogênio, 21% oxigênio e 1% outros.", explica: "O oxigênio é usado na respiração e na combustão; o CO₂ na fotossíntese; o nitrogênio é o gás mais abundante. Poluentes (fumaça, CO) alteram essa composição." },
      { id: "aquecimento", termo: "Aquecimento global", def: "Aumento da temperatura média do planeta pela ação humana.", explica: "Consequências: derretimento de geleiras, elevação do nível do mar, eventos extremos. Soluções: energias renováveis, transporte público, reflorestamento." },
      { id: "cfc", termo: "CFC", def: "Gás clorofluorcarbono que destrói o ozônio.", explica: "Era usado em sprays, geladeiras e ar-condicionado. Foi substituído por gases menos agressivos após o Protocolo de Montreal (1987)." },
    ],
  },
  {
    id: "terra",
    titulo: "Placas tectônicas e fenômenos naturais",
    unidade: "Terra e Universo",
    habilidades: "EF07CI15 · EF07CI16",
    cor: "#7b4fa3",
    resumo: [
      "A crosta é dividida em placas tectônicas que se movem sobre o manto.",
      "Encontros de placas causam vulcões, terremotos e tsunamis.",
      "Deriva continental: os continentes formavam a Pangeia.",
      "Evidências: encaixe África–América do Sul, fósseis e rochas iguais.",
    ],
    saresp: "Relacionar a localização de vulcões e terremotos aos limites das placas e justificar a teoria da deriva continental.",
    jogos: ["imagem", "inverso", "cartas"],
    itens: [
      { id: "vulcao", termo: "Vulcão", img: "/img/vulcao.webp", def: "Abertura na crosta por onde sai magma (lava), gases e cinzas.", explica: "O magma vem do interior da Terra. Ocorre principalmente nas bordas das placas (Círculo de Fogo do Pacífico). Pode formar ilhas e solos férteis." },
      { id: "terremoto", termo: "Terremoto (abalo sísmico)", img: "/img/terremoto.webp", def: "Tremor da crosta causado pelo movimento brusco das placas.", explica: "O ponto interno onde começa é o hipocentro; na superfície, o epicentro. Medido pela escala Richter com o sismógrafo. O Brasil fica no centro de uma placa, por isso tem poucos tremores." },
      { id: "tsunami", termo: "Tsunami", img: "/img/tsunami.webp", def: "Onda gigante provocada por terremoto ou vulcão no fundo do mar.", explica: "O deslocamento do fundo oceânico empurra enorme volume de água, que cresce ao chegar à costa. Exemplos: Oceano Índico (2004) e Japão (2011)." },
      { id: "placas", termo: "Placas tectônicas", img: "/img/placas.webp", def: "Grandes blocos da crosta terrestre que se movem lentamente.", explica: "Movem-se alguns centímetros por ano, impulsionadas por correntes de convecção do manto. Podem se afastar (divergentes), colidir (convergentes – formam montanhas) ou deslizar lado a lado (transformantes)." },
      { id: "pangeia", termo: "Pangeia / Deriva continental", img: "/img/pangeia.webp", def: "Supercontinente único que se fragmentou e originou os continentes atuais.", explica: "Teoria de Alfred Wegener (1912). Evidências: o encaixe dos litorais da América do Sul e da África, fósseis do mesmo réptil (Mesosaurus) e rochas iguais nos dois continentes." },
    ],
  },
];

export const JOGO_NOME: Record<GameKind, string> = {
  imagem: "Imagem → Termo",
  inverso: "Termo → Imagem",
  cartas: "Cartas: termo e significado",
};
