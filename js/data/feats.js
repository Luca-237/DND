// ============================================
// DOTES DE ORIGEN — D&D 2024 Player's Handbook
// Feats disponibles a nivel 1 (Origin Feats)
// ============================================

export const ORIGIN_FEATS = [
    {
        id: 'alert',
        name: 'Alerta',
        description: 'Siempre estás en guardia, listo para reaccionar al peligro.',
        effects: [
            '+2 a Iniciativa.',
            'No puedes ser sorprendido mientras estés consciente.',
            'Puedes intercambiar tu Iniciativa con la de un aliado voluntario.'
        ]
    },
    {
        id: 'crafter',
        name: 'Artífice',
        description: 'Eres un artesano habilidoso, capaz de fabricar objetos con eficiencia.',
        effects: [
            'Ganas competencia con 3 herramientas de Artesano de tu elección.',
            'Descuento del 20% al fabricar objetos no mágicos.',
            'Puedes desmontar objetos mágicos durante un Descanso Largo para extraer materiales.'
        ]
    },
    {
        id: 'healer',
        name: 'Sanador',
        description: 'Tienes un don natural para curar heridas y tratar enfermedades.',
        effects: [
            'Cuando usas un Kit de Sanador para estabilizar, el objetivo recupera 1 PG.',
            'Como Acción, puedes gastar un uso del Kit de Sanador para curar 2d6 + nivel PG (1/Descanso por criatura).'
        ]
    },
    {
        id: 'lucky',
        name: 'Afortunado',
        description: 'La suerte parece sonreírte en los momentos más cruciales.',
        effects: [
            'Tienes Puntos de Suerte igual a tu bonus de competencia.',
            'Puedes gastar un Punto de Suerte después de tirar para añadir o restar 1d4 al resultado.',
            'Los Puntos de Suerte se recuperan en un Descanso Largo.'
        ]
    },
    {
        id: 'magic_initiate_cleric',
        name: 'Iniciado en la Magia (Clérigo)',
        description: 'Has aprendido los rudimentos de la magia divina.',
        effects: [
            'Aprendes 2 cantrips de la lista de Clérigo.',
            'Aprendes 1 hechizo de nivel 1 de la lista de Clérigo (1 uso gratis/DL, o con espacios).',
            'SAB es tu aptitud mágica para estos hechizos.'
        ],
        grantedCantrips: 2,
        grantedSpells: 1,
        spellList: 'cleric'
    },
    {
        id: 'magic_initiate_druid',
        name: 'Iniciado en la Magia (Druida)',
        description: 'Has conectado con la magia de la naturaleza.',
        effects: [
            'Aprendes 2 cantrips de la lista de Druida.',
            'Aprendes 1 hechizo de nivel 1 de la lista de Druida (1 uso gratis/DL, o con espacios).',
            'SAB es tu aptitud mágica para estos hechizos.'
        ],
        grantedCantrips: 2,
        grantedSpells: 1,
        spellList: 'druid'
    },
    {
        id: 'magic_initiate_wizard',
        name: 'Iniciado en la Magia (Mago)',
        description: 'Has estudiado los fundamentos de la magia arcana.',
        effects: [
            'Aprendes 2 cantrips de la lista de Mago.',
            'Aprendes 1 hechizo de nivel 1 de la lista de Mago (1 uso gratis/DL, o con espacios).',
            'INT es tu aptitud mágica para estos hechizos.'
        ],
        grantedCantrips: 2,
        grantedSpells: 1,
        spellList: 'wizard'
    },
    {
        id: 'musician',
        name: 'Músico',
        description: 'Tienes un talento natural para la música que inspira a quienes te rodean.',
        effects: [
            'Ganas competencia con 3 instrumentos musicales de tu elección.',
            'Después de un Descanso Corto o Largo en el que toques, tú y tus aliados ganan Inspiración (Punto de Heroísmo).'
        ]
    },
    {
        id: 'savage_attacker',
        name: 'Atacante Salvaje',
        description: 'Tu ferocidad en combate te permite golpear con fuerza devastadora.',
        effects: [
            'Una vez por turno cuando haces daño con un arma, puedes tirar los dados de daño dos veces y usar el mejor resultado.'
        ]
    },
    {
        id: 'skilled',
        name: 'Habilidoso',
        description: 'Tu amplia experiencia te ha otorgado competencia en múltiples campos.',
        effects: [
            'Ganas competencia en 3 habilidades o herramientas de tu elección (cualquier combinación).'
        ]
    },
    {
        id: 'tavern_brawler',
        name: 'Luchador de Taberna',
        description: 'Estás acostumbrado a los combates improvisados en lugares estrechos.',
        effects: [
            'Tu daño desarmado aumenta a 1d4.',
            'Puedes empujar a una criatura 5 pies cuando la golpeas con un ataque desarmado.',
            'Competencia con armas improvisadas.',
            'Puedes usar una Acción Adicional para agarrar después de golpear desarmado.'
        ]
    },
    {
        id: 'tough',
        name: 'Resistente',
        description: 'Tu cuerpo es excepcionalmente resistente al castigo físico.',
        effects: [
            'Tu máximo de puntos de golpe aumenta en 2 × tu nivel.',
            'Cada vez que subes de nivel, ganas 2 PG adicionales.'
        ]
    }
];

export function getFeatById(id) {
    return ORIGIN_FEATS.find(f => f.id === id);
}
