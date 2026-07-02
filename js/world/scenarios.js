// ============================================
// Scenarios — Escenarios del juego
// ============================================

/**
 * Escenario inicial: La Taberna del Grifo Dorado
 */
export const TAVERN_MAP = {
    id: 'tavern',
    name: 'Taberna del Grifo Dorado',
    dark: false,
    grid: [
        '###############',
        '#.............#',
        '#.............#',
        '#..###..###...#',
        '#..#.....T#...#',
        '#..#......#...#',
        '#..###D####...#',
        '#.............#',
        '#.............#',
        '#....####.....#',
        '#....#..#.....#',
        '#....#..#.....#',
        '#....####.....#',
        '#.............#',
        '####D##########'
    ].map(row => row.split('')),
    playerStart: { x: 7, y: 8 },
    transitions: {
        '4,14': {
            target: 'catacombs_entrance',
            text: 'Has llegado a la puerta de salida. El viento nocturno aúlla afuera. Un camino de piedra desgastada serpentea colina abajo hacia la entrada de las catacumbas.',
            option: 'Salir hacia las catacumbas'
        }
    },
    entities: [
        {
            id: 'barkeep',
            name: 'Thorn el Tabernero',
            legendName: 'Thorn (Tabernero)',
            symbol: 'T',
            cssClass: 'tile-npc',
            x: 5, y: 5,
            type: 'npc',
            kaomoji: '( ￣ー￣)',
            farewell: 'Thorn asiente con la cabeza. "Cuídate ahí fuera, viajero."',
            dialogue: [
                '¡Bienvenido al Grifo Dorado, viajero! ¿Qué te trae por estos lares?',
                'Otra vez tú. Espero que vengas con sed y monedas.',
                'Ya te conozco. ¿Lo de siempre?'
            ],
            options: [
                {
                    text: '¿Qué puedes contarme de este lugar?',
                    response: 'Esta taberna ha estado aquí más de doscientos años. Construida sobre los cimientos de una antigua capilla. Las noches se han vuelto peligrosas últimamente. Criaturas extrañas rondan las ruinas al norte.',
                    setFlag: 'thorn_intro'
                },
                {
                    text: '¿Has visto forasteros últimamente?',
                    response: 'Unos comerciantes pasaron hace dos lunas, decían que los caminos del este están cortados por bandidos. Una encapuchada llegó hace unos días, no habla con nadie. Se sienta en el rincón y observa. Me pone los pelos de punta.'
                },
                {
                    text: 'Busco trabajo.',
                    response: 'Si buscas trabajo, el alguacil paga 50 piezas de oro por limpiar las catacumbas bajo la colina. Dicen que escucharon ruidos extraños allí abajo. Esqueletos, quizás algo peor. Toma, esto te servirá.',
                    setFlag: 'quest_catacombs',
                    giveItem: 'Antorcha',
                    giveItemType: 'gear',
                    onceOnly: true
                },
                {
                    text: 'Quiero una cerveza.',
                    response: '¡Excelente elección! La mejor cerveza de Eregepia. Sirvo la Dorada del Grifo, amarga y fuerte como un enano en día de paga. ¡Aquí tienes!',
                    cost: 2,
                    failResponse: 'Sin monedas no hay cerveza, amigo. Así funciona el negocio.',
                    heal: 2
                },
                {
                    text: 'Quiero un estofado caliente.',
                    response: 'El estofado de hoy es de venado con patatas y hierbas del bosque. Te lo sirvo bien caliente. ¡Come y recobra fuerzas!',
                    cost: 3,
                    failResponse: 'El estofado no se paga solo, amigo.',
                    heal: 5
                },
                {
                    text: '¿Puedo alquilar una habitación?',
                    response: 'Tengo una habitación limpia arriba. Sábanas limpias, puerta con cerrojo. Te sentirás como nuevo al despertar.',
                    cost: 5,
                    failResponse: 'Las habitaciones no son gratis, viajero. Consigue unas monedas primero.',
                    heal: 999
                },
                {
                    text: '¿Qué sabes de las catacumbas?',
                    response: 'Las catacumbas fueron construidas hace siglos por los Sacerdotes de Eregor. Enterraban a sus muertos con rituales de sellado. Pero algo rompió los sellos. Los cuerpos ya no descansan. Escuché que hay un altar profanado en lo más hondo... si llegas tan lejos.',
                    requireFlag: 'thorn_intro'
                },
                {
                    text: '¿Qué hay más allá del Osario?',
                    response: 'Los viejos hablan de una Cámara del Altar en lo más profundo. Dicen que ahí yace el Capitán de los Muertos, un guerrero antiguo que se niega a morir. Si lo derrotas, quizás los muertos descansen por fin. Pero nadie ha vuelto de ahí...',
                    requireFlag: 'quest_catacombs'
                }
            ]
        },
        {
            id: 'mysterious_stranger',
            name: 'Figura Encapuchada',
            legendName: 'Figura Encapuchada',
            symbol: 'F',
            cssClass: 'tile-npc',
            x: 10, y: 2,
            type: 'npc',
            kaomoji: '(눈_눈)',
            farewell: '*La figura vuelve a sumergirse en las sombras, observándote en silencio.*',
            dialogue: [
                '...',
                '*La figura te mira desde las sombras de su capucha*',
                '*Sus ojos brillan con un reconocimiento que te inquieta*',
                'Ah, has vuelto. El destino te trae de regreso.'
            ],
            options: [
                {
                    text: '¿Quién eres?',
                    response: 'Alguien que sabe que tienes el brillo de alguien destinado a algo grande. O a una muerte rápida. El destino no distingue entre ambas cosas, ¿sabes?'
                },
                {
                    text: '¿Me estabas observando?',
                    response: 'Observo a todos. Es la única forma de sobrevivir cuando las sombras crecen. Pero a ti... a ti te observo con especial interés. Tienes algo que los muertos buscan.'
                },
                {
                    text: '¿Qué sabes de las catacumbas?',
                    response: 'Los muertos no caminan sin razón. Alguien — o algo — los despertó. Un poder antiguo bajo el altar. Si bajas, busca las runas en las paredes. Te dirán la verdad que los sacerdotes enterraron.',
                    setFlag: 'stranger_runes_hint'
                },
                {
                    text: '¿Qué haces aquí?',
                    response: 'Espero. Las catacumbas bajo la colina guardan secretos más antiguos que esta taberna. Si te atreves... *Te entrega un viejo pergamino enrollado*',
                    giveItem: 'Viejo Pergamino',
                    onceOnly: true,
                    setFlag: 'has_scroll'
                },
                {
                    text: '[Perspicacia] ¿Me ocultas algo?',
                    response: '*Sonríe bajo la capucha* Astuto. Sí, te oculto muchas cosas. Pero te diré una: el líder de los muertos porta un amuleto. Ese amuleto es la llave de todo. Destrúyelo y los muertos caerán.',
                    skillCheck: { skill: 'Perspicacia', dc: 12, failResponse: '*Te mira sin expresión* No sé de qué hablas.' },
                    setFlag: 'stranger_amulet_hint'
                },
                {
                    text: '¿Qué dice el pergamino?',
                    response: 'Es un mapa parcial de las catacumbas. Marcado con símbolos de protección. Los sacerdotes los usaban para sellar a los muertos. Quizás puedas usarlos para debilitar al capitán no-muerto.',
                    requireFlag: 'has_scroll'
                },
                {
                    text: '¿Tienes algo que me ayude?',
                    response: '*Saca un pequeño frasco de su capa* Agua bendita. Úsala sabiamente contra los no-muertos. Sus huesos arderán con el contacto.',
                    giveItem: 'Agua Bendita',
                    giveItemType: 'consumable',
                    onceOnly: true,
                    requireFlag: 'quest_catacombs'
                }
            ]
        },
        {
            id: 'drunk_dwarf',
            name: 'Brumm el Enano',
            legendName: 'Brumm (Enano Borracho)',
            symbol: 'B',
            cssClass: 'tile-npc',
            x: 3, y: 9,
            type: 'npc',
            kaomoji: '(~_~;)',
            farewell: '*Brumm agita su jarra vacía en el aire* "¡Hasta la próxima... hip... ronda!"',
            dialogue: [
                '*Eructa sonoramente* ¡Por las barbas de Moradin!',
                '*Levanta la cabeza de la mesa* ¿Eh? ¡Ah, eres tú otra vez!',
                '*Te reconoce con los ojos entrecerrados* ¡Mi... hip... compañero de tragos!'
            ],
            options: [
                {
                    text: '¿Estás bien?',
                    response: '¿Bien? ¡Estoy EXCELENTE! Solo llevo... *cuenta con los dedos* ...muchas cervezas. Pero te diré algo que vi. ¡Esqueletos! La otra noche, caminando por el sendero norte. ¡ESQUELETOS con espadas!'
                },
                {
                    text: 'Cuéntame de los esqueletos.',
                    response: 'Eran al menos cinco o seis. Llevaban armaduras oxidadas y espadas melladas. Marchaban en formación, como soldados. ¡Uno de ellos tenía un yelmo con cuernos! Ese debe ser el jefe. Daba más miedo que mi ex esposa. Y mira que eso es decir.',
                    setFlag: 'brumm_skeleton_info'
                },
                {
                    text: '¿Sabes de trampas en las catacumbas?',
                    response: 'Cuando era joven y estúpido, bajé a las catacumbas. ¡Los suelos se abren bajo tus pies! Hay losas que crujen. Si escuchas un crujido... ¡SALTA! También hay gas venenoso en algunas cámaras. Cubre tu nariz.',
                    setFlag: 'brumm_trap_warning'
                },
                {
                    text: '¿Quieres un trago? Yo invito.',
                    response: '¡¿QUÉ?! ¡Eres el mejor humano... elfo... lo que seas... que he conocido! ¡POR TU SALUD! *Bebe de un trago y eructa* ¡Toma, te doy mi daga de la suerte! La encontré en un barril de cerveza. ¡Nunca falla!',
                    cost: 2,
                    failResponse: '¡Maldición! ¡Promesas vacías como tu bolsillo!',
                    giveItem: 'Daga de la Suerte',
                    giveItemType: 'weapon',
                    onceOnly: true
                },
                {
                    text: '[Constitución] ¡Hagamos un concurso de bebida!',
                    response: '¡JAJAJA! ¡ME GUSTA TU ESTILO! *Después de seis rondas, Brumm cae de la silla* ¡Tú... hip... ganas! ¡Toma estas monedas! *Te lanza unas monedas antes de quedarse dormido*',
                    skillCheck: { skill: 'Atletismo', dc: 14, failResponse: '*Tres jarras después, el mundo da vueltas* ¡Ja! ¡Ni un enano de medio metro aguanta menos que tú! *Te caes de la silla*' },
                    giveGold: 10,
                    onceOnly: true
                },
                {
                    text: 'Estás borracho, ve a dormir.',
                    response: '¡BAH! La gente dice que estoy loco, pero yo sé lo que vi. ¡Y no fue el alcohol! Bueno, no SOLO el alcohol... *se ríe y casi se cae de la silla*'
                },
                {
                    text: '¿Hay un punto débil en los no-muertos?',
                    response: 'Mi abuelo decía: "Los huesos se quiebran, pero el vínculo que los ata es la magia". Si destruyes la fuente de la nigromancia — el altar o el amuleto del líder — todos los esqueletos caerán como marionetas sin hilos.',
                    requireFlag: 'brumm_skeleton_info'
                },
                {
                    text: 'Iré a las catacumbas.',
                    response: 'Si vas allá abajo... ¡lleva aceite sagrado y no te fíes de las sombras! Los muertos vivientes odian la luz. Y si ves al del yelmo con cuernos... ¡corre o pelea con todo! No hay punto medio con esos engendros.'
                }
            ]
        }
    ],
    description: [
        'La pesada puerta de madera se abre con un chirrido revelando el interior cálido de la',
        'Taberna del Grifo Dorado. El aroma a estofado de carne y pan recién horneado inunda',
        'el lugar, mezclado con el humo dulce de las pipas de tabaco.',
        '',
        'El fuego crepita en una chimenea de piedra al fondo. Varias mesas de roble macizo',
        'están dispersas por el salón, algunas ocupadas por parroquianos que beben en silencio.',
        'Detrás de la barra, un hombre corpulento de barba rojiza limpia jarras de peltre.',
        '',
        'En un rincón oscuro, una figura encapuchada observa la sala con ojos que brillan',
        'tenuemente. Cerca de la chimenea, un enano parece al borde de quedarse dormido',
        'sobre su sexta (¿séptima?) jarra de cerveza.',
        '',
        'Una puerta al sur lleva al exterior. Las paredes están decoradas con trofeos de',
        'caza y un viejo escudo con el emblema del Grifo Dorado.'
    ]
};

