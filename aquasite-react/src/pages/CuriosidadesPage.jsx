import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ============================================================
   DADOS: ANIMAIS
   ============================================================ */
const ecosistemaData = [
  { id: 1, nome: "Peixe-Palhaço", tipo: "Peixe", profundidade: "1–15m", cor: "#FF6347", imagem: "🐠", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Clownfish_Amphiprion_ocellaris.jpg/480px-Clownfish_Amphiprion_ocellaris.jpg", curiosidade: "Vive em simbiose com anêmonas-do-mar, sendo imune ao seu veneno paralisante.", bio: "O peixe-palhaço habita os recifes de coral do Oceano Índico e Pacífico. Ele vive em uma relação simbiótica com as anêmonas: o peixe limpa e protege a anêmona, enquanto ela oferece abrigo e segurança. Curiosamente, todos os peixe-palhaços nascem machos — o dominante pode mudar de sexo para fêmea quando necessário." },
  { id: 2, nome: "Peixe-Anjo", tipo: "Peixe", profundidade: "1–100m", cor: "#FF69B4", imagem: "🐡", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pomacanthus_imperator_-_melbourne_aquarium.jpg/480px-Pomacanthus_imperator_-_melbourne_aquarium.jpg", curiosidade: "Muda de cor, padrão e até de sexo conforme cresce.", bio: "Os peixes-anjo são reconhecidos pelos seus padrões vívidos de listras e manchas. Vivem nos recifes de coral tropicais e se alimentam de esponjas, algas e pequenos invertebrados. Possuem uma espinha aguçada perto da guelra que usam como defesa." },
  { id: 3, nome: "Peixe-Cirurgião", tipo: "Peixe", profundidade: "3–40m", cor: "#4169E1", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Paracanthurus_hepatus_%28Palette_surgeonfish%29.jpg/480px-Paracanthurus_hepatus_%28Palette_surgeonfish%29.jpg", curiosidade: "Possui uma espinha retrátil afiada na cauda, usada como bisturi para se defender.", bio: "Famoso pelo filme 'Procurando Dory', o peixe-cirurgião azul habita os recifes do Indo-Pacífico. Sua espinha caudal é tão afiada que lhe rendeu o nome 'cirurgião'. Alimenta-se principalmente de algas, sendo essencial para a saúde dos corais." },
  { id: 4, nome: "Peixe-Borboleta", tipo: "Peixe", profundidade: "1–30m", cor: "#FFD700", imagem: "🐠", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Chaetodon_lunula_1.jpg/480px-Chaetodon_lunula_1.jpg", curiosidade: "Possui uma mancha escura perto da cauda que parece um olho para confundir predadores.", bio: "Os peixes-borboleta são um dos grupos mais coloridos dos recifes de coral. Vivem em pares monógamos para toda a vida e defendem seu território com grande afinco. Sua dieta inclui pólipos de coral, algas e pequenos invertebrados." },
  { id: 5, nome: "Peixe-Papagaio", tipo: "Peixe", profundidade: "1–25m", cor: "#32CD32", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bullethead_parrotfish.jpg/480px-Bullethead_parrotfish.jpg", curiosidade: "Produz areia ao mastigar corais mortos, criando as areias brancas das praias tropicais.", bio: "O peixe-papagaio tem um bico resistente formado pela fusão dos dentes, semelhante ao bico de um papagaio. Ele raspa algas e corais mortos das rochas para se alimentar, produzindo toneladas de areia por ano. Algumas espécies criam um casulo de muco à noite para dormir." },
  { id: 6, nome: "Tubarão Branco", tipo: "Peixe", profundidade: "0–1.200m", cor: "#708090", imagem: "🦈", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/480px-White_shark.jpg", curiosidade: "Predador ápice com dentes que se renovam durante toda a vida — pode ter até 50.000 dentes.", bio: "O tubarão branco é o maior peixe predador do planeta, podendo atingir 6 metros e 2 toneladas. Detecta sangue a quilômetros de distância graças a órgãos sensoriais chamados ampolas de Lorenzini. Apesar da fama aterrorizante, ataques a humanos são raros e geralmente um erro de identificação." },
  { id: 7, nome: "Tubarão-Martelo", tipo: "Peixe", profundidade: "1–80m", cor: "#696969", imagem: "🦈", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Sphyrna_lewini_bahamas.jpg/480px-Sphyrna_lewini_bahamas.jpg", curiosidade: "Sua cabeça em formato de martelo aumenta o campo visual e a detecção de campos elétricos.", bio: "O tubarão-martelo é facilmente reconhecível pela sua cabeça achatada e alargada, chamada cefalofoil. Vive em cardumes durante o dia e caça sozinho à noite. Alimenta-se de peixes, lulas e raias, sendo capaz de detectar as correntes elétricas das presas enterradas na areia." },
  { id: 8, nome: "Tubarão-Baleia", tipo: "Peixe", profundidade: "0–700m", cor: "#4682B4", imagem: "🦈", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Whale_shark_Georgia_aquarium.jpg/480px-Whale_shark_Georgia_aquarium.jpg", curiosidade: "O maior peixe do mundo, com até 12 metros, mas se alimenta apenas de plâncton e krill.", bio: "Apesar do nome intimidante, o tubarão-baleia é completamente inofensivo. Filtra grandes volumes de água com sua enorme boca para capturar microorganismos. Pode viver mais de 100 anos e nada lentamente percorrendo longas distâncias pelos oceanos tropicais." },
  { id: 9, nome: "Arraia-Manta", tipo: "Peixe", profundidade: "0–120m", cor: "#000080", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Manta_birostris-Thailand4.jpg/480px-Manta_birostris-Thailand4.jpg", curiosidade: "Possui o maior cérebro entre os peixes e pode ter envergadura de até 9 metros.", bio: "A arraia-manta gigante é um dos animais marinhos mais elegantes. Filtra plâncton com a boca aberta enquanto nada graciosamente. São animais curiosos e frequentemente se aproximam de mergulhadores. Vivem em torno de 40 anos e dão à luz apenas um filhote por vez." },
  { id: 10, nome: "Cavalo-Marinho", tipo: "Peixe", profundidade: "0–30m", cor: "#F0E68C", imagem: "🐴", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Hippocampus_kuda_%28Spotted_seahorse%29.jpg/480px-Hippocampus_kuda_%28Spotted_seahorse%29.jpg", curiosidade: "É o único animal do mundo em que o macho engravida e dá à luz.", bio: "O cavalo-marinho é um peixe que nada na vertical, usando uma pequena barbatana dorsal. Não possui estômago — a comida passa tão rápido que precisam comer constantemente. Os casais formam laços monógamos e se cumprimentam dançando juntos ao amanhecer." },
  { id: 11, nome: "Baleia Azul", tipo: "Mamífero", profundidade: "0–200m", cor: "#4A90E2", imagem: "🐋", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Humpback_Whale_underwater_shot.jpg/480px-Humpback_Whale_underwater_shot.jpg", curiosidade: "O maior animal que já existiu na Terra, com até 30 metros e 180 toneladas.", bio: "A baleia azul é o maior ser vivo conhecido. Seu coração pesa cerca de 600 kg, e seus chamados podem ser ouvidos a centenas de quilômetros de distância. Alimenta-se exclusivamente de krill e pode consumir 4 toneladas por dia durante o verão." },
  { id: 12, nome: "Golfinho", tipo: "Mamífero", profundidade: "0–300m", cor: "#00CED1", imagem: "🐬", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/480px-Tursiops_truncatus_01.jpg", curiosidade: "Usa ecolocalização para navegar e caçar, emitindo sons que mapeiam o ambiente.", bio: "Os golfinhos são considerados uns dos animais mais inteligentes do planeta. Vivem em grupos sociais complexos e possuem nomes individuais. Dormem com metade do cérebro por vez, mantendo a outra metade acordada para respirar." },
  { id: 13, nome: "Orca", tipo: "Mamífero", profundidade: "0–200m", cor: "#1a1a2e", imagem: "🐋", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Killerwhales_jumping.jpg/480px-Killerwhales_jumping.jpg", curiosidade: "Na verdade é o maior membro da família dos golfinhos, não uma baleia.", bio: "As orcas são predadores ápice dos oceanos, capazes de caçar tubarões-brancos e baleias. Vivem em grupos familiares matriarcais com linguagem e técnicas de caça próprias de cada grupo. São os mamíferos marinhos com maior distribuição geográfica do planeta." },
  { id: 14, nome: "Polvo Gigante", tipo: "Molusco", profundidade: "200–2.000m", cor: "#8B4513", imagem: "🐙", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Octopus_vulgaris_-_Merculiano.jpg/480px-Octopus_vulgaris_-_Merculiano.jpg", curiosidade: "Possui 3 corações, sangue azul, 8 braços com 240 ventosas cada e mini-cérebros nos tentáculos.", bio: "O polvo é considerado o invertebrado mais inteligente do mundo. Pode abrir potes, aprender com experiências e usar ferramentas. Sua habilidade de mudar de cor e textura em milissegundos é usada tanto para camuflagem quanto para comunicação. Vive apenas 1 a 2 anos." },
  { id: 15, nome: "Lula Gigante", tipo: "Molusco", profundidade: "300–2.000m", cor: "#800080", imagem: "🦑", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Giant_squid_melb_museum.jpg/480px-Giant_squid_melb_museum.jpg", curiosidade: "Possui os maiores olhos do reino animal — podem chegar a 30 cm de diâmetro.", bio: "A lula gigante pode atingir até 13 metros de comprimento e habita as profundezas oceânicas. É a principal presa do cachalote. Seus olhos enormes captam a mínima quantidade de luz no fundo escuro do oceano." },
  { id: 16, nome: "Caranguejo", tipo: "Crustáceo", profundidade: "0–4.000m", cor: "#DC143C", imagem: "🦀", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Signal_crayfish.jpg/480px-Signal_crayfish.jpg", curiosidade: "Caminha de lado e pode regenerar completamente garras e pernas perdidas.", bio: "Os caranguejos existem há mais de 200 milhões de anos e habitam desde praias rasas até fossas oceânicas. Possuem exoesqueleto rígido que trocam periodicamente. São onívoros e cumprem papel vital nos ecossistemas como limpadores de fundo." },
  { id: 17, nome: "Lagosta", tipo: "Crustáceo", profundidade: "4–480m", cor: "#B22222", imagem: "🦞", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rock_Lobster.jpg/480px-Rock_Lobster.jpg", curiosidade: "Pode viver mais de 100 anos e continuar crescendo ao longo de toda a vida.", bio: "As lagostas são biologicamente imortais no sentido de que não mostram sinais de envelhecimento. Possuem sangue azul rico em cobre. Antes de serem consideradas uma iguaria, eram alimento de pobres e prisioneiros." },
  { id: 18, nome: "Tartaruga Marinha", tipo: "Réptil", profundidade: "0–1.000m", cor: "#228B22", imagem: "🐢", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Chelonia_mydas_is_going_up.jpg/480px-Chelonia_mydas_is_going_up.jpg", curiosidade: "Usa o campo magnético terrestre para navegar e retorna à praia onde nasceu para desovar.", bio: "As tartarugas marinhas existem há mais de 100 milhões de anos, sobrevivendo aos dinossauros. Passam a maior parte da vida no oceano, mas as fêmeas retornam às praias para desovar. Algumas espécies percorrem mais de 2.000 km em migrações." },
  { id: 19, nome: "Água-Viva", tipo: "Cnidário", profundidade: "0–4.000m", cor: "#DDA0DD", imagem: "🪼", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jelly_cc11.jpg/480px-Jelly_cc11.jpg", curiosidade: "Existe há 500 milhões de anos — e uma espécie é biologicamente imortal.", bio: "As águas-vivas não possuem cérebro, coração, ossos ou sangue. São compostas por 95% de água. A espécie Turritopsis dohrnii pode reverter ao estágio juvenil após atingir a maturidade, tornando-se potencialmente imortal." },
  { id: 20, nome: "Estrela-do-Mar", tipo: "Equinodermo", profundidade: "0–6.000m", cor: "#FF8C00", imagem: "⭐", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Sea_star_Fromia_monilis.jpg/480px-Sea_star_Fromia_monilis.jpg", curiosidade: "Não tem cérebro nem sangue — usa água do mar para movimentar seus braços.", bio: "As estrelas-do-mar podem ter de 5 a 40 braços e regenerá-los completamente se perdidos. Possuem um estômago que expelem para fora do corpo para digerir presas maiores. Existem mais de 2.000 espécies, encontradas em todos os oceanos." },
  { id: 21, nome: "Baleia Jubarte", tipo: "Mamífero", profundidade: "0–200m", cor: "#2F4F8F", imagem: "🐋", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Humpback_Whale_underwater_shot.jpg/480px-Humpback_Whale_underwater_shot.jpg", curiosidade: "Os machos cantam músicas complexas que evoluem ao longo do tempo, como tendências musicais.", bio: "A baleia jubarte é famosa pelos seus saltos espetaculares fora d'água. Realiza migrações de até 25.000 km por ano. Suas nadadeiras peitorais podem medir 5 metros. Sua população se recuperou após quase ser extinta pela caça no século XX." },
  { id: 22, nome: "Narval", tipo: "Mamífero", profundidade: "0–1.500m", cor: "#6A5ACD", imagem: "🦄", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Narwal_2.jpg/480px-Narwal_2.jpg", curiosidade: "Seu longo 'chifre' é na verdade um dente em espiral com até 3 metros, cheio de terminações nervosas.", bio: "Apelidado de 'unicórnio do mar', o narval habita os mares árticos. Seu dente espiral é usado para detectar mudanças de temperatura e pressão. Vivem em grupos e usam ecolocalização para navegar sob o gelo." },
  { id: 23, nome: "Beluga", tipo: "Mamífero", profundidade: "0–700m", cor: "#E8E8E8", imagem: "🐳", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Delphinapterus_leucas_2_%28Marianne_Goulet%29.jpg/480px-Delphinapterus_leucas_2_%28Marianne_Goulet%29.jpg", curiosidade: "Chamada de 'canário do mar' pela variedade de sons — e pode virar a cabeça completamente.", bio: "A baleia beluga não possui nadadeira dorsal, o que a ajuda a nadar sob blocos de gelo. É extremamente sociável e vocal, capaz de imitar sons. Nascem cinzas e vão clareando até atingirem o branco puro na idade adulta." },
  { id: 24, nome: "Dugongo", tipo: "Mamífero", profundidade: "0–37m", cor: "#8B7355", imagem: "🐄", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Dugong_Marsa_Alam.jpg/480px-Dugong_Marsa_Alam.jpg", curiosidade: "É o único mamífero marinho herbívoro e teria inspirado as lendas das sereias.", bio: "O dugongo é parente do elefante. Alimenta-se exclusivamente de ervas marinhas, podendo comer 40 kg por dia. Vive em torno de 70 anos. Está ameaçado de extinção por destruição de habitat e colisões com embarcações." },
  { id: 25, nome: "Foca-Leopardo", tipo: "Mamífero", profundidade: "0–600m", cor: "#708090", imagem: "🦭", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Leopard_seal_%28Hydrurga_leptonyx%29.jpg/480px-Leopard_seal_%28Hydrurga_leptonyx%29.jpg", curiosidade: "Predadora feroz que caça pinguins com habilidade, mas é brincalhona com humanos.", bio: "A foca-leopardo é um dos maiores predadores da Antártida. Possui mandíbulas excepcionalmente grandes e dentes afiados. Há registros de focas-leopardo oferecendo pinguins vivos a fotógrafos como 'presente'." },
  { id: 26, nome: "Peixe-Espada", tipo: "Peixe", profundidade: "0–800m", cor: "#4169E1", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Xiphias_gladius1.jpg/480px-Xiphias_gladius1.jpg", curiosidade: "Atinge até 100 km/h e pode aquecer seus próprios olhos para melhorar a visão na caça.", bio: "O peixe-espada consegue aquecer seus olhos e cérebro acima da temperatura do oceano, melhorando a visão. Usa seu longo rostro para atordoar cardumes de peixes. É um caçador solitário que migra entre águas quentes e frias." },
  { id: 27, nome: "Camarão-Mantis", tipo: "Crustáceo", profundidade: "3–40m", cor: "#FF4500", imagem: "🦐", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Odontodactylus_scyllarus.jpg/480px-Odontodactylus_scyllarus.jpg", curiosidade: "Seu golpe é tão rápido quanto uma bala de pistola e pode quebrar vidro de aquário.", bio: "O camarão-mantis golpeia a 80 km/h, gerando calor e luz por cavitação. Possui 16 tipos de fotorreceptores nos olhos — humanos têm apenas 3. Forma casais monógamos para toda a vida." },
  { id: 28, nome: "Peixe-Lanterna", tipo: "Peixe", profundidade: "200–1.000m", cor: "#191970", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Myctophum_punctatum.jpg/480px-Myctophum_punctatum.jpg", curiosidade: "Realiza a maior migração vertical diária do planeta, subindo à superfície toda noite.", bio: "Os peixes-lanterna possuem órgãos luminosos (fotóforos) ao longo do corpo. Vivem nas zonas mesopelágicas durante o dia e sobem à superfície à noite para se alimentar, em uma das maiores migrações em massa do planeta." },
  { id: 29, nome: "Pepino-do-Mar", tipo: "Equinodermo", profundidade: "0–10.900m", cor: "#8B6914", imagem: "🥒", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Holothuria_atra.jpg/480px-Holothuria_atra.jpg", curiosidade: "Quando ameaçado, expele seus próprios órgãos internos — e consegue regenerá-los completamente.", bio: "O pepino-do-mar pode liquefazer seu corpo para escorregar por fendas estreitas. É o 'adubo' do fundo do mar, reciclando sedimentos e nutrientes. Algumas espécies abrigam peixes minúsculos dentro do próprio corpo." },
  { id: 30, nome: "Ouriço-do-Mar", tipo: "Equinodermo", profundidade: "0–5.000m", cor: "#8B0000", imagem: "🔴", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Strongylocentrotus_droebachiensis.jpg/480px-Strongylocentrotus_droebachiensis.jpg", curiosidade: "Seus espinhos podem crescer novamente e usa-os para se locomover pelo fundo do mar.", bio: "O ouriço-do-mar possui uma boca com 5 dentes chamada Lanterna de Aristóteles. Alimenta-se de algas, controlando o crescimento excessivo nos recifes. Pode viver mais de 200 anos." },
  { id: 31, nome: "Coral", tipo: "Cnidário", profundidade: "0–300m", cor: "#FF7F50", imagem: "🪸", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Coral_reef_at_palmyra.jpg/480px-Coral_reef_at_palmyra.jpg", curiosidade: "Parece uma planta mas é um animal colonial — cada 'ramo' é formado por milhares de pequenos pólipos.", bio: "Os corais constroem os recifes que cobrem menos de 1% do fundo oceânico, mas abrigam 25% de todas as espécies marinhas. O branqueamento dos corais ocorre quando o aquecimento das águas expulsa as algas simbióticas." },
  { id: 32, nome: "Anêmona-do-Mar", tipo: "Cnidário", profundidade: "0–50m", cor: "#FF1493", imagem: "🌸", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Anemone_at_Roatan.jpg/480px-Anemone_at_Roatan.jpg", curiosidade: "Parece uma flor mas é um predador — usa tentáculos com células de veneno para paralisar presas.", bio: "As anêmonas-do-mar são animais parentes das medusas e dos corais. Seus tentáculos contêm células urticantes que disparam farpas venenosas ao toque. Formam relações simbióticas com peixes-palhaço e camarões." },
  { id: 33, nome: "Atum", tipo: "Peixe", profundidade: "0–1.000m", cor: "#2E4B8A", imagem: "🐟", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Atlantic_bluefin_tuna.jpg/480px-Atlantic_bluefin_tuna.jpg", curiosidade: "É de sangue quente — mantém o corpo mais quente que a água para nadar em alta velocidade.", bio: "O atum-azul atinge 70 km/h e é um dos poucos peixes de sangue quente. Pode pesar mais de 600 kg e migrar através do Atlântico inteiro. É altamente ameaçado pela pesca excessiva." },
  { id: 34, nome: "Peixe-Bola", tipo: "Peixe", profundidade: "0–200m", cor: "#DAA520", imagem: "🐡", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Puffer_fish_02.jpg/480px-Puffer_fish_02.jpg", curiosidade: "Contém tetrodotoxina, veneno 1.200 vezes mais letal que o cianeto, sem antídoto.", bio: "O peixe-bola infla ao engolir água rapidamente quando ameaçado, ficando até 3 vezes maior. É uma iguaria no Japão (fugu), preparada apenas por chefs certificados. Possui dentes fundidos em bico que crescem continuamente." },
  { id: 35, nome: "Moréia", tipo: "Peixe", profundidade: "0–100m", cor: "#556B2F", imagem: "〰️", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gymnothorax_javanicus_1.jpg/480px-Gymnothorax_javanicus_1.jpg", curiosidade: "Possui uma segunda mandíbula dentro da garganta que avança para engolir presas.", bio: "A moréia habita fendas e cavidades nos recifes de coral. Abre e fecha a boca constantemente para bombear água pelas guelras, não para assustar. Cria relações inesperadas com camarões que limpam seus dentes e parasitas." },
]

/* ============================================================
   DADOS: OCEANO
   ============================================================ */
const oceanoData = [
  {
    id: 1, titulo: "80% dos Oceanos Nunca Foram Explorados", icone: "🔭", cor: "#1a6fa8",
    destaque: "Maior mistério da Terra",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg",
    descricao: "Conhecemos mais sobre a superfície da Lua e de Marte do que sobre o fundo dos nossos próprios oceanos. As profundezas marinhas são o ambiente mais inexplorado do planeta — lá podem existir espécies completamente desconhecidas pela ciência. Apenas cerca de 20% do leito oceânico foi mapeado com algum detalhe.",
    curiosidade: "Sabemos mais sobre a superfície de Marte do que sobre o fundo dos nossos oceanos."
  },
  {
    id: 2, titulo: "A Fossa das Marianas — O Ponto Mais Profundo", icone: "📏", cor: "#0a3f6b",
    destaque: "11.034 metros de profundidade",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mariana_trench_profile.jpg/480px-Mariana_trench_profile.jpg",
    descricao: "A Fossa das Marianas, no Oceano Pacífico, é o ponto mais profundo da Terra com 11.034 metros. Se o Monte Everest fosse colocado lá dentro, ainda sobraria mais de 2 km de água acima de seu pico. A pressão no fundo é 1.000 vezes maior do que ao nível do mar, mas mesmo assim existem formas de vida.",
    curiosidade: "O Monte Everest caberia inteiro na Fossa das Marianas e ainda sobraria 2 km de água acima."
  },
  {
    id: 3, titulo: "O Oceano Produz 50% do Oxigênio da Terra", icone: "🌿", cor: "#1a7a4a",
    destaque: "Mais que todas as florestas juntas",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Coral_reef_at_palmyra.jpg/480px-Coral_reef_at_palmyra.jpg",
    descricao: "Metade do oxigênio que respiramos vem do mar — produzido pelo fitoplâncton, microalgas microscópicas que vivem na superfície do oceano. Uma única espécie, a Prochlorococcus, é responsável por 20% de todo o oxigênio da Terra. O oceano é, literalmente, o pulmão do planeta.",
    curiosidade: "Um microorganismo invisível a olho nu, a Prochlorococcus, produz 20% de todo o oxigênio da Terra."
  },
  {
    id: 4, titulo: "Bioluminescência — O Mar que Brilha no Escuro", icone: "✨", cor: "#0d4f7a",
    destaque: "76% das espécies marinhas emitem luz",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bioluminescent_dinoflagellates.jpg/480px-Bioluminescent_dinoflagellates.jpg",
    descricao: "Nas profundezas oceânicas onde a luz do sol não chega, os seres vivos criam a própria luz através de reações químicas — a bioluminescência. Mais de 76% das espécies que vivem abaixo dos 600 metros são bioluminescentes. Algumas algas (dinoflagelados) iluminam as ondas com um brilho azul mágico quando perturbadas.",
    curiosidade: "Nas profundezas do oceano, bioluminescência é a norma — 76% das espécies produzem luz própria."
  },
  {
    id: 5, titulo: "Fontes Hidrotermais — Vida Sem Luz Solar", icone: "🌋", cor: "#8B1A1A",
    destaque: "Temperatura de até 400°C",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Blacksmoker_in_atlantic_ocean.jpg/480px-Blacksmoker_in_atlantic_ocean.jpg",
    descricao: "No fundo do oceano existem 'fumantes negros' — chaminés vulcânicas que expelem água a até 400°C repleta de minerais. Em torno delas floresce uma vida incrível: tubeworms de 2 metros, caranguejos-yeti e bactérias que não dependem do sol, mas de enxofre químico para sobreviver. Isso mudou a nossa visão sobre onde a vida pode existir.",
    curiosidade: "Os ecossistemas das fontes hidrotermais não dependem do Sol — vivem de energia química, não de fotossíntese."
  },
  {
    id: 6, titulo: "As Marés São Controladas pela Lua", icone: "🌙", cor: "#3a3a6b",
    destaque: "A Lua puxa 321 milhões de km³ de água",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Thermohaline_Circulation_2.png/480px-Thermohaline_Circulation_2.png",
    descricao: "A gravidade da Lua puxa as águas dos oceanos, criando as marés. O lado da Terra mais próximo da Lua é 'puxado' formando um inchaço de água — a maré alta. O ciclo de marés altas e baixas acontece aproximadamente duas vezes por dia. O Sol também influencia, e quando Lua e Sol se alinham, as marés de sizígia são as mais extremas.",
    curiosidade: "A diferença entre maré alta e baixa na Baía de Fundy, no Canadá, pode chegar a 16 metros — a maior do mundo."
  },
  {
    id: 7, titulo: "Correntes Oceânicas — o Sangue da Terra", icone: "🌀", cor: "#1a5276",
    destaque: "Uma corrente completa o ciclo em 1.000 anos",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Thermohaline_Circulation_2.png/480px-Thermohaline_Circulation_2.png",
    descricao: "As correntes oceânicas são rios dentro do mar, movidos por diferenças de temperatura e salinidade. A Corrente do Golfo, por exemplo, transporta mais água do que todos os rios do mundo juntos e mantém a Europa aquecida. O colapso dessas correntes, acelerado pelas mudanças climáticas, poderia causar resfriamento abrupto em partes do planeta.",
    curiosidade: "A Corrente do Golfo transporta mais água do que todos os rios do planeta Terra reunidos."
  },
  {
    id: 8, titulo: "O Oceano Absorve 30% do CO₂ da Atmosfera", icone: "🌍", cor: "#1e6b44",
    destaque: "Nosso maior aliado climático",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg",
    descricao: "O oceano age como um imenso amortecedor climático, absorvendo cerca de 30% do dióxido de carbono que emitimos e mais de 90% do calor extra gerado pelo aquecimento global. Sem essa função, as temperaturas na Terra seriam muito mais altas. No entanto, o excesso de CO₂ acidifica a água, ameaçando corais e outros organismos com conchas calcárias.",
    curiosidade: "O oceano já aqueceu 0,6°C desde a revolução industrial — parece pouco, mas representa energia colossal."
  },
  {
    id: 9, titulo: "Som Viaja 4x Mais Rápido na Água", icone: "🔊", cor: "#4a1a8b",
    destaque: "1.480 m/s na água vs 343 m/s no ar",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/480px-Tursiops_truncatus_01.jpg",
    descricao: "A água é muito mais densa que o ar, o que faz o som se propagar nela quatro vezes mais rápido. Baleias se aproveitam disso: seus cantos podem ser ouvidos a centenas de quilômetros de distância no oceano. O exército usa esse princípio no SONAR para detectar submarinos. Ruídos de navios e sonar militar perturbam gravemente a orientação de baleias e golfinhos.",
    curiosidade: "O canto de uma baleia azul pode ser ouvido a mais de 1.600 km de distância no oceano."
  },
  {
    id: 10, titulo: "O Oceano Como Maior Museu do Mundo", icone: "🏺", cor: "#7a5a1a",
    destaque: "+3 milhões de naufrágios no fundo do mar",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Whale_shark_Georgia_aquarium.jpg/480px-Whale_shark_Georgia_aquarium.jpg",
    descricao: "Estima-se que existam mais de 3 milhões de naufrágios no fundo dos oceanos, contendo tesouros históricos, artefatos e registros de civilizações antigas. Os oceanos preservam esses objetos melhor do que qualquer museu — a água fria e escura retarda a decomposição. O Titanic, afundado em 1912, ainda guarda cartas, sapatos e louças intactas.",
    curiosidade: "Existem mais artefatos históricos no fundo do oceano do que em todos os museus do mundo juntos."
  },
  {
    id: 11, titulo: "97% da Água da Terra Está nos Oceanos", icone: "💧", cor: "#0055aa",
    destaque: "1,335 bilhão de km³ de água salgada",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg",
    descricao: "Os oceanos contêm aproximadamente 97% de toda a água da Terra. Se toda essa água fosse distribuída igualmente pela superfície do planeta, formaria uma camada de 2,7 km de profundidade. Apenas 3% é água doce, e a maior parte dessa ínfima parcela está congelada nas calotas polares e geleiras — menos de 1% está disponível para consumo humano.",
    curiosidade: "Se derretessem todos os glaciares e calotas polares, o nível do mar subiria 70 metros, inundando a maioria das cidades costeiras."
  },
  {
    id: 12, titulo: "A Grande Barreira de Coral — Visível do Espaço", icone: "🪸", cor: "#c04000",
    destaque: "2.300 km de extensão",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Coral_reef_at_palmyra.jpg/480px-Coral_reef_at_palmyra.jpg",
    descricao: "A Grande Barreira de Coral, na costa nordeste da Austrália, é a maior estrutura viva do planeta e pode ser vista do espaço. Abriga mais de 1.500 espécies de peixes, 4.000 tipos de moluscos e 240 espécies de pássaros. No entanto, desde 1995 perdeu metade de seus corais devido ao aquecimento das águas — é considerada em situação crítica.",
    curiosidade: "A Grande Barreira de Coral abriga mais biodiversidade do que toda a floresta tropical europeia."
  },
]

/* ============================================================
   DADOS: PRAIAS
   ============================================================ */
const praiaData = [
  {
    id: 1, titulo: "Praias de Areia Preta", icone: "⚫", cor: "#2a2a2a",
    destaque: "Origem vulcânica",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Punaluu_black_sand_beach.jpg/480px-Punaluu_black_sand_beach.jpg",
    descricao: "As praias de areia preta são formadas pela erosão de rochas basálticas vulcânicas. Quando a lava quente encontra o oceano, esfria rapidamente e se fragmenta em areia escura. As mais famosas ficam no Havaí (Punalu'u), Islândia e nas Ilhas Canárias. A areia preta absorve muito mais calor que a branca, ficando extremamente quente ao sol.",
    curiosidade: "A areia preta do Havaí é recente em termos geológicos — ainda está sendo criada por erupções ativas."
  },
  {
    id: 2, titulo: "Praias de Areia Rosa", icone: "🌸", cor: "#e75480",
    destaque: "Cor vem de fragmentos de corais",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pink_Sand_Beach_at_Harbour_Island.jpg/480px-Pink_Sand_Beach_at_Harbour_Island.jpg",
    descricao: "As praias de areia rosa devem sua cor romântica a fragmentos de foraminíferos — microscópicas criaturas marinhas com conchas de cor vermelha/rosada que se misturam à areia branca. As mais famosas ficam em Harbour Island nas Bahamas e em Elafonissi, na Grécia. A intensidade da cor varia com as estações.",
    curiosidade: "A areia rosa é composta por bilhões de conchas microscópicas de criaturas unicelulares chamadas foraminíferos."
  },
  {
    id: 3, titulo: "Praias de Areia Verde", icone: "💚", cor: "#2d6a4f",
    destaque: "Mineral olivina compõe a areia",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Papakolea_Green_Sand_Beach.jpg/480px-Papakolea_Green_Sand_Beach.jpg",
    descricao: "As raríssimas praias de areia verde existem em apenas 4 lugares no mundo. A mais famosa é Papakolea, no Havaí, formada por cristais do mineral olivina — verde em razão do ferro e magnésio — provenientes de antigas erupções vulcânicas. No Equador, a Praia de Punta Cormorant em Galápagos também tem este tom único.",
    curiosidade: "A Praia Papakolea, no Havaí, é uma das apenas 4 praias de areia verde do mundo inteiro."
  },
  {
    id: 4, titulo: "Praias Bioluminescentes", icone: "💙", cor: "#003580",
    destaque: "O mar que brilha azul à noite",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bioluminescent_dinoflagellates.jpg/480px-Bioluminescent_dinoflagellates.jpg",
    descricao: "Algumas praias do mundo ficam cobertas por um brilho azul mágico à noite, causado por bilhões de dinoflagelados bioluminescentes — algas microscópicas que emitem luz quando perturbadas pelo movimento das ondas ou pisadas na areia molhada. As mais famosas ficam nas Maldivas (Vaadhoo), em Porto Rico e em algumas praias de Santa Catarina, no Brasil.",
    curiosidade: "Praias bioluminescentes do Brasil existem! Santa Catarina tem ocorrências registradas deste fenômeno natural."
  },
  {
    id: 5, titulo: "A Praia Mais Longa do Mundo é no Brasil", icone: "🇧🇷", cor: "#009c3b",
    destaque: "254 km ininterruptos",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Beach_%281%29.jpg/480px-Beach_%281%29.jpg",
    descricao: "A Praia do Cassino, no Rio Grande do Sul, é considerada a praia mais longa do mundo com aproximadamente 254 km de extensão contínua. Fica na cidade de Rio Grande e se estende até o Uruguai. É uma praia oceânica de água fria com dunas e lagoas. Segundo o Guinness Book, é oficialmente a maior praia do planeta.",
    curiosidade: "O Brasil tem a praia mais longa do mundo: a Praia do Cassino, no Rio Grande do Sul, com 254 km."
  },
  {
    id: 6, titulo: "Glass Beach — A Praia de Vidro", icone: "💎", cor: "#3a7ca5",
    destaque: "Lixo transformado em beleza",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Glass_Beach_Fort_Bragg.jpg/480px-Glass_Beach_Fort_Bragg.jpg",
    descricao: "A Glass Beach em Fort Bragg, Califórnia, foi durante décadas um aterro municipal onde toda sorte de lixo era jogada ao mar. Com o tempo, as ondas quebraram e poleram os pedaços de vidro e cerâmica até virarem pequenas pedras coloridas e translúcidas. Hoje é uma das praias mais fotografadas dos Estados Unidos e uma lição sobre como a natureza transforma o que destruímos.",
    curiosidade: "A Glass Beach foi um lixão por 60 anos — as ondas levaram décadas para transformar cacos de vidro em joias."
  },
  {
    id: 7, titulo: "Correntes de Retorno — O Perigo Invisível", icone: "⚠️", cor: "#c0392b",
    destaque: "Responsável por 80% dos resgates",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Rip_current_warning_sign.jpg/480px-Rip_current_warning_sign.jpg",
    descricao: "As correntes de retorno (rip currents) são canais estreitos de água que fluem rapidamente para o mar, formados quando as ondas acumulam água perto da praia e ela precisa escapar. São responsáveis por mais de 80% dos resgates de salva-vidas no mundo. O erro mais comum é nadar contra a corrente. O certo é nadar paralelo à praia até sair do canal.",
    curiosidade: "Se preso em uma corrente de retorno, nunca nade de volta para a praia — nade paralelo à costa para escapar."
  },
  {
    id: 8, titulo: "Areias que Cantam", icone: "🎵", cor: "#d4a017",
    destaque: "Barkhanas que produzem sons",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Singing_sands_dune.jpg/480px-Singing_sands_dune.jpg",
    descricao: "Algumas praias e dunas ao redor do mundo produzem sons estranhos — rangidos, zumbidos ou até melodias — quando a areia é perturbada. O fenômeno ocorre quando grãos de areia de tamanho e forma uniformes vibram em sincronia ao deslizar uns sobre os outros. As praias cantantes mais famosas ficam na Escócia (Singing Sands), no Havaí e na costa da Austrália.",
    curiosidade: "A areia de certas praias emite sons audíveis quando pisada ou tocada — como se o chão cantasse."
  },
  {
    id: 9, titulo: "Falésias e Como se Formam", icone: "🏔️", cor: "#8B6914",
    destaque: "Erosão de milhares de anos",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Seven_Sisters_from_Seaford_Head.jpg/480px-Seven_Sisters_from_Seaford_Head.jpg",
    descricao: "As falésias são formadas pela erosão contínua das ondas nas rochas costeiras. A água penetra nas fissuras da rocha, comprime o ar ali dentro e vai quebrando o material progressivamente. As famosas Falésias de Dover, na Inglaterra, perdem cerca de 1 cm por ano. No Brasil, as falésias coloridas de Morro Branco, no Ceará, têm camadas de diferentes cores e idades geológicas.",
    curiosidade: "As falésias de Morro Branco (CE) têm camadas com mais de 100 milhões de anos de história geológica."
  },
  {
    id: 10, titulo: "A Areia é um Arquivo do Tempo", icone: "⏳", cor: "#a0522d",
    destaque: "Cada grão tem história própria",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Beach_%281%29.jpg/480px-Beach_%281%29.jpg",
    descricao: "A areia de praia não é apenas areia — é um arquivo geológico de milhões de anos. Cada grão conta uma história: veio de montanhas erodidas por rios, de corais quebrados pelas ondas, de conchas de criaturas extintas ou de rochas vulcânicas. A composição da areia revela o passado geológico da região. Alguns grãos de areia viajaram centenas de quilômetros antes de chegar à praia.",
    curiosidade: "Há mais grãos de areia nas praias do que estrelas no universo observável — estimados em 7,5 quintilhões."
  },
  {
    id: 11, titulo: "Tsunamis — Ondas que Cruzam Oceanos", icone: "🌊", cor: "#0a3f6b",
    destaque: "Velocidade de um avião a jato",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/2004-tsunami.jpg/480px-2004-tsunami.jpg",
    descricao: "Tsunamis são ondas geradas por terremotos, erupções vulcânicas ou deslizamentos submarinos. No oceano aberto, uma onda de tsunami pode ter apenas 30 cm de altura, mas percorre o oceano a 800 km/h — a velocidade de um avião. Ao se aproximar da costa, a onda desacelera mas sua altura pode chegar a 30 metros ou mais. O maior tsunami registrado aconteceu no Alasca em 1958 com 524 metros de altura.",
    curiosidade: "O maior tsunami da história atingiu 524 metros de altura — mais alto que o Empire State Building."
  },
  {
    id: 12, titulo: "Por Que o Mar é Salgado?", icone: "🧂", cor: "#1a5276",
    destaque: "3,5% de sal em média",
    foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg",
    descricao: "O sal dos oceanos vem principalmente de dois processos: chuva levemente ácida que dissolve minerais das rochas e os rios os carregam ao mar; e fontes hidrotermais no fundo do oceano que liberam minerais. Ao longo de bilhões de anos, o sal foi se acumulando — a água evapora, mas o sal fica. Se o oceano secasse, a camada de sal teria cerca de 45 metros de espessura.",
    curiosidade: "Se o oceano secasse completamente, a camada de sal teria 45 metros — suficiente para cobrir prédios de 15 andares."
  },
]

/* ============================================================
   COMPONENTES
   ============================================================ */
const AnimalMarinho = ({ animal, onClick, isSelected }) => (
  <div
    className={`animal-card ${isSelected ? 'selected' : ''}`}
    onClick={() => onClick(animal)}
    style={{ borderColor: isSelected ? animal.cor : undefined, cursor: 'pointer' }}
  >
    <div style={{ width: '100%', height: '110px', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden', background: `linear-gradient(135deg, ${animal.cor}22, ${animal.cor}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <img src={animal.foto} alt={animal.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
      <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>{animal.imagem}</div>
    </div>
    <h3>{animal.nome}</h3>
    <span className="animal-tipo">{animal.tipo}</span>
  </div>
)

const CuriosidadeCard = ({ item, onClick }) => (
  <div
    className="animal-card"
    onClick={() => onClick(item)}
    style={{ cursor: 'pointer' }}
  >
    <div style={{ width: '100%', height: '120px', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden', background: `linear-gradient(135deg, ${item.cor}33, ${item.cor}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <img src={item.foto} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
      <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{item.icone}</div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,10,25,0.75))', borderRadius: '10px' }} />
    </div>
    <h3 style={{ fontSize: '0.85rem', lineHeight: 1.35, marginBottom: '6px' }}>{item.titulo}</h3>
    <span className="animal-tipo">{item.destaque}</span>
  </div>
)

const DetalhesAnimal = ({ animal, onClose }) => {
  if (!animal) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderColor: `${animal.cor}55`, maxWidth: '560px', textAlign: 'left', padding: '0', overflow: 'hidden' }}>
        <button className="close-btn" onClick={onClose} style={{ zIndex: 10 }}>×</button>
        <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${animal.cor}33, ${animal.cor}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={animal.foto} alt={animal.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          <div style={{ display: 'none', fontSize: '6rem', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{animal.imagem}</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(transparent, rgba(0,10,25,0.95))' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
            <h2 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.3px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{animal.nome}</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <span style={{ background: `${animal.cor}cc`, color: 'white', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700 }}>{animal.tipo}</span>
              <span style={{ background: 'rgba(0,212,255,0.25)', color: '#00d4ff', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(0,212,255,0.3)' }}>🌊 {animal.profundidade}</span>
            </div>
          </div>
        </div>
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

const DetalhesCuriosidade = ({ item, onClose }) => {
  if (!item) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderColor: `${item.cor}55`, maxWidth: '580px', textAlign: 'left', padding: '0', overflow: 'hidden' }}>
        <button className="close-btn" onClick={onClose} style={{ zIndex: 10 }}>×</button>
        <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${item.cor}44, ${item.cor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={item.foto} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
          <div style={{ display: 'none', fontSize: '5rem', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{item.icone}</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(transparent, rgba(0,10,25,0.97))' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
            <h2 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.2px', lineHeight: 1.3, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{item.titulo}</h2>
            <span style={{ background: `${item.cor}bb`, color: 'white', padding: '2px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, marginTop: '6px', display: 'inline-block' }}>{item.destaque}</span>
          </div>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ color: '#00d4ff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Sobre</h3>
            <p style={{ color: 'rgba(220,240,250,0.85)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.descricao}</p>
          </div>
          <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', padding: '12px 16px', borderRadius: '12px' }}>
            <h3 style={{ color: '#00d4ff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Sabia que...</h3>
            <p style={{ color: 'rgba(200,230,240,0.8)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{item.curiosidade}"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   PAGE
   ============================================================ */
const CuriosidadesPage = () => {
  const [secao, setSecao] = useState('animais')
  const [animalSelecionado, setAnimalSelecionado] = useState(null)
  const [curiosidadeSelecionada, setCuriosidadeSelecionada] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const navigate = useNavigate()

  const tipos = ['Todos', 'Peixe', 'Mamífero', 'Molusco', 'Crustáceo', 'Réptil', 'Cnidário', 'Equinodermo']
  const animaisFiltrados = filtro === 'Todos' ? ecosistemaData : ecosistemaData.filter(a => a.tipo === filtro)

  const tabStyle = (aba) => ({
    padding: '10px 24px',
    borderRadius: '50px',
    border: secao === aba ? 'none' : '1px solid rgba(255,255,255,0.12)',
    background: secao === aba ? 'linear-gradient(135deg, #00b8e0, #0070aa)' : 'rgba(255,255,255,0.05)',
    color: secao === aba ? 'white' : 'rgba(200,230,240,0.65)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    boxShadow: secao === aba ? '0 4px 16px rgba(0,184,224,0.3)' : 'none',
    letterSpacing: '0.2px'
  })

  const headerMap = {
    animais: { titulo: 'Animais Marinhos', sub: `${ecosistemaData.length} espécies para explorar` },
    oceano: { titulo: 'Curiosidades do Oceano', sub: `${oceanoData.length} fatos fascinantes sobre os mares` },
    praias: { titulo: 'Curiosidades das Praias', sub: `${praiaData.length} segredos das praias do mundo` },
  }

  return (
    <div className="curiosidades-app">
      <button className="btn-voltar" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="ecosistema-container">
        <header className="ecosistema-header">
          <h1>{headerMap[secao].titulo}</h1>
          <p>{headerMap[secao].sub}</p>
        </header>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button style={tabStyle('animais')} onClick={() => setSecao('animais')}>🐠 Animais Marinhos</button>
          <button style={tabStyle('oceano')} onClick={() => setSecao('oceano')}>🌊 Oceano</button>
          <button style={tabStyle('praias')} onClick={() => setSecao('praias')}>🏖️ Praias</button>
        </div>

        {/* Filtro (só para animais) */}
        {secao === 'animais' && (
          <div className="filtro-container">
            <h3>Filtrar por tipo:</h3>
            <div className="filtro-buttons">
              {tipos.map(tipo => (
                <button key={tipo} className={`filtro-btn ${filtro === tipo ? 'active' : ''}`} onClick={() => setFiltro(tipo)}>{tipo}</button>
              ))}
            </div>
          </div>
        )}

        <div className="oceano-background">
          <div className="animais-grid">
            {secao === 'animais' && animaisFiltrados.map(animal => (
              <AnimalMarinho key={animal.id} animal={animal} onClick={setAnimalSelecionado} isSelected={animalSelecionado?.id === animal.id} />
            ))}
            {secao === 'oceano' && oceanoData.map(item => (
              <CuriosidadeCard key={item.id} item={item} onClick={setCuriosidadeSelecionada} />
            ))}
            {secao === 'praias' && praiaData.map(item => (
              <CuriosidadeCard key={item.id} item={item} onClick={setCuriosidadeSelecionada} />
            ))}
          </div>
        </div>

        {animalSelecionado && <DetalhesAnimal animal={animalSelecionado} onClose={() => setAnimalSelecionado(null)} />}
        {curiosidadeSelecionada && <DetalhesCuriosidade item={curiosidadeSelecionada} onClose={() => setCuriosidadeSelecionada(null)} />}
      </div>
    </div>
  )
}

export default CuriosidadesPage
