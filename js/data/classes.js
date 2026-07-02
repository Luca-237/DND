// ============================================
// CLASES — D&D 2024 Player's Handbook
// ============================================

export const CLASSES = [
    {
        id: 'barbarian',
        name: 'Bárbaro',
        description: 'Un guerrero primitivo que canaliza su furia interior para devastar a sus enemigos.',
        hitDie: 12,
        primaryAbility: 'FUE',
        savingThrows: ['FUE', 'CON'],
        armorProficiencies: ['Ligera', 'Media', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas', 'Armas Marciales'],
        skillChoices: { count: 2, from: ['Atletismo', 'Intimidación', 'Naturaleza', 'Percepción', 'Supervivencia', 'Trato con Animales'] },
        startingHP: 12,
        features: [
            { name: 'Ira', desc: 'En tu turno, puedes entrar en Ira como Acción Adicional. Ganas +2 daño cuerpo a cuerpo, resistencia a daño cortante/contundente/perforante, ventaja en pruebas y salvaciones de FUE. Dura 10 asaltos. Usos: 2/DL.' },
            { name: 'Defensa sin Armadura', desc: 'Sin armadura: CA = 10 + mod DES + mod CON.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 2 armas con las que tengas competencia.' }
        ],
        spellcaster: false,
        equipment: [
            { name: 'Hacha Grande', type: 'weapon' },
            { name: '4 Jabalinas', type: 'weapon' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '⚔'
    },
    {
        id: 'bard',
        name: 'Bardo',
        description: 'Un artista versátil que teje magia a través de la música, las palabras y la performance.',
        hitDie: 8,
        primaryAbility: 'CAR',
        savingThrows: ['DES', 'CAR'],
        armorProficiencies: ['Ligera'],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 3, from: ['Acrobacia', 'Atletismo', 'Engaño', 'Historia', 'Interpretación', 'Intimidación', 'Investigación', 'Juego de Manos', 'Medicina', 'Naturaleza', 'Percepción', 'Perspicacia', 'Persuasión', 'Religión', 'Sigilo', 'Supervivencia', 'Trato con Animales'] },
        startingHP: 8,
        features: [
            { name: 'Inspiración Bárdica', desc: 'Puedes inspirar a otros con un dado de Inspiración (d6). Usos = mod CAR (mín 1) por DL.' },
            { name: 'Lanzamiento de Conjuros', desc: 'Conoces 2 cantrips y 4 hechizos de nivel 1. CAR es tu aptitud mágica.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 1 arma.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'CAR',
        cantripsKnown: 2,
        spellsKnown: 4,
        spellSlots: { 1: 2 },
        spellList: 'bard',
        equipment: [
            { name: 'Espada Corta', type: 'weapon' },
            { name: 'Instrumento Musical', type: 'focus' },
            { name: 'Armadura de Cuero', type: 'armor' },
            { name: 'Paquete de Animador', type: 'pack' }
        ],
        mapSymbol: '♪'
    },
    {
        id: 'cleric',
        name: 'Clérigo',
        description: 'Un campeón de la fe que canaliza el poder divino para proteger a los inocentes y castigar al mal.',
        hitDie: 8,
        primaryAbility: 'SAB',
        savingThrows: ['SAB', 'CAR'],
        armorProficiencies: ['Ligera', 'Media', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 2, from: ['Historia', 'Medicina', 'Perspicacia', 'Persuasión', 'Religión'] },
        startingHP: 8,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Puedes preparar hechizos de la lista de Clérigo. SAB es tu aptitud mágica. Conoces 3 cantrips.' },
            { name: 'Canalizar Divinidad', desc: 'Puedes canalizar energía divina. Todos los clérigos pueden Expulsar Muertos Vivientes. 1 uso/DL.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'SAB',
        cantripsKnown: 3,
        preparedCaster: true,
        spellSlots: { 1: 2 },
        spellList: 'cleric',
        equipment: [
            { name: 'Maza', type: 'weapon' },
            { name: 'Cota de Malla', type: 'armor' },
            { name: 'Escudo', type: 'armor' },
            { name: 'Símbolo Sagrado', type: 'focus' },
            { name: 'Paquete de Sacerdote', type: 'pack' }
        ],
        mapSymbol: '✚'
    },
    {
        id: 'druid',
        name: 'Druida',
        description: 'Un guardián de la naturaleza que empuña el poder primordial de la tierra, el mar y el cielo.',
        hitDie: 8,
        primaryAbility: 'SAB',
        savingThrows: ['INT', 'SAB'],
        armorProficiencies: ['Ligera', 'Media', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 2, from: ['Arcanos', 'Medicina', 'Naturaleza', 'Percepción', 'Perspicacia', 'Religión', 'Supervivencia', 'Trato con Animales'] },
        startingHP: 8,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Puedes preparar hechizos de la lista de Druida. SAB es tu aptitud mágica. Conoces 2 cantrips.' },
            { name: 'Hablar Druídico', desc: 'Conoces el lenguaje secreto de los druidas.' },
            { name: 'Compañero Primigenio', desc: 'Puedes canalizar magia para invocar un espíritu animal.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'SAB',
        cantripsKnown: 2,
        preparedCaster: true,
        spellSlots: { 1: 2 },
        spellList: 'druid',
        equipment: [
            { name: 'Bastón', type: 'weapon' },
            { name: 'Armadura de Cuero', type: 'armor' },
            { name: 'Escudo', type: 'armor' },
            { name: 'Foco Druídico', type: 'focus' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '❀'
    },
    {
        id: 'fighter',
        name: 'Guerrero',
        description: 'Un maestro del combate entrenado en toda arma y armadura, capaz de dominar cualquier campo de batalla.',
        hitDie: 10,
        primaryAbility: 'FUE o DES',
        savingThrows: ['FUE', 'CON'],
        armorProficiencies: ['Ligera', 'Media', 'Pesada', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas', 'Armas Marciales'],
        skillChoices: { count: 2, from: ['Acrobacia', 'Atletismo', 'Historia', 'Intimidación', 'Percepción', 'Perspicacia', 'Supervivencia', 'Trato con Animales'] },
        startingHP: 10,
        features: [
            { name: 'Estilo de Combate', desc: 'Adoptas un estilo de combate: Defensa (+1 CA), Duelo (+2 daño), Gran Arma (repite 1-2 en dados de daño), o Combate con Dos Armas.' },
            { name: 'Segundo Aliento', desc: 'Como Acción Adicional, recuperas 1d10 + nivel PG. 2 usos/DL.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 3 armas.' }
        ],
        fightingStyles: [
            { id: 'defense', name: 'Defensa', desc: '+1 a CA cuando llevas armadura.' },
            { id: 'dueling', name: 'Duelo', desc: '+2 al daño con arma cuerpo a cuerpo en una mano (sin otra arma).' },
            { id: 'great_weapon', name: 'Combate con Arma Grande', desc: 'Repite dados de daño de 1-2 con armas a dos manos.' },
            { id: 'two_weapon', name: 'Combate con Dos Armas', desc: 'Añades mod de habilidad al daño del segundo ataque.' }
        ],
        spellcaster: false,
        equipment: [
            { name: 'Cota de Malla', type: 'armor' },
            { name: 'Espada Larga', type: 'weapon' },
            { name: 'Escudo', type: 'armor' },
            { name: 'Ballesta Ligera + 20 virotes', type: 'weapon' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '⚔'
    },
    {
        id: 'monk',
        name: 'Monje',
        description: 'Un artista marcial que canaliza su energía interior (Ki) para realizar proezas sobrehumanas.',
        hitDie: 8,
        primaryAbility: 'DES y SAB',
        savingThrows: ['FUE', 'DES'],
        armorProficiencies: [],
        weaponProficiencies: ['Armas Sencillas', 'Armas Marciales (Ligeras)'],
        skillChoices: { count: 2, from: ['Acrobacia', 'Atletismo', 'Historia', 'Perspicacia', 'Religión', 'Sigilo'] },
        startingHP: 8,
        features: [
            { name: 'Artes Marciales', desc: 'Puedes usar DES en lugar de FUE para ataques desarmados y armas de Monje. Tu dado de daño desarmado es 1d6.' },
            { name: 'Defensa sin Armadura', desc: 'Sin armadura: CA = 10 + mod DES + mod SAB.' },
            { name: 'Puntos de Disciplina', desc: 'Tienes puntos de Ki igual a tu nivel para alimentar habilidades especiales.' }
        ],
        spellcaster: false,
        equipment: [
            { name: 'Espada Corta', type: 'weapon' },
            { name: '10 Dardos', type: 'weapon' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '☯'
    },
    {
        id: 'paladin',
        name: 'Paladín',
        description: 'Un guerrero sagrado que jura un juramento solemne y empuña poder divino contra las fuerzas del mal.',
        hitDie: 10,
        primaryAbility: 'FUE y CAR',
        savingThrows: ['SAB', 'CAR'],
        armorProficiencies: ['Ligera', 'Media', 'Pesada', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas', 'Armas Marciales'],
        skillChoices: { count: 2, from: ['Atletismo', 'Intimidación', 'Medicina', 'Persuasión', 'Religión'] },
        startingHP: 10,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Preparas hechizos de la lista de Paladín. CAR es tu aptitud mágica.' },
            { name: 'Imposición de Manos', desc: 'Tienes una reserva de curación de 5 × nivel PG. Puedes curar tocando a una criatura.' },
            { name: 'Sentido Divino', desc: 'Como Acción Adicional, puedes detectar celestiales, demonios y muertos vivientes en 60 pies.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 2 armas.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'CAR',
        preparedCaster: true,
        cantripsKnown: 0,
        spellSlots: { 1: 2 },
        spellList: 'paladin',
        equipment: [
            { name: 'Cota de Malla', type: 'armor' },
            { name: 'Espada Larga', type: 'weapon' },
            { name: 'Escudo', type: 'armor' },
            { name: 'Símbolo Sagrado', type: 'focus' },
            { name: '5 Jabalinas', type: 'weapon' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '⛨'
    },
    {
        id: 'ranger',
        name: 'Explorador',
        description: 'Un rastreador experto de las tierras salvajes que combina habilidad marcial con magia natural.',
        hitDie: 10,
        primaryAbility: 'DES y SAB',
        savingThrows: ['FUE', 'DES'],
        armorProficiencies: ['Ligera', 'Media', 'Escudos'],
        weaponProficiencies: ['Armas Sencillas', 'Armas Marciales'],
        skillChoices: { count: 3, from: ['Atletismo', 'Investigación', 'Naturaleza', 'Percepción', 'Perspicacia', 'Sigilo', 'Supervivencia', 'Trato con Animales'] },
        startingHP: 10,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Conoces 2 hechizos de Explorador de nivel 1. SAB es tu aptitud mágica.' },
            { name: 'Enemigo Predilecto', desc: 'Tienes ventaja en pruebas de Supervivencia para rastrear y de Inteligencia para recordar info sobre tu enemigo predilecto.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 2 armas.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'SAB',
        cantripsKnown: 0,
        spellsKnown: 2,
        spellSlots: { 1: 2 },
        spellList: 'ranger',
        equipment: [
            { name: 'Armadura de Cuero Tachonado', type: 'armor' },
            { name: 'Arco Largo + 20 flechas', type: 'weapon' },
            { name: '2 Espadas Cortas', type: 'weapon' },
            { name: 'Paquete de Explorador', type: 'pack' }
        ],
        mapSymbol: '➳'
    },
    {
        id: 'rogue',
        name: 'Pícaro',
        description: 'Un especialista en sigilo, trampas y ataques precisos que prospera en las sombras.',
        hitDie: 8,
        primaryAbility: 'DES',
        savingThrows: ['DES', 'INT'],
        armorProficiencies: ['Ligera'],
        weaponProficiencies: ['Armas Sencillas', 'Espada Corta', 'Ballesta de mano', 'Espada Larga', 'Estoque'],
        skillChoices: { count: 4, from: ['Acrobacia', 'Atletismo', 'Engaño', 'Interpretación', 'Intimidación', 'Investigación', 'Juego de Manos', 'Percepción', 'Perspicacia', 'Persuasión', 'Sigilo'] },
        startingHP: 8,
        features: [
            { name: 'Pericia', desc: 'Duplicas el bonus de competencia en 2 habilidades en las que seas competente.' },
            { name: 'Ataque Furtivo', desc: 'Una vez por turno, +1d6 daño extra cuando tienes ventaja o un aliado está junto al objetivo.' },
            { name: 'Jerga de Ladrones', desc: 'Conoces la jerga secreta de los ladrones.' },
            { name: 'Maestría con Armas', desc: 'Puedes usar la propiedad de Maestría de 2 armas.' }
        ],
        spellcaster: false,
        equipment: [
            { name: 'Estoque', type: 'weapon' },
            { name: 'Arco Corto + 20 flechas', type: 'weapon' },
            { name: 'Armadura de Cuero', type: 'armor' },
            { name: '2 Dagas', type: 'weapon' },
            { name: 'Herramientas de Ladrón', type: 'tools' },
            { name: 'Paquete de Ladrón', type: 'pack' }
        ],
        mapSymbol: '⚶'
    },
    {
        id: 'sorcerer',
        name: 'Hechicero',
        description: 'Un lanzador de conjuros innato cuyo poder mágico emana de su propia sangre o linaje.',
        hitDie: 6,
        primaryAbility: 'CAR',
        savingThrows: ['CON', 'CAR'],
        armorProficiencies: [],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 2, from: ['Arcanos', 'Engaño', 'Intimidación', 'Perspicacia', 'Persuasión', 'Religión'] },
        startingHP: 6,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Conoces 4 cantrips y 2 hechizos de nivel 1. CAR es tu aptitud mágica.' },
            { name: 'Puntos de Hechicería', desc: 'Tienes puntos de hechicería para potenciar hechizos con Metamagia.' },
            { name: 'Magia Innata', desc: 'Tu magia proviene de tu interior, no de estudio ni devoción.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'CAR',
        cantripsKnown: 4,
        spellsKnown: 2,
        spellSlots: { 1: 2 },
        spellList: 'sorcerer',
        equipment: [
            { name: 'Ballesta Ligera + 20 virotes', type: 'weapon' },
            { name: 'Foco Arcano', type: 'focus' },
            { name: 'Paquete de Explorador', type: 'pack' },
            { name: '2 Dagas', type: 'weapon' }
        ],
        mapSymbol: '✧'
    },
    {
        id: 'warlock',
        name: 'Brujo',
        description: 'Un lanzador de conjuros que obtiene su poder de un pacto con una entidad sobrenatural.',
        hitDie: 8,
        primaryAbility: 'CAR',
        savingThrows: ['SAB', 'CAR'],
        armorProficiencies: ['Ligera'],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 2, from: ['Arcanos', 'Engaño', 'Historia', 'Intimidación', 'Investigación', 'Naturaleza', 'Religión'] },
        startingHP: 8,
        features: [
            { name: 'Lanzamiento de Conjuros de Pacto', desc: 'Conoces 2 cantrips y 2 hechizos de nivel 1. Los espacios se recuperan en Descanso Corto. CAR es tu aptitud mágica.' },
            { name: 'Rayo Místico', desc: 'Conoces el cantrip Rayo Místico sin que cuente contra tu límite de cantrips.' },
            { name: 'Invocaciones Místicas', desc: 'Obtienes 1 invocación mística que potencia tus habilidades.' }
        ],
        spellcaster: true,
        spellcastingAbility: 'CAR',
        cantripsKnown: 2,
        spellsKnown: 2,
        spellSlots: { 1: 1 },
        pactMagic: true,
        spellList: 'warlock',
        equipment: [
            { name: 'Ballesta Ligera + 20 virotes', type: 'weapon' },
            { name: 'Foco Arcano', type: 'focus' },
            { name: 'Armadura de Cuero', type: 'armor' },
            { name: 'Paquete de Erudito', type: 'pack' },
            { name: '2 Dagas', type: 'weapon' }
        ],
        mapSymbol: '⍟'
    },
    {
        id: 'wizard',
        name: 'Mago',
        description: 'Un erudito arcano que domina la magia a través del estudio riguroso y la memorización de conjuros.',
        hitDie: 6,
        primaryAbility: 'INT',
        savingThrows: ['INT', 'SAB'],
        armorProficiencies: [],
        weaponProficiencies: ['Armas Sencillas'],
        skillChoices: { count: 2, from: ['Arcanos', 'Historia', 'Investigación', 'Medicina', 'Perspicacia', 'Religión'] },
        startingHP: 6,
        features: [
            { name: 'Lanzamiento de Conjuros', desc: 'Preparas hechizos de tu libro de conjuros. INT es tu aptitud mágica. Conoces 3 cantrips.' },
            { name: 'Libro de Conjuros', desc: 'Tienes un libro con 6 hechizos de nivel 1. Puedes copiar nuevos hechizos que encuentres.' },
            { name: 'Recuperación Arcana', desc: 'Una vez por DL, durante un Descanso Corto, recuperas espacios de conjuro (nivel total = mitad de tu nivel, redondeado arriba).' }
        ],
        spellcaster: true,
        spellcastingAbility: 'INT',
        cantripsKnown: 3,
        preparedCaster: true,
        spellbookSpells: 6,
        spellSlots: { 1: 2 },
        spellList: 'wizard',
        equipment: [
            { name: 'Bastón', type: 'weapon' },
            { name: 'Foco Arcano', type: 'focus' },
            { name: 'Libro de Conjuros', type: 'focus' },
            { name: 'Paquete de Erudito', type: 'pack' }
        ],
        mapSymbol: '☆'
    }
];

export function getClassById(id) {
    return CLASSES.find(c => c.id === id);
}