/**
 * Escenario 2: Entrada a las Catacumbas
 */
export const CATACOMBS_ENTRANCE = {
    id: 'catacombs_entrance',
    name: 'Catacumbas — Entrada',
    dark: true,
    grid: [
        '###############',
        '#.....#.......#',
        '#.....#.......#',
        '#.....D.......#',
        '#.....#.......#',
        '###D###.......#',
        '#.............#',
        '#.............#',
        '#.......###D###',
        '#.......#.....#',
        '#.......#.....#',
        '#.......D.....#',
        '#.......#.....#',
        '#.............#',
        '##<############'
    ].map(row => row.split('')),
    playerStart: { x: 2, y: 13 },
    transitions: {
        '2,14': {
            target: 'tavern',
            text: 'Ves escaleras que ascienden de vuelta a la superficie. Una brisa cálida con aroma a estofado desciende desde arriba.',
            option: 'Subir a la taberna'
        },
        '11,8': {
            target: 'catacombs_ossuary',
            text: 'Más allá de la puerta, un corredor estrecho desciende aún más profundo. El aire se vuelve gélido y hueles a huesos y polvo antiguo.',
            option: 'Descender al Osario'
        }
    },
    entities: [
        {
            id: 'skeleton_1',
            name: 'Esqueleto',
            legendName: 'Esqueleto',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 9, y: 2,
            type: 'enemy',
            stats: { hp: 13, ac: 13, attack: '+4', damage: '1d6+2', xp: 50, speed: 1 }
        },
        {
            id: 'skeleton_2',
            name: 'Esqueleto',
            legendName: 'Esqueleto',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 11, y: 6,
            type: 'enemy',
            stats: { hp: 13, ac: 13, attack: '+4', damage: '1d6+2', xp: 50, speed: 1 }
        },
        {
            id: 'chest_1',
            name: 'Cofre Viejo',
            legendName: 'Cofre',
            symbol: 'C',
            cssClass: 'tile-treasure',
            x: 2, y: 2,
            type: 'chest',
            loot: [
                { name: 'Poción de Curación', quantity: 2 },
                { name: '15 po', type: 'gold', amount: 15 }
            ]
        },
        {
            id: 'ghost_warden',
            name: 'Espíritu del Guardián',
            legendName: 'Espíritu (Guardián)',
            symbol: 'G',
            cssClass: 'tile-npc',
            x: 10, y: 10,
            type: 'npc',
            kaomoji: '(꒪⌓꒪)',
            farewell: '*El espíritu se desvanece lentamente, dejando un rastro de escarcha en el aire...*',
            dialogue: [
                '*Una forma translúcida se materializa ante ti. Sus ojos vacíos brillan con una luz azulada*',
                'Te... recuerdo. Has vuelto a perturbar el descanso de los muertos.',
                '*El espíritu parpadea con una luz tenue* Aún estás vivo. Sorprendente.'
            ],
            options: [
                {
                    text: '¿Quién eres?',
                    response: 'Fui Aldric, guardián de estas catacumbas. Morí hace doscientos años protegiendo los sellos sagrados. Ahora vago entre los mundos, incapaz de descansar mientras el mal corrompa este lugar.'
                },
                {
                    text: '¿Qué pasó aquí?',
                    response: 'Los sellos que contenían a los muertos fueron rotos. Alguien — algo — profanó el Altar de Eregor en la cámara más profunda. Desde entonces, los cadáveres se levantan con una furia ciega. No son ellos mismos... están controlados.',
                    setFlag: 'ghost_altar_info'
                },
                {
                    text: '¿Cómo puedo acabar con esto?',
                    response: 'Debes llegar a la Cámara del Altar. Allí encontrarás al Capitán No-Muerto, el primero en levantarse. Él porta un Amuleto de Nigromancia. Destrúyelo y el vínculo que ata a los muertos se romperá.',
                    requireFlag: 'ghost_altar_info',
                    setFlag: 'ghost_quest_altar'
                },
                {
                    text: '¿Puedes bendecirme?',
                    response: '*El espíritu extiende sus manos translúcidas y una luz cálida te envuelve* Te otorgo la Bendición de Aldric. Los no-muertos sentirán tu presencia como una llama. Pero es temporal... úsala bien.',
                    heal: 8,
                    setFlag: 'aldric_blessing',
                    onceOnly: true
                },
                {
                    text: '¿Hay trampas adelante?',
                    response: 'El Osario está plagado de trampas de los sacerdotes antiguos. Suelos que se hunden, gas ponzoñoso... Los sacerdotes querían que nada saliera de las catacumbas. Camina con cuidado cerca de las paredes.',
                    setFlag: 'ghost_trap_warning'
                },
                {
                    text: '¿Puedo ayudarte a descansar?',
                    response: '*Una expresión de tristeza cruza su rostro espectral* Si destruyes el amuleto y purificas el altar... quizás por fin pueda descansar. Te lo ruego, viajero. Acaba con esta maldición.',
                    setFlag: 'ghost_peace_request'
                }
            ]
        }
    ],
    description: [
        'Desciendes por escaleras de piedra resbaladiza cubiertas de musgo y humedad.',
        'El aire se vuelve frío y huele a tierra húmeda y algo... muerto.',
        '',
        'Las catacumbas se abren ante ti como un laberinto de corredores oscuros.',
        'Las paredes están llenas de nichos vacíos donde alguna vez descansaron los muertos.',
        'Ahora, muchos de esos nichos están rotos, como si algo hubiera salido de ellos.',
        '',
        'El eco de tus pasos rebota en las paredes de piedra. A lo lejos, crees',
        'escuchar el crujido de huesos moviéndose...',
        '',
        'Un resplandor azulado parpadea al este, y al fondo sur-este ves una puerta',
        'que conduce aún más abajo, hacia el Osario.'
    ]
};

