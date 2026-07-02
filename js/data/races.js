// ============================================
// ESPECIES — D&D 2024 Player's Handbook
// ============================================

export const RACES = [
    {
        id: 'human',
        name: 'Humano',
        description: 'Versátiles y ambiciosos, los humanos son la especie más adaptable y diversa de todos los mundos.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Ingenioso', desc: 'Ganas un Punto de Heroísmo al inicio de cada Descanso Largo.' },
            { name: 'Habilidoso', desc: 'Ganas competencia en una habilidad de tu elección.' },
            { name: 'Versátil', desc: 'Ganas un Dote de Origen de tu elección (dote de nivel 1).' }
        ],
        extraSkill: 1,
        extraFeat: true,
        darkvision: false,
        mapSymbol: '☺',
        symbolColor: 'tile-player'
    },
    {
        id: 'elf',
        name: 'Elfo',
        description: 'Gráciles y longevos, los elfos poseen una conexión innata con la magia y los reinos feéricos.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies (18m).' },
            { name: 'Linaje Élfico', desc: 'Conoces el cantrip de tu linaje y resistes el encantamiento.' },
            { name: 'Ascendencia Feérica', desc: 'Tienes ventaja en salvaciones contra ser Encantado.' },
            { name: 'Sentidos Agudos', desc: 'Competencia en Percepción.' },
            { name: 'Trance', desc: 'No necesitas dormir. 4 horas de trance equivalen a 8 horas de sueño.' }
        ],
        subTypes: [
            { id: 'high_elf', name: 'Alto Elfo', bonusCantrip: 'Prestidigitación', desc: 'Linaje arcano. Conoces un cantrip de Mago adicional.' },
            { id: 'wood_elf', name: 'Elfo del Bosque', bonusSpeed: 35, desc: 'Linaje silvano. Tu velocidad base es 35 pies.' },
            { id: 'dark_elf', name: 'Elfo Oscuro (Drow)', bonusCantrip: 'Luces Danzantes', desc: 'Linaje de la infraoscuridad. Visión en la Oscuridad superior (120 pies).' }
        ],
        darkvision: 60,
        skillProficiencies: ['Percepción'],
        mapSymbol: '♠',
        symbolColor: 'tile-npc'
    },
    {
        id: 'dwarf',
        name: 'Enano',
        description: 'Robustos y resistentes, los enanos son conocidos por su tenacidad, sus forjas y su amor por la piedra.',
        size: 'Mediano',
        speed: 25,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies.' },
            { name: 'Resiliencia Enana', desc: 'Resistencia a daño de veneno. Ventaja en salvaciones contra veneno.' },
            { name: 'Dureza Enana', desc: 'Tu máximo de puntos de golpe aumenta en 1 por nivel.' },
            { name: 'Conocimiento Pétreo', desc: 'Al hacer una prueba de Historia sobre piedra, se considera competente.' }
        ],
        resistances: ['Veneno'],
        darkvision: 60,
        hpBonus: 1,
        mapSymbol: '♣',
        symbolColor: 'tile-npc'
    },
    {
        id: 'halfling',
        name: 'Halfling',
        description: 'Pequeños pero valientes, los halflings son conocidos por su buena suerte y su naturaleza afable.',
        size: 'Pequeño',
        speed: 30,
        traits: [
            { name: 'Valiente', desc: 'Tienes ventaja en salvaciones contra ser Asustado.' },
            { name: 'Agilidad Halfling', desc: 'Puedes moverte a través del espacio de criaturas más grandes.' },
            { name: 'Suerte', desc: 'Cuando sacas un 1 en un d20, puedes volver a tirar y usar el nuevo resultado.' },
            { name: 'Sigiloso por Naturaleza', desc: 'Competencia en Sigilo.' }
        ],
        darkvision: false,
        skillProficiencies: ['Sigilo'],
        mapSymbol: '○',
        symbolColor: 'tile-player'
    },
    {
        id: 'dragonborn',
        name: 'Dracónido',
        description: 'Descendientes de dragones, los dracónidos poseen un aliento destructivo y escamas relucientes.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies.' },
            { name: 'Resistencia Dracónica', desc: 'Resistencia al tipo de daño de tu linaje dracónico.' },
            { name: 'Arma de Aliento', desc: 'Puedes exhalar energía destructiva. El tipo y forma dependen de tu linaje.' }
        ],
        subTypes: [
            { id: 'black', name: 'Negro (Ácido)', damageType: 'Ácido', breathShape: 'Línea 30 pies', saveStat: 'DES' },
            { id: 'blue', name: 'Azul (Relámpago)', damageType: 'Relámpago', breathShape: 'Línea 30 pies', saveStat: 'DES' },
            { id: 'brass', name: 'Latón (Fuego)', damageType: 'Fuego', breathShape: 'Línea 30 pies', saveStat: 'DES' },
            { id: 'gold', name: 'Oro (Fuego)', damageType: 'Fuego', breathShape: 'Cono 15 pies', saveStat: 'DES' },
            { id: 'green', name: 'Verde (Veneno)', damageType: 'Veneno', breathShape: 'Cono 15 pies', saveStat: 'CON' },
            { id: 'red', name: 'Rojo (Fuego)', damageType: 'Fuego', breathShape: 'Cono 15 pies', saveStat: 'DES' },
            { id: 'silver', name: 'Plata (Frío)', damageType: 'Frío', breathShape: 'Cono 15 pies', saveStat: 'CON' },
            { id: 'white', name: 'Blanco (Frío)', damageType: 'Frío', breathShape: 'Cono 15 pies', saveStat: 'CON' },
            { id: 'bronze', name: 'Bronce (Relámpago)', damageType: 'Relámpago', breathShape: 'Línea 30 pies', saveStat: 'DES' },
            { id: 'copper', name: 'Cobre (Ácido)', damageType: 'Ácido', breathShape: 'Línea 30 pies', saveStat: 'DES' }
        ],
        darkvision: 60,
        mapSymbol: '♦',
        symbolColor: 'tile-enemy'
    },
    {
        id: 'gnome',
        name: 'Gnomo',
        description: 'Curiosos e inventivos, los gnomos poseen una mente brillante y una conexión con la magia sutil.',
        size: 'Pequeño',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies.' },
            { name: 'Astucia Gnómica', desc: 'Ventaja en salvaciones de INT, SAB y CAR contra magia.' },
            { name: 'Linaje Gnómico', desc: 'Conoces un cantrip de tu linaje.' }
        ],
        subTypes: [
            { id: 'forest', name: 'Gnomo del Bosque', bonusCantrip: 'Ilusión Menor', desc: 'Puedes hablar con bestias pequeñas.' },
            { id: 'rock', name: 'Gnomo de las Rocas', bonusCantrip: 'Prestidigitación', desc: 'Puedes crear pequeños dispositivos mecánicos.' }
        ],
        darkvision: 60,
        magicResistance: true,
        mapSymbol: '◘',
        symbolColor: 'tile-npc'
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        description: 'Marcados por una herencia infernal, los tieflings cargan con la sombra de los planos inferiores.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies.' },
            { name: 'Legado Infernal', desc: 'Conoces hechizos innatos según tu linaje.' },
            { name: 'Presencia Sobrenatural', desc: 'Competencia en Intimidación o Persuasión.' }
        ],
        subTypes: [
            { id: 'abyssal', name: 'Abisal', spells: ['Taumaturgia'], desc: 'Legado del Abismo. Resistencia a Veneno.' },
            { id: 'chthonic', name: 'Ctónico', spells: ['Toque Gélido'], desc: 'Legado ctónico. Resistencia a Necrótico.' },
            { id: 'infernal', name: 'Infernal', spells: ['Taumaturgia'], desc: 'Legado infernal. Resistencia a Fuego.' }
        ],
        darkvision: 60,
        mapSymbol: '¥',
        symbolColor: 'tile-enemy'
    },
    {
        id: 'orc',
        name: 'Orco',
        description: 'Fuertes y resilientes, los orcos son guerreros natos con una voluntad de hierro.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 120 pies.' },
            { name: 'Descarga de Adrenalina', desc: 'Puedes usar una Acción Adicional para moverte igual a tu velocidad (usos = bonus competencia por DL).' },
            { name: 'Resistencia Implacable', desc: 'Cuando caes a 0 PG sin morir, puedes caer a 1 PG en su lugar (1/DL).' }
        ],
        darkvision: 120,
        mapSymbol: '♠',
        symbolColor: 'tile-enemy'
    },
    {
        id: 'goliath',
        name: 'Goliat',
        description: 'Gigantes entre los mortales, los goliats valoran la competencia y la fuerza por encima de todo.',
        size: 'Mediano',
        speed: 35,
        traits: [
            { name: 'Ancestro Gigante', desc: 'Puedes usar Fuerza Sobrenatural según tu linaje gigante.' },
            { name: 'Forma Grande', desc: 'Puedes volverte de tamaño Grande temporalmente (10 min, 1/DL).' },
            { name: 'Constitución Poderosa', desc: 'Cuentas como una talla mayor para capacidad de carga y empujar/arrastrar.' }
        ],
        subTypes: [
            { id: 'cloud', name: 'Gigante de las Nubes', ability: 'Paso Brumoso', desc: 'Puedes teletransportarte 30 pies como Acción Adicional.' },
            { id: 'fire', name: 'Gigante de Fuego', ability: 'Ataque Ardiente', desc: 'Añades 1d10 de fuego a un ataque (1/turno).' },
            { id: 'frost', name: 'Gigante de Escarcha', ability: 'Represalia Gélida', desc: 'Cuando recibes daño, puedes reducirlo en 1d12+CON.' },
            { id: 'hill', name: 'Gigante de las Colinas', ability: 'Torsión', desc: 'Cuando golpeas, puedes empujar 5 pies.' },
            { id: 'stone', name: 'Gigante de Piedra', ability: 'Resistencia Pétrea', desc: 'Reduces daño recibido en 1d12.' },
            { id: 'storm', name: 'Gigante de las Tormentas', ability: 'Canalizar Tormenta', desc: '1d8 de relámpago adicional en un ataque.' }
        ],
        darkvision: false,
        mapSymbol: '▲',
        symbolColor: 'tile-npc'
    },
    {
        id: 'aasimar',
        name: 'Aasimar',
        description: 'Tocados por lo divino, los aasimar portan la luz celestial en su interior.',
        size: 'Mediano',
        speed: 30,
        traits: [
            { name: 'Visión en la Oscuridad', desc: 'Puedes ver en la oscuridad hasta 60 pies.' },
            { name: 'Resistencia Celestial', desc: 'Resistencia a daño Necrótico y Radiante.' },
            { name: 'Manos Sanadoras', desc: 'Puedes curar PG igual a tu nivel (1/DL).' },
            { name: 'Portador de Luz', desc: 'Conoces el cantrip Luz.' },
            { name: 'Revelación Celestial', desc: 'A nivel 3+, puedes transformarte (alas, daño extra) durante 1 minuto.' }
        ],
        resistances: ['Necrótico', 'Radiante'],
        darkvision: 60,
        innateSpells: ['Luz'],
        mapSymbol: '✦',
        symbolColor: 'tile-treasure'
    }
];

export function getRaceById(id) {
    return RACES.find(r => r.id === id);
}
