import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ecosistemaData = [
  {
    id: 1, nome: "Peixe-Palhaço", tipo: "Peixe", profundidade: "1–15m", cor: "#FF6347",
    imagem: "🐠",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Clownfish_Amphiprion_ocellaris.jpg/480px-Clownfish_Amphiprion_ocellaris.jpg",
    curiosidade: "Vive em simbiose com anêmonas-do-mar, sendo imune ao seu veneno paralisante.",
    bio: "O peixe-palhaço habita os recifes de coral do Oceano Índico e Pacífico. Ele vive em uma relação simbiótica com as anêmonas: o peixe limpa e protege a anêmona, enquanto ela oferece abrigo e segurança. Curiosamente, todos os peixe-palhaços nascem machos — o dominante pode mudar de sexo para fêmea quando necessário."
  },
  {
    id: 2, nome: "Peixe-Anjo", tipo: "Peixe", profundidade: "1–100m", cor: "#FF69B4",
    imagem: "🐡",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pomacanthus_imperator_-_melbourne_aquarium.jpg/480px-Pomacanthus_imperator_-_melbourne_aquarium.jpg",
    curiosidade: "Muda de cor, padrão e até de sexo conforme cresce.",
    bio: "Os peixes-anjo são reconhecidos pelos seus padrões vívidos de listras e manchas. Vivem nos recifes de coral tropicais e se alimentam de esponjas, algas e pequenos invertebrados. Possuem uma espinha aguçada perto da guelra que usam como defesa."
  },
  {
    id: 3, nome: "Peixe-Cirurgião", tipo: "Peixe", profundidade: "3–40m", cor: "#4169E1",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Paracanthurus_hepatus_%28Palette_surgeonfish%29.jpg/480px-Paracanthurus_hepatus_%28Palette_surgeonfish%29.jpg",
    curiosidade: "Possui uma espinha retrátil afiada na cauda, usada como bisturi para se defender.",
    bio: "Famoso pelo filme 'Procurando Dory', o peixe-cirurgião azul habita os recifes do Indo-Pacífico. Sua espinha caudal é tão afiada que lhe rendeu o nome 'cirurgião'. Alimenta-se principalmente de algas, sendo essencial para a saúde dos corais."
  },
  {
    id: 4, nome: "Peixe-Borboleta", tipo: "Peixe", profundidade: "1–30m", cor: "#FFD700",
    imagem: "🐠",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Chaetodon_lunula_1.jpg/480px-Chaetodon_lunula_1.jpg",
    curiosidade: "Possui uma mancha escura perto da cauda que parece um olho para confundir predadores.",
    bio: "Os peixes-borboleta são um dos grupos mais coloridos dos recifes de coral. Vivem em pares monógamos para toda a vida e defendem seu território com grande afinco. Sua dieta inclui pólipos de coral, algas e pequenos invertebrados."
  },
  {
    id: 5, nome: "Peixe-Papagaio", tipo: "Peixe", profundidade: "1–25m", cor: "#32CD32",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bullethead_parrotfish.jpg/480px-Bullethead_parrotfish.jpg",
    curiosidade: "Produz areia ao mastigar corais mortos, criando as areias brancas das praias tropicais.",
    bio: "O peixe-papagaio tem um bico resistente formado pela fusão dos dentes, semelhante ao bico de um papagaio. Ele raspa algas e corais mortos das rochas para se alimentar, produzindo toneladas de areia por ano. Algumas espécies criam um casulo de muco à noite para dormir."
  },
  {
    id: 6, nome: "Tubarão Branco", tipo: "Peixe", profundidade: "0–1.200m", cor: "#708090",
    imagem: "🦈",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/480px-White_shark.jpg",
    curiosidade: "Predador ápice com dentes que se renovam durante toda a vida — pode ter até 50.000 dentes.",
    bio: "O tubarão branco é o maior peixe predador do planeta, podendo atingir 6 metros e 2 toneladas. Detecta sangue a quilômetros de distância graças a órgãos sensoriais chamados ampolas de Lorenzini. Apesar da fama aterrorizante, ataques a humanos são raros e geralmente um erro de identificação."
  },
  {
    id: 7, nome: "Tubarão-Martelo", tipo: "Peixe", profundidade: "1–80m", cor: "#696969",
    imagem: "🦈",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Sphyrna_lewini_bahamas.jpg/480px-Sphyrna_lewini_bahamas.jpg",
    curiosidade: "Sua cabeça em formato de martelo aumenta o campo visual e a detecção de campos elétricos.",
    bio: "O tubarão-martelo é facilmente reconhecível pela sua cabeça achatada e alargada, chamada cefalofoil. Vive em cardumes durante o dia e caça sozinho à noite. Alimenta-se de peixes, lulas e raias, sendo capaz de detectar as correntes elétricas das presas enterradas na areia."
  },
  {
    id: 8, nome: "Tubarão-Baleia", tipo: "Peixe", profundidade: "0–700m", cor: "#4682B4",
    imagem: "🦈",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Whale_shark_Georgia_aquarium.jpg/480px-Whale_shark_Georgia_aquarium.jpg",
    curiosidade: "O maior peixe do mundo, com até 12 metros, mas se alimenta apenas de plâncton e krill.",
    bio: "Apesar do nome intimidante, o tubarão-baleia é completamente inofensivo. Filtra grandes volumes de água com sua enorme boca para capturar microorganismos. Pode viver mais de 100 anos e nada lentamente percorrendo longas distâncias pelos oceanos tropicais."
  },
  {
    id: 9, nome: "Arraia-Manta", tipo: "Peixe", profundidade: "0–120m", cor: "#000080",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Manta_birostris-Thailand4.jpg/480px-Manta_birostris-Thailand4.jpg",
    curiosidade: "Possui o maior cérebro entre os peixes e pode ter envergadura de até 9 metros.",
    bio: "A arraia-manta gigante é um dos animais marinhos mais elegantes. Filtra plâncton com a boca aberta enquanto nada graciosamente. São animais curiosos e frequentemente se aproximam de mergulhadores. Vivem em torno de 40 anos e dão à luz apenas um filhote por vez."
  },
  {
    id: 10, nome: "Cavalo-Marinho", tipo: "Peixe", profundidade: "0–30m", cor: "#F0E68C",
    imagem: "🐴",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Hippocampus_kuda_%28Spotted_seahorse%29.jpg/480px-Hippocampus_kuda_%28Spotted_seahorse%29.jpg",
    curiosidade: "É o único animal do mundo em que o macho engravida e dá à luz.",
    bio: "O cavalo-marinho é um peixe que nada na vertical, usando uma pequena barbatana dorsal. Não possui estômago — a comida passa tão rápido que precisam comer constantemente. Os casais formam laços monógamos e se cumprimentam dançando juntos ao amanhecer."
  },
  {
    id: 11, nome: "Baleia Azul", tipo: "Mamífero", profundidade: "0–200m", cor: "#4A90E2",
    imagem: "🐋",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_Whale_underwater_shot.jpg/480px-Humpback_Whale_underwater_shot.jpg",
    curiosidade: "O maior animal que já existiu na Terra, com até 30 metros e 180 toneladas.",
    bio: "A baleia azul é o maior ser vivo conhecido. Seu coração pesa cerca de 600 kg, e seus chamados podem ser ouvidos a centenas de quilômetros de distância. Alimenta-se exclusivamente de krill — pequenos crustáceos — e pode consumir 4 toneladas por dia durante o verão."
  },
  {
    id: 12, nome: "Golfinho", tipo: "Mamífero", profundidade: "0–300m", cor: "#00CED1",
    imagem: "🐬",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/480px-Tursiops_truncatus_01.jpg",
    curiosidade: "Usa ecolocalização para navegar e caçar, emitindo sons que mapeiam o ambiente.",
    bio: "Os golfinhos são considerados uns dos animais mais inteligentes do planeta. Vivem em grupos sociais complexos chamados manadas e possuem nomes individuais — chamados únicos que usam para se identificar. Dormem com metade do cérebro por vez, mantendo a outra metade acordada para respirar."
  },
  {
    id: 13, nome: "Orca", tipo: "Mamífero", profundidade: "0–200m", cor: "#1a1a2e",
    imagem: "🐋",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/480px-Killerwhales_jumping.jpg",
    curiosidade: "Na verdade é o maior membro da família dos golfinhos, não uma baleia.",
    bio: "As orcas são predadores ápice dos oceanos, capazes de caçar tubarões-brancos e baleias. Vivem em grupos familiares matriarcais com linguagem e técnicas de caça próprias de cada grupo. São os mamíferos marinhos com maior distribuição geográfica do planeta."
  },
  {
    id: 14, nome: "Polvo Gigante", tipo: "Molusco", profundidade: "200–2.000m", cor: "#8B4513",
    imagem: "🐙",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Octopus_vulgaris_-_Merculiano.jpg/480px-Octopus_vulgaris_-_Merculiano.jpg",
    curiosidade: "Possui 3 corações, sangue azul, 8 braços com 240 ventosas cada e cérebros nos tentáculos.",
    bio: "O polvo é considerado o invertebrado mais inteligente do mundo. Pode abrir potes, aprender com experiências e usar ferramentas. Sua habilidade de mudar de cor e textura em milissegundos é usada tanto para camuflagem quanto para comunicação. Vive apenas 1 a 2 anos."
  },
  {
    id: 15, nome: "Lula Gigante", tipo: "Molusco", profundidade: "300–2.000m", cor: "#800080",
    imagem: "🦑",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Giant_squid_melb_museum.jpg/480px-Giant_squid_melb_museum.jpg",
    curiosidade: "Possui os maiores olhos do reino animal — podem chegar a 30 cm de diâmetro.",
    bio: "A lula gigante pode atingir até 13 metros de comprimento e habita as profundezas oceânicas. É a principal presa do cachalote, e as batalhas entre os dois deixam marcas nas peles das baleias. Seus olhos enormes captam a mínima quantidade de luz no fundo escuro do oceano."
  },
  {
    id: 16, nome: "Caranguejo", tipo: "Crustáceo", profundidade: "0–4.000m", cor: "#DC143C",
    imagem: "🦀",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Signal_crayfish.jpg/480px-Signal_crayfish.jpg",
    curiosidade: "Caminha de lado e pode regenerar completamente garras e pernas perdidas.",
    bio: "Os caranguejos existem há mais de 200 milhões de anos e habitam desde praias rasas até fossas oceânicas. Possuem exoesqueleto rígido que trocam periodicamente no processo chamado ecdise. São onívoros e cumprem papel vital nos ecossistemas como limpadores de fundo."
  },
  {
    id: 17, nome: "Lagosta", tipo: "Crustáceo", profundidade: "4–480m", cor: "#B22222",
    imagem: "🦞",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rock_Lobster.jpg/480px-Rock_Lobster.jpg",
    curiosidade: "Pode viver mais de 100 anos e continuar crescendo ao longo de toda a vida.",
    bio: "As lagostas são biologicamente imortais no sentido de que não mostram sinais de envelhecimento com o tempo — continuam crescendo e se reproduzindo. Possuem sangue azul rico em cobre. Antes de serem consideradas uma iguaria, eram alimento de pobres e prisioneiros."
  },
  {
    id: 18, nome: "Tartaruga Marinha", tipo: "Réptil", profundidade: "0–1.000m", cor: "#228B22",
    imagem: "🐢",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Chelonia_mydas_is_going_up.jpg/480px-Chelonia_mydas_is_going_up.jpg",
    curiosidade: "Usa o campo magnético terrestre para navegar e retorna à praia onde nasceu para desovar.",
    bio: "As tartarugas marinhas existem há mais de 100 milhões de anos, sobrevivendo aos dinossauros. Passam a maior parte da vida no oceano, mas as fêmeas retornam às praias para desovar. Algumas espécies percorrem mais de 2.000 km em migrações. Estão ameaçadas de extinção por poluição e pesca acidental."
  },
  {
    id: 19, nome: "Água-Viva", tipo: "Cnidário", profundidade: "0–4.000m", cor: "#DDA0DD",
    imagem: "🪼",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jelly_cc11.jpg/480px-Jelly_cc11.jpg",
    curiosidade: "Existe há 500 milhões de anos, antes dos dinossauros — e uma espécie é biologicamente imortal.",
    bio: "As águas-vivas não possuem cérebro, coração, ossos ou sangue. São compostas por 95% de água. A espécie Turritopsis dohrnii pode reverter ao estágio juvenil após atingir a maturidade, tornando-se potencialmente imortal. Algumas espécies bioluminescentes iluminam as profundezas oceânicas."
  },
  {
    id: 20, nome: "Estrela-do-Mar", tipo: "Equinodermo", profundidade: "0–6.000m", cor: "#FF8C00",
    imagem: "⭐",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Sea_star_Fromia_monilis.jpg/480px-Sea_star_Fromia_monilis.jpg",
    curiosidade: "Não tem cérebro nem sangue — usa água do mar para movimentar seus braços.",
    bio: "As estrelas-do-mar podem ter de 5 a 40 braços e regenerá-los completamente se perdidos. Possuem um estômago que expelem para fora do corpo para digerir presas maiores que a sua boca. Existem mais de 2.000 espécies, encontradas em todos os oceanos do planeta."
  },
  {
    id: 21, nome: "Baleia Jubarte", tipo: "Mamífero", profundidade: "0–200m", cor: "#2F4F8F",
    imagem: "🐋",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Humpback_Whale_underwater_shot.jpg/480px-Humpback_Whale_underwater_shot.jpg",
    curiosidade: "Os machos cantam músicas complexas que evoluem ao longo do tempo, como tendências musicais.",
    bio: "A baleia jubarte é famosa pelos seus saltos espetaculares fora d'água, comportamento chamado breaching. Realiza migrações de até 25.000 km por ano. Suas nadadeiras peitorais, as maiores entre os mamíferos, podem medir 5 metros. Sua população se recuperou após quase ser extinta pela caça no século XX."
  },
  {
    id: 22, nome: "Narval", tipo: "Mamífero", profundidade: "0–1.500m", cor: "#6A5ACD",
    imagem: "🦄",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Narwal_2.jpg/480px-Narwal_2.jpg",
    curiosidade: "Seu longo 'chifre' é na verdade um dente em espiral com até 3 metros, cheio de terminações nervosas.",
    bio: "Apelidado de 'unicórnio do mar', o narval habita os mares árticos do Canadá e da Groenlândia. Seu dente espiral é usado para detectar mudanças de temperatura e pressão. Vivem em grupos e usam ecolocalização para navegar sob o gelo. São animais profundamente mergulhadores, podendo descer a 1.500 metros."
  },
  {
    id: 23, nome: "Beluga", tipo: "Mamífero", profundidade: "0–700m", cor: "#F5F5F5",
    imagem: "🐳",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Delphinapterus_leucas_2_%28Marianne_Goulet%29.jpg/480px-Delphinapterus_leucas_2_%28Marianne_Goulet%29.jpg",
    curiosidade: "É chamada de 'canário do mar' pela variedade de sons que emite e pode virar a cabeça completamente.",
    bio: "A baleia beluga é branca e não possui nadadeira dorsal, o que a ajuda a nadar sob blocos de gelo. É extremamente sociável e vocal, capaz de imitar sons e até palavras humanas. Nascen cinzas e vão clareando ao longo dos anos até atingirem o branco puro na idade adulta."
  },
  {
    id: 24, nome: "Dugongo", tipo: "Mamífero", profundidade: "0–37m", cor: "#8B7355",
    imagem: "🐄",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Dugong_Marsa_Alam.jpg/480px-Dugong_Marsa_Alam.jpg",
    curiosidade: "É o único mamífero marino herbívoro e teria inspirado as lendas das sereias.",
    bio: "O dugongo é parente do elefante e da lontra-marinha. Alimenta-se exclusivamente de ervas marinhas, podendo comer 40 kg por dia. Vive em torno de 70 anos. Está ameaçado de extinção por destruição de habitat e colisões com embarcações. Teria dado origem às lendas de sereias entre marinheiros."
  },
  {
    id: 25, nome: "Foca-Leopardo", tipo: "Mamífero", profundidade: "0–600m", cor: "#708090",
    imagem: "🦭",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Leopard_seal_%28Hydrurga_leptonyx%29.jpg/480px-Leopard_seal_%28Hydrurga_leptonyx%29.jpg",
    curiosidade: "Predadora feroz que caça pinguins com grande habilidade, mas é brincalhona com humanos.",
    bio: "A foca-leopardo é um dos maiores predadores da Antártida. Possui mandíbulas excepcionalmente grandes e dentes afiados para capturar presas. Seu nome vem das manchas em sua pele. Apesar da reputação aterrorizante, há registros de focas-leopardo oferecendo pinguins vivos a fotógrafos subaquáticos como 'presente'."
  },
  {
    id: 26, nome: "Peixe-Espada", tipo: "Peixe", profundidade: "0–800m", cor: "#4169E1",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Xiphias_gladius1.jpg/480px-Xiphias_gladius1.jpg",
    curiosidade: "Um dos peixes mais rápidos do oceano, atingindo até 100 km/h, e pode aquecer seus próprios olhos.",
    bio: "O peixe-espada possui uma adaptação única: consegue aquecer seus olhos e cérebro acima da temperatura do oceano, melhorando a visão e os reflexos durante a caça. Usa seu longo rostro para atordoar cardumes de peixes. É um caçador solitário que migra entre águas quentes e frias."
  },
  {
    id: 27, nome: "Camarão-Mantis", tipo: "Crustáceo", profundidade: "3–40m", cor: "#FF4500",
    imagem: "🦐",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Odontodactylus_scyllarus.jpg/480px-Odontodactylus_scyllarus.jpg",
    curiosidade: "Seu golpe é tão rápido quanto uma bala de pistola e pode quebrar vidro de aquário.",
    bio: "O camarão-mantis é um dos animais mais perigosos dos recifes de coral. Seus 'murros' atingem velocidades de 80 km/h, gerando calor e luz por cavitação. Possui 16 tipos de fotorreceptores nos olhos — humanos têm apenas 3 — enxergando cores e luz UV invisíveis para nós. Forma casais monógamos para toda a vida."
  },
  {
    id: 28, nome: "Peixe-Lanterna", tipo: "Peixe", profundidade: "200–1.000m", cor: "#191970",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Myctophum_punctatum.jpg/480px-Myctophum_punctatum.jpg",
    curiosidade: "Realiza a maior migração vertical diária do planeta, subindo à superfície toda noite.",
    bio: "Os peixes-lanterna possuem órgãos luminosos (fotóforos) ao longo do corpo que produzem luz azul-esverdeada. Vivem nas zonas mesopelágicas durante o dia e sobem à superfície à noite para se alimentar, em uma das maiores migrações verticais em massa do planeta. São um elo vital na cadeia alimentar oceânica."
  },
  {
    id: 29, nome: "Pepino-do-Mar", tipo: "Equinodermo", profundidade: "0–10.900m", cor: "#8B6914",
    imagem: "🥒",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Holothuria_atra.jpg/480px-Holothuria_atra.jpg",
    curiosidade: "Quando ameaçado, expele seus próprios órgãos internos — e consegue regenerá-los completamente.",
    bio: "O pepino-do-mar é um animal de aparência simples mas com adaptações extraordinárias. Pode liquefazer seu corpo para escorregar por fendas estreitas e depois solidificar novamente. É o 'adubo' do fundo do mar, reciclando sedimentos e nutrientes. Algumas espécies abrigam peixes minúsculos dentro do próprio corpo."
  },
  {
    id: 30, nome: "Ouriço-do-Mar", tipo: "Equinodermo", profundidade: "0–5.000m", cor: "#8B0000",
    imagem: "🔴",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Strongylocentrotus_droebachiensis.jpg/480px-Strongylocentrotus_droebachiensis.jpg",
    curiosidade: "Seus espinhos podem crescer novamente e usa-os para se locomover pelo fundo do mar.",
    bio: "O ouriço-do-mar possui uma boca com 5 dentes em uma estrutura chamada Lanterna de Aristóteles. Alimenta-se de algas, controlando o crescimento excessivo nos recifes. Pode viver mais de 200 anos. Seus espinhos contêm veneno e são usados tanto para defesa quanto para se ancorar às rochas."
  },
  {
    id: 31, nome: "Coral", tipo: "Cnidário", profundidade: "0–300m", cor: "#FF7F50",
    imagem: "🪸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Coral_reef_at_palmyra.jpg/480px-Coral_reef_at_palmyra.jpg",
    curiosidade: "Parece uma planta mas é um animal colonial — cada 'ramo' é formado por milhares de pequenos pólipos.",
    bio: "Os corais constroem os recifes que cobrem menos de 1% do fundo oceânico, mas abrigam 25% de todas as espécies marinhas. Vivem em simbiose com algas microscópicas que lhes fornecem alimento e cor. O branqueamento dos corais ocorre quando o aquecimento das águas expulsa essas algas, ameaçando o ecossistema inteiro."
  },
  {
    id: 32, nome: "Anêmona-do-Mar", tipo: "Cnidário", profundidade: "0–50m", cor: "#FF1493",
    imagem: "🌸",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Anemone_at_Roatan.jpg/480px-Anemone_at_Roatan.jpg",
    curiosidade: "Parece uma flor mas é um predador — usa tentáculos com células de veneno para paralisar presas.",
    bio: "As anêmonas-do-mar são animais parentes das medusas e dos corais. Seus tentáculos contêm células urticantes chamadas cnidócitos que disparam farpas venenosas ao toque. Vivem fixas às rochas e podem clonar-se para se reproduzir. Formam relações simbióticas com peixes-palhaço e camarões que vivem entre seus tentáculos."
  },
  {
    id: 33, nome: "Atum", tipo: "Peixe", profundidade: "0–1.000m", cor: "#2E4B8A",
    imagem: "🐟",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Atlantic_bluefin_tuna.jpg/480px-Atlantic_bluefin_tuna.jpg",
    curiosidade: "É de sangue quente — mantém o corpo mais quente que a água para nadar em alta velocidade.",
    bio: "O atum-azul é um dos peixes mais rápidos do oceano, atingindo 70 km/h. É um dos poucos peixes de sangue quente, usando o calor gerado pelos músculos para aumentar a eficiência dos olhos e do cérebro. Pode pesar mais de 600 kg e migrar através do Atlântico inteiro. É altamente ameaçado pela pesca excessiva."
  },
  {
    id: 34, nome: "Peixe-Bola", tipo: "Peixe", profundidade: "0–200m", cor: "#DAA520",
    imagem: "🐡",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Puffer_fish_02.jpg/480px-Puffer_fish_02.jpg",
    curiosidade: "Contém tetrodotoxina, veneno 1.200 vezes mais letal que o cianeto, e não há antídoto.",
    bio: "O peixe-bola infla ao engolir água rapidamente quando ameaçado, ficando até 3 vezes maior. Sua toxina, a tetrodotoxina, está concentrada no fígado, ovários e pele. Apesar disso, é uma iguaria no Japão (fugu), preparada apenas por chefs certificados. Possui dentes fundidos em bico que crescem continuamente."
  },
  {
    id: 35, nome: "Enguia-Elétrica-Marinha", tipo: "Peixe", profundidade: "0–100m", cor: "#556B2F",
    imagem: "〰️",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gymnothorax_javanicus_1.jpg/480px-Gymnothorax_javanicus_1.jpg",
    curiosidade: "A enguia-moréia possui uma segunda mandíbula dentro da garganta que avança para engolir presas.",
    bio: "A moréia é uma enguia marinha que habita fendas e cavidades nos recifes de coral. Abre e fecha a boca constantemente para bombear água pelas guelras, não para assustar. Possui visão fraca mas olfato aguçadíssimo. Cria relações inesperadas com camarões que limpam seus dentes e parasitas."
  },
]