/**
 * Escenario 3: Catacumbas — Sala del Osario
 */
export const CATACOMBS_OSSUARY = {
    id: 'catacombs_ossuary',
    name: 'Catacumbas — Sala del Osario',
    dark: true,
    grid: [
        '###############',
        '#..#..........#',
        '#..#..........#',
        '#..####D####..#',
        '#..#........#.#',
        '#..#........#.#',
        '#..#........#.#',
        '#..####..####.#',
        '#.............#',
        '#.............#',
        '#..####D####..#',
        '#..#........#.#',
        '#..#........#.#',
        '#..#..........#',
        '##<####D#######'
    ].map(row => row.split('')),
    playerStart: { x: 2, y: 1 },
    transitions: {
        '2,14': {
            target: 'catacombs_entrance',
            text: 'Escaleras que ascienden de vuelta a la entrada de las catacumbas. El aire se siente un poco menos pesado arriba.',
            option: 'Subir a la Entrada'
        },
        '6,14': {
            target: 'catacombs_altar',
            text: 'Una pesada puerta de hierro oxidado se alza ante ti. Más allá, sientes una presencia maligna que hace temblar el suelo. El corazón de la oscuridad yace detrás.',
            option: 'Entrar a la Cámara del Altar'
        }
    },
    entities: [
        {
            id: 'skeleton_3',
            name: 'Esqueleto Guardia',
            legendName: 'Esq. Guardia',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 6, y: 5,
            type: 'enemy',
            stats: { hp: 16, ac: 14, attack: '+5', damage: '1d8+2', xp: 75, speed: 1 }
        },
        {
            id: 'skeleton_4',
            name: 'Esqueleto Arquero',
            legendName: 'Esq. Arquero',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 9, y: 4,
            type: 'enemy',
            stats: { hp: 11, ac: 12, attack: '+4', damage: '1d6+2', xp: 50, speed: 1 }
        },
        {
            id: 'zombie_1',
            name: 'Zombie Putrefacto',
            legendName: 'Zombie',
            symbol: 'Z',
            cssClass: 'tile-enemy',
            x: 5, y: 12,
            type: 'enemy',
            stats: { hp: 22, ac: 8, attack: '+3', damage: '1d6+1', xp: 100, speed: 1 }
        },
        {
            id: 'chest_ossuary',
            name: 'Sarcófago Abierto',
            legendName: 'Sarcófago',
            symbol: 'C',
            cssClass: 'tile-treasure',
            x: 10, y: 6,
            type: 'chest',
            loot: [
                { name: 'Poción de Curación Mayor', quantity: 1 },
                { name: 'Espada Oxidada', quantity: 1 },
                { name: '25 po', type: 'gold', amount: 25 }
            ]
        },
        {
            id: 'rune_stone',
            name: 'Piedra Rúnica',
            legendName: 'Piedra Rúnica',
            symbol: 'R',
            cssClass: 'tile-npc',
            x: 12, y: 9,
            type: 'npc',
            kaomoji: '(◉_◉)',
            farewell: '*Las runas se apagan lentamente, volviendo a la oscuridad.*',
            dialogue: [
                '*Una piedra cubierta de runas antiguas brilla con una luz tenue al acercarte*',
                '*Las runas parpadean al reconocerte, como si te esperaran*'
            ],
            options: [
                {
                    text: 'Examinar las runas.',
                    response: 'Las runas dicen: "Aquí yacen los guerreros del último rey. Su capitán juró servir más allá de la muerte. Solo la destrucción del Amuleto del Vasallaje liberará sus almas."',
                    setFlag: 'runes_read'
                },
                {
                    text: '[Arcanos] Intentar descifrar el significado profundo.',
                    response: 'Las runas revelan un círculo de protección. Si lo activas antes de enfrentar al Capitán, él será más débil. *Las runas brillan con intensidad y sientes una energía protectora envolviéndote*',
                    skillCheck: { skill: 'Arcanos', dc: 14, failResponse: 'Los símbolos se difuminan ante tus ojos. No logras comprenderlos por completo.' },
                    setFlag: 'rune_protection',
                    heal: 5,
                    onceOnly: true
                },
                {
                    text: 'Tocar la piedra.',
                    response: '*Al tocar la piedra, una descarga de energía recorre tu cuerpo. Las runas brillan y susurran palabras olvidadas. Sientes que algo te protege momentáneamente.*',
                    heal: 3
                }
            ]
        }
    ],
    description: [
        'El corredor se abre a una vasta sala subterránea — el Osario.',
        'Pilas de huesos se apilan contra las paredes hasta el techo, formando',
        'macabros mosaicos de cráneos y fémures dispuestos con perturbadora simetría.',
        '',
        'El aire es denso, cargado de polvo de huesos y el hedor dulzón de la muerte.',
        'Algunas de las pilas de huesos vibran imperceptiblemente, como si algo',
        'en su interior quisiera salir.',
        '',
        'Arcos de piedra tallada dividen la sala en secciones. En el centro,',
        'una piedra cubierta de runas antiguas emite un brillo tenue e intermitente.',
        '',
        'Al fondo, una puerta de hierro macizo espera. Detrás, sientes una presencia',
        'oscura que hace que el vello de tu nuca se erice.'
    ]
};

