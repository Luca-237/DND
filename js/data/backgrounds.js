// ============================================
// TRASFONDOS — D&D 2024 Player's Handbook
// En 2024, el trasfondo da los +2/+1 a ability scores
// y otorga un Dote de Origen (nivel 1)
// ============================================

export const BACKGROUNDS = [
    {
        id: 'acolyte',
        name: 'Acólito',
        description: 'Pasaste tu juventud en un templo, dedicado al servicio de un dios.',
        abilityScoreOptions: 'Elige +2 a una y +1 a otra (o +1/+1/+1)',
        suggestedAbilities: ['SAB', 'CAR'],
        skillProficiencies: ['Perspicacia', 'Religión'],
        toolProficiency: 'Herramientas de Caligrafía',
        languages: 1,
        originFeat: 'magic_initiate_cleric',
        equipment: ['Símbolo sagrado', 'Libro de oraciones', 'Incienso (5)', 'Vestiduras', '15 po']
    },
    {
        id: 'artisan',
        name: 'Artesano',
        description: 'Aprendiste un oficio de un maestro artesano y te ganaste la vida con tu habilidad.',
        suggestedAbilities: ['FUE', 'INT'],
        skillProficiencies: ['Investigación', 'Persuasión'],
        toolProficiency: 'Herramientas de Artesano (elige una)',
        languages: 0,
        originFeat: 'crafter',
        equipment: ['Herramientas de artesano', 'Carta de presentación del gremio', 'Ropa de viaje', '15 po']
    },
    {
        id: 'charlatan',
        name: 'Charlatán',
        description: 'Siempre has tenido facilidad para engañar a la gente y vivir de tu ingenio.',
        suggestedAbilities: ['CAR', 'DES'],
        skillProficiencies: ['Engaño', 'Juego de Manos'],
        toolProficiency: 'Kit de Falsificación',
        languages: 0,
        originFeat: 'skilled',
        equipment: ['Ropa fina', 'Kit de disfraz', 'Herramientas de estafador', '15 po']
    },
    {
        id: 'criminal',
        name: 'Criminal',
        description: 'Viviste fuera de la ley, sobreviviendo en las sombras de la sociedad.',
        suggestedAbilities: ['DES', 'INT'],
        skillProficiencies: ['Sigilo', 'Engaño'],
        toolProficiency: 'Herramientas de Ladrón',
        languages: 0,
        originFeat: 'alert',
        equipment: ['Palanca', 'Ropa oscura con capucha', '15 po']
    },
    {
        id: 'entertainer',
        name: 'Animador',
        description: 'Prosperaste frente al público, cautivando audiencias con tu arte.',
        suggestedAbilities: ['CAR', 'DES'],
        skillProficiencies: ['Acrobacia', 'Interpretación'],
        toolProficiency: 'Instrumento Musical (elige uno)',
        languages: 0,
        originFeat: 'musician',
        equipment: ['Instrumento musical', 'Disfraz', 'Ropa de viaje', '15 po']
    },
    {
        id: 'farmer',
        name: 'Granjero',
        description: 'Creciste trabajando la tierra, endurecido por el trabajo honesto bajo el sol.',
        suggestedAbilities: ['CON', 'SAB'],
        skillProficiencies: ['Trato con Animales', 'Naturaleza'],
        toolProficiency: 'Herramientas de Carpintero',
        languages: 0,
        originFeat: 'tough',
        equipment: ['Pala', 'Azada', 'Ropa de trabajo', '15 po']
    },
    {
        id: 'guard',
        name: 'Guardia',
        description: 'Serviste como guardia de la ciudad, protegiendo a los ciudadanos y manteniendo el orden.',
        suggestedAbilities: ['FUE', 'CON'],
        skillProficiencies: ['Atletismo', 'Percepción'],
        toolProficiency: 'Set de Juegos (elige uno)',
        languages: 0,
        originFeat: 'alert',
        equipment: ['Insignia de guardia', 'Esposas', 'Uniforme', '15 po']
    },
    {
        id: 'guide',
        name: 'Guía',
        description: 'Conoces los caminos de la naturaleza salvaje y has guiado a otros por territorios peligrosos.',
        suggestedAbilities: ['DES', 'SAB'],
        skillProficiencies: ['Sigilo', 'Supervivencia'],
        toolProficiency: 'Herramientas de Cartógrafo',
        languages: 0,
        originFeat: 'lucky',
        equipment: ['Mapa de la región', 'Brújula', 'Ropa de viaje', '15 po']
    },
    {
        id: 'hermit',
        name: 'Ermitaño',
        description: 'Viviste en reclusión, dedicado a la contemplación y al estudio de misterios profundos.',
        suggestedAbilities: ['SAB', 'CON'],
        skillProficiencies: ['Medicina', 'Religión'],
        toolProficiency: 'Kit de Herboristería',
        languages: 0,
        originFeat: 'healer',
        equipment: ['Pergamino con anotaciones', 'Manta de invierno', 'Kit de herboristería', '5 po']
    },
    {
        id: 'merchant',
        name: 'Mercader',
        description: 'Compraste y vendiste bienes, viajando por rutas comerciales y negociando en los mercados.',
        suggestedAbilities: ['CAR', 'INT'],
        skillProficiencies: ['Perspicacia', 'Persuasión'],
        toolProficiency: 'Herramientas de Navegante',
        languages: 1,
        originFeat: 'lucky',
        equipment: ['Balanza', 'Ropa de mercader', 'Carro pequeño', '25 po']
    },
    {
        id: 'noble',
        name: 'Noble',
        description: 'Naciste en una familia de alto rango, acostumbrado al privilegio y a la política.',
        suggestedAbilities: ['CAR', 'INT'],
        skillProficiencies: ['Historia', 'Persuasión'],
        toolProficiency: 'Set de Juegos (elige uno)',
        languages: 1,
        originFeat: 'skilled',
        equipment: ['Ropa fina', 'Anillo de sello', 'Pergamino de linaje', '25 po']
    },
    {
        id: 'sage',
        name: 'Sabio',
        description: 'Dedicaste años al estudio, acumulando conocimiento sobre los misterios del mundo.',
        suggestedAbilities: ['INT', 'SAB'],
        skillProficiencies: ['Arcanos', 'Historia'],
        toolProficiency: 'Herramientas de Caligrafía',
        languages: 2,
        originFeat: 'magic_initiate_wizard',
        equipment: ['Tinta y pluma', 'Pergamino (10)', 'Ropa de erudito', '10 po']
    },
    {
        id: 'sailor',
        name: 'Marinero',
        description: 'Navegaste los mares, enfrentando tormentas y criaturas marinas en alta mar.',
        suggestedAbilities: ['FUE', 'DES'],
        skillProficiencies: ['Acrobacia', 'Percepción'],
        toolProficiency: 'Herramientas de Navegante',
        languages: 0,
        originFeat: 'tavern_brawler',
        equipment: ['Cuerda de seda (50 pies)', 'Amuleto de la suerte', 'Ropa de marinero', '10 po']
    },
    {
        id: 'scribe',
        name: 'Escriba',
        description: 'Trabajaste como copista o cronista, registrando la historia y el conocimiento.',
        suggestedAbilities: ['INT', 'SAB'],
        skillProficiencies: ['Historia', 'Investigación'],
        toolProficiency: 'Herramientas de Caligrafía',
        languages: 1,
        originFeat: 'skilled',
        equipment: ['Tinta y pluma', 'Diario', 'Ropa de erudito', '15 po']
    },
    {
        id: 'soldier',
        name: 'Soldado',
        description: 'Serviste en un ejército, entrenado para la guerra y curtido en batalla.',
        suggestedAbilities: ['FUE', 'CON'],
        skillProficiencies: ['Atletismo', 'Intimidación'],
        toolProficiency: 'Set de Juegos (elige uno)',
        languages: 0,
        originFeat: 'savage_attacker',
        equipment: ['Insignia militar', 'Trofeo de enemigo', 'Set de dados', 'Ropa común', '10 po']
    },
    {
        id: 'wayfarer',
        name: 'Vagabundo',
        description: 'Has viajado sin rumbo fijo, sobreviviendo con ingenio y la bondad de desconocidos.',
        suggestedAbilities: ['DES', 'SAB'],
        skillProficiencies: ['Perspicacia', 'Sigilo'],
        toolProficiency: 'Herramientas de Ladrón',
        languages: 0,
        originFeat: 'lucky',
        equipment: ['Manta de viaje', 'Ropa de viajero', 'Cantimplora', '12 po']
    }
];

export function getBackgroundById(id) {
    return BACKGROUNDS.find(b => b.id === id);
}