const AnimalMarinho = ({ animal, onClick, isSelected }) => {
  return (
    <div
      className={`animal-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(animal)}
      style={{ borderColor: isSelected ? animal.cor : undefined, cursor: 'pointer' }}
    >
      <div style={{
        width: '100%', height: '110px', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden',
        background: `linear-gradient(135deg, ${animal.cor}22, ${animal.cor}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
      }}>
        <img
          src={animal.foto}
          alt={animal.nome}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
        />
        <div style={{
          display: 'none', position: 'absolute', inset: 0,
          alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem'
        }}>
          {animal.imagem}
        </div>
      </div>
      <h3>{animal.nome}</h3>
      <span className="animal-tipo">{animal.tipo}</span>
    </div>
  )
}

const DetalhesAnimal = ({ animal, onClose }) => {
  if (!animal) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ borderColor: `${animal.cor}55`, maxWidth: '560px', textAlign: 'left', padding: '0', overflow: 'hidden' }}
      >
        <button className="close-btn" onClick={onClose} style={{ zIndex: 10 }}>×</button>

        {/* Foto */}
        <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${animal.cor}33, ${animal.cor}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={animal.foto}
            alt={animal.nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
          <div style={{ display: 'none', fontSize: '6rem', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {animal.imagem}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, rgba(0,10,25,0.95))' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
            <h2 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.3px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{animal.nome}</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <span style={{ background: `${animal.cor}cc`, color: 'white', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700 }}>{animal.tipo}</span>
              <span style={{ background: 'rgba(0,212,255,0.25)', color: '#00d4ff', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(0,212,255,0.3)' }}>🌊 {animal.profundidade}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ color: '#00d4ff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Biografia</h3>
            <p style={{ color: 'rgba(220,240,250,0.85)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{animal.bio}</p>
          </div>
          <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', padding: '12px 16px', borderRadius: '12px' }}>
            <h3 style={{ color: '#00d4ff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Curiosidade</h3>
            <p style={{ color: 'rgba(200,230,240,0.8)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{animal.curiosidade}"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const FiltroEcossistema = ({ filtro, setFiltro }) => {
  const tipos = ['Todos', 'Peixe', 'Mamífero', 'Molusco', 'Crustáceo', 'Réptil', 'Cnidário', 'Equinodermo']

  return (
    <div className="filtro-container">
      <h3>Filtrar por tipo:</h3>
      <div className="filtro-buttons">
        {tipos.map(tipo => (
          <button
            key={tipo}
            className={`filtro-btn ${filtro === tipo ? 'active' : ''}`}
            onClick={() => setFiltro(tipo)}
          >
            {tipo}
          </button>
        ))}
      </div>
    </div>
  )
}

const CuriosidadesPage = () => {
  const [animalSelecionado, setAnimalSelecionado] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const navigate = useNavigate()

  const animaisFiltrados = filtro === 'Todos'
    ? ecosistemaData
    : ecosistemaData.filter(a => a.tipo === filtro)

  return (
    <div className="curiosidades-app">
      <button className="btn-voltar" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="ecosistema-container">
        <header className="ecosistema-header">
          <h1>Ecossistema Marinho</h1>
          <p>Explore {ecosistemaData.length} espécies da vida marinha</p>
        </header>

        <FiltroEcossistema filtro={filtro} setFiltro={setFiltro} />

        <div className="oceano-background">
          <div className="animais-grid">
            {animaisFiltrados.map(animal => (
              <AnimalMarinho
                key={animal.id}
                animal={animal}
                onClick={setAnimalSelecionado}
                isSelected={animalSelecionado?.id === animal.id}
              />
            ))}
          </div>
        </div>

        {animalSelecionado && (
          <DetalhesAnimal
            animal={animalSelecionado}
            onClose={() => setAnimalSelecionado(null)}
          />
        )}
      </div>
    </div>
  )
}

export default CuriosidadesPage