/**
 * Escenario 4: Catacumbas — Cámara del Altar
 */
export const CATACOMBS_ALTAR = {
    id: 'catacombs_altar',
    name: 'Catacumbas — Cámara del Altar',
    dark: true,
    grid: [
        '###############',
        '#.............#',
        '#.............#',
        '#...#######...#',
        '#...#.....#...#',
        '#...#.....#...#',
        '#...#.....#...#',
        '#...###.###...#',
        '#.............#',
        '#.............#',
        '#.............#',
        '#..####.####..#',
        '#..#.......#..#',
        '#..#.......#..#',
        '####<##########'
    ].map(row => row.split('')),
    playerStart: { x: 7, y: 9 },
    transitions: {
        '4,14': {
            target: 'catacombs_ossuary',
            text: 'Las escaleras ascienden de vuelta al Osario. El aire se siente marginalmente menos opresivo arriba.',
            option: 'Subir al Osario'
        }
    },
    entities: [
        {
            id: 'skeleton_captain',
            name: 'Capitán No-Muerto',
            legendName: 'Capitán No-Muerto ☠',
            symbol: 'K',
            cssClass: 'tile-enemy',
            x: 7, y: 5,
            type: 'enemy',
            stats: { hp: 35, ac: 16, attack: '+6', damage: '1d10+4', xp: 300, speed: 2 }
        },
        {
            id: 'skeleton_guard_a',
            name: 'Esqueleto Élite',
            legendName: 'Esq. Élite',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 5, y: 2,
            type: 'enemy',
            stats: { hp: 18, ac: 14, attack: '+5', damage: '1d8+3', xp: 75, speed: 1 }
        },
        {
            id: 'skeleton_guard_b',
            name: 'Esqueleto Élite',
            legendName: 'Esq. Élite',
            symbol: 'E',
            cssClass: 'tile-enemy',
            x: 9, y: 2,
            type: 'enemy',
            stats: { hp: 18, ac: 14, attack: '+5', damage: '1d8+3', xp: 75, speed: 1 }
        },
        {
            id: 'altar_chest',
            name: 'Altar Profanado',
            legendName: 'Altar',
            symbol: 'A',
            cssClass: 'tile-treasure',
            x: 7, y: 4,
            type: 'chest',
            loot: [
                { name: 'Amuleto del Vasallaje', quantity: 1 },
                { name: 'Poción de Curación Mayor', quantity: 2 },
                { name: 'Gema de Eregor', quantity: 1 },
                { name: '100 po', type: 'gold', amount: 100 }
            ]
        },
        {
            id: 'altar_spirit',
            name: 'Espíritu de Eregor',
            legendName: 'Espíritu de Eregor',
            symbol: 'S',
            cssClass: 'tile-npc',
            x: 3, y: 12,
            type: 'npc',
            kaomoji: '(✧ω✧)',
            farewell: '*El espíritu brilla con una luz cálida antes de desvanecerse como una llama que se apaga suavemente*',
            dialogue: [
                '*Una presencia luminosa se materializa. A diferencia de los otros espíritus, este irradia calma y poder*',
                'Has vuelto, portador de la luz. El Altar aún espera purificación.',
                '*Te saluda con un gesto solemne, como un viejo amigo*'
            ],
            options: [
                {
                    text: '¿Quién eres?',
                    response: 'Soy el último eco del sacerdote Eregor, fundador de estas catacumbas. Creé este lugar para dar descanso eterno a los caídos. Pero mi sucesor traicionó los votos y usó nigromancia para crear un ejército de muertos. El altar fue su herramienta.'
                },
                {
                    text: '¿Cómo purifico el altar?',
                    response: 'Derrota al Capitán No-Muerto y toma el Amuleto del Vasallaje del altar. Cuando lo destruyas — rómpelo contra el suelo bendito — la nigromancia se disipará y los muertos por fin descansarán.',
                    setFlag: 'eregor_purification_info'
                },
                {
                    text: '¿Puedes darme fuerzas?',
                    response: '*El espíritu extiende sus manos y una onda de luz sagrada te envuelve. Sientes el calor de la vida llenar cada fibra de tu ser* Que la luz de Eregor te proteja en la batalla final.',
                    heal: 20,
                    onceOnly: true
                },
                {
                    text: '¿Qué pasará cuando esto termine?',
                    response: 'Las catacumbas volverán a ser un lugar de descanso. Aldric, el guardián, podrá por fin dormir. Y yo... yo me uniré a los que protegí en vida. Pero tú, viajero, serás recordado como el liberador de Eregepia.',
                    requireFlag: 'eregor_purification_info'
                },
                {
                    text: '¿El Capitán tiene debilidades?',
                    response: 'Es fuerte pero su vínculo con el amuleto es también su cadena. Si portas la Bendición de Aldric o la protección de las runas, sus golpes serán menos certeros. Y el agua bendita quema su carne no-muerta como ácido.',
                    requireFlag: 'ghost_altar_info'
                }
            ]
        }
    ],
    description: [
        'La puerta de hierro se abre con un gemido que resuena como un lamento.',
        'Ante ti se extiende la Cámara del Altar — el corazón oscuro de las catacumbas.',
        '',
        'En el centro de la sala, un altar de piedra negra pulida irradia una energía',
        'púrpura siniestra. Runas de poder parpadean en su superficie, alimentando',
        'la nigromancia que mantiene a los muertos en pie.',
        '',
        'Frente al altar, una figura imponente se alza: un esqueleto con armadura',
        'completa de placas oxidadas y un yelmo con cuernos retorcidos. En una mano',
        'empuña una espada bastarda, en la otra un escudo con el símbolo de la muerte.',
        '',
        'A los flancos, dos esqueletos de élite montan guardia inmóvil.',
        'El Capitán No-Muerto gira su cráneo hacia ti con un crujido seco.',
        'Sus ojos vacíos arden con fuego púrpura.',
        '',
        'No hay vuelta atrás.'
    ]
};

// ============================================
// Registry de escenarios
// ============================================

export const SCENARIOS = {
    tavern: TAVERN_MAP,
    catacombs_entrance: CATACOMBS_ENTRANCE,
    catacombs_ossuary: CATACOMBS_OSSUARY,
    catacombs_altar: CATACOMBS_ALTAR
};

export function getScenario(id) {
    return SCENARIOS[id];
}
