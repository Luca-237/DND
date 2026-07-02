// ============================================
// AbilityScores — Sistema de puntuaciones
// ============================================

export const ABILITIES = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR'];

export const ABILITY_NAMES = {
    FUE: 'Fuerza',
    DES: 'Destreza',
    CON: 'Constitución',
    INT: 'Inteligencia',
    SAB: 'Sabiduría',
    CAR: 'Carisma'
};

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Costos del Point Buy (27 puntos disponibles)
export const POINT_BUY_COSTS = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

export const POINT_BUY_TOTAL = 27;

/**
 * Calcula el modificador de una puntuación
 * @param {number} score
 * @returns {number}
 */
export function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

/**
 * Formatea el modificador con signo
 * @param {number} score
 * @returns {string}
 */
export function formatModifier(score) {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Calcula el costo total de Point Buy
 * @param {Object} scores - { FUE: 15, DES: 14, ... }
 * @returns {number}
 */
export function calculatePointBuyCost(scores) {
    let total = 0;
    for (const ability of ABILITIES) {
        const score = scores[ability] || 8;
        total += POINT_BUY_COSTS[score] || 0;
    }
    return total;
}

/**
 * Calcula la Clase de Armadura base
 * @param {Object} character
 * @returns {number}
 */
export function calculateAC(character) {
    const dexMod = getModifier(character.abilityScores.DES);

    // Sin armadura
    if (!character.equippedArmor) {
        // Monje: 10 + DES + SAB
        if (character.classId === 'monk') {
            return 10 + dexMod + getModifier(character.abilityScores.SAB);
        }
        // Bárbaro: 10 + DES + CON
        if (character.classId === 'barbarian') {
            return 10 + dexMod + getModifier(character.abilityScores.CON);
        }
        return 10 + dexMod;
    }

    // Con armadura
    const armor = character.equippedArmor;
    let ac = 0;

    if (armor.type === 'Ligera') {
        ac = parseInt(armor.ac) + dexMod;
    } else if (armor.type === 'Media') {
        ac = parseInt(armor.ac) + Math.min(dexMod, 2);
    } else if (armor.type === 'Pesada') {
        ac = parseInt(armor.ac);
    }

    // Escudo
    if (character.hasShield) {
        ac += 2;
    }

    return ac;
}

/**
 * Calcula el bonus de competencia por nivel
 * @param {number} level
 * @returns {number}
 */
export function getProficiencyBonus(level) {
    if (level <= 4) return 2;
    if (level <= 8) return 3;
    if (level <= 12) return 4;
    if (level <= 16) return 5;
    return 6;
}

// Lista de habilidades (skills) y su ability asociada
export const SKILLS = {
    'Acrobacia': 'DES',
    'Arcanos': 'INT',
    'Atletismo': 'FUE',
    'Engaño': 'CAR',
    'Historia': 'INT',
    'Interpretación': 'CAR',
    'Intimidación': 'CAR',
    'Investigación': 'INT',
    'Juego de Manos': 'DES',
    'Medicina': 'SAB',
    'Naturaleza': 'INT',
    'Percepción': 'SAB',
    'Perspicacia': 'SAB',
    'Persuasión': 'CAR',
    'Religión': 'INT',
    'Sigilo': 'DES',
    'Supervivencia': 'SAB',
    'Trato con Animales': 'SAB'
};
