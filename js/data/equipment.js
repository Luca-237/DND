// ============================================
// EQUIPO — D&D 2024 Player's Handbook
// Armas, Armaduras y Objetos
// ============================================

export const WEAPONS = {
    simple_melee: [
        { id: 'club', name: 'Garrote', damage: '1d4', damageType: 'Contundente', properties: ['Ligera'], weight: 2, cost: '1 ps', mastery: 'Lenta' },
        { id: 'dagger', name: 'Daga', damage: '1d4', damageType: 'Perforante', properties: ['Ligera', 'Sutil', 'Arrojadiza (20/60)'], weight: 1, cost: '2 po', mastery: 'Cortar' },
        { id: 'greatclub', name: 'Gran Garrote', damage: '1d8', damageType: 'Contundente', properties: ['Dos manos'], weight: 10, cost: '2 ps', mastery: 'Empujar' },
        { id: 'handaxe', name: 'Hacha de Mano', damage: '1d6', damageType: 'Cortante', properties: ['Ligera', 'Arrojadiza (20/60)'], weight: 2, cost: '5 po', mastery: 'Cortar' },
        { id: 'javelin', name: 'Jabalina', damage: '1d6', damageType: 'Perforante', properties: ['Arrojadiza (30/120)'], weight: 2, cost: '5 ps', mastery: 'Lenta' },
        { id: 'light_hammer', name: 'Martillo Ligero', damage: '1d4', damageType: 'Contundente', properties: ['Ligera', 'Arrojadiza (20/60)'], weight: 2, cost: '2 po', mastery: 'Cortar' },
        { id: 'mace', name: 'Maza', damage: '1d6', damageType: 'Contundente', properties: [], weight: 4, cost: '5 po', mastery: 'Derribar' },
        { id: 'quarterstaff', name: 'Bastón', damage: '1d6', damageType: 'Contundente', properties: ['Versátil (1d8)'], weight: 4, cost: '2 ps', mastery: 'Derribar' },
        { id: 'sickle', name: 'Hoz', damage: '1d4', damageType: 'Cortante', properties: ['Ligera'], weight: 2, cost: '1 po', mastery: 'Cortar' },
        { id: 'spear', name: 'Lanza', damage: '1d6', damageType: 'Perforante', properties: ['Versátil (1d8)', 'Arrojadiza (20/60)'], weight: 3, cost: '1 po', mastery: 'Derribar' }
    ],
    simple_ranged: [
        { id: 'light_crossbow', name: 'Ballesta Ligera', damage: '1d8', damageType: 'Perforante', properties: ['Munición (80/320)', 'Dos manos', 'Recarga'], weight: 5, cost: '25 po', mastery: 'Lenta' },
        { id: 'dart', name: 'Dardo', damage: '1d4', damageType: 'Perforante', properties: ['Sutil', 'Arrojadiza (20/60)'], weight: 0.25, cost: '5 pc', mastery: 'Cortar' },
        { id: 'shortbow', name: 'Arco Corto', damage: '1d6', damageType: 'Perforante', properties: ['Munición (80/320)', 'Dos manos'], weight: 2, cost: '25 po', mastery: 'Lenta' },
        { id: 'sling', name: 'Honda', damage: '1d4', damageType: 'Contundente', properties: ['Munición (30/120)'], weight: 0, cost: '1 ps', mastery: 'Lenta' }
    ],
    martial_melee: [
        { id: 'battleaxe', name: 'Hacha de Batalla', damage: '1d8', damageType: 'Cortante', properties: ['Versátil (1d10)'], weight: 4, cost: '10 po', mastery: 'Derribar' },
        { id: 'flail', name: 'Mangual', damage: '1d8', damageType: 'Contundente', properties: [], weight: 2, cost: '10 po', mastery: 'Derribar' },
        { id: 'glaive', name: 'Guja', damage: '1d10', damageType: 'Cortante', properties: ['Pesada', 'Alcance', 'Dos manos'], weight: 6, cost: '20 po', mastery: 'Cortar' },
        { id: 'greataxe', name: 'Hacha Grande', damage: '1d12', damageType: 'Cortante', properties: ['Pesada', 'Dos manos'], weight: 7, cost: '30 po', mastery: 'Limpiar' },
        { id: 'greatsword', name: 'Espadón', damage: '2d6', damageType: 'Cortante', properties: ['Pesada', 'Dos manos'], weight: 6, cost: '50 po', mastery: 'Cortar' },
        { id: 'longsword', name: 'Espada Larga', damage: '1d8', damageType: 'Cortante', properties: ['Versátil (1d10)'], weight: 3, cost: '15 po', mastery: 'Derribar' },
        { id: 'maul', name: 'Mazo', damage: '2d6', damageType: 'Contundente', properties: ['Pesada', 'Dos manos'], weight: 10, cost: '10 po', mastery: 'Derribar' },
        { id: 'morningstar', name: 'Lucero del Alba', damage: '1d8', damageType: 'Perforante', properties: [], weight: 4, cost: '15 po', mastery: 'Derribar' },
        { id: 'rapier', name: 'Estoque', damage: '1d8', damageType: 'Perforante', properties: ['Sutil'], weight: 2, cost: '25 po', mastery: 'Cortar' },
        { id: 'scimitar', name: 'Cimitarra', damage: '1d6', damageType: 'Cortante', properties: ['Ligera', 'Sutil'], weight: 3, cost: '25 po', mastery: 'Cortar' },
        { id: 'shortsword', name: 'Espada Corta', damage: '1d6', damageType: 'Perforante', properties: ['Ligera', 'Sutil'], weight: 2, cost: '10 po', mastery: 'Cortar' },
        { id: 'trident', name: 'Tridente', damage: '1d8', damageType: 'Perforante', properties: ['Versátil (1d10)', 'Arrojadiza (20/60)'], weight: 4, cost: '5 po', mastery: 'Derribar' },
        { id: 'warhammer', name: 'Martillo de Guerra', damage: '1d8', damageType: 'Contundente', properties: ['Versátil (1d10)'], weight: 2, cost: '15 po', mastery: 'Empujar' },
        { id: 'whip', name: 'Látigo', damage: '1d4', damageType: 'Cortante', properties: ['Alcance', 'Sutil'], weight: 3, cost: '2 po', mastery: 'Lenta' }
    ],
    martial_ranged: [
        { id: 'hand_crossbow', name: 'Ballesta de Mano', damage: '1d6', damageType: 'Perforante', properties: ['Ligera', 'Munición (30/120)', 'Recarga'], weight: 3, cost: '75 po', mastery: 'Cortar' },
        { id: 'heavy_crossbow', name: 'Ballesta Pesada', damage: '1d10', damageType: 'Perforante', properties: ['Munición (100/400)', 'Pesada', 'Dos manos', 'Recarga'], weight: 18, cost: '50 po', mastery: 'Empujar' },
        { id: 'longbow', name: 'Arco Largo', damage: '1d8', damageType: 'Perforante', properties: ['Munición (150/600)', 'Pesada', 'Dos manos'], weight: 2, cost: '50 po', mastery: 'Lenta' }
    ]
};

export const ARMOR = [
    { id: 'padded', name: 'Acolchada', type: 'Ligera', ac: '11 + DES', stealthDisadvantage: true, cost: '5 po', weight: 8 },
    { id: 'leather', name: 'Cuero', type: 'Ligera', ac: '11 + DES', stealthDisadvantage: false, cost: '10 po', weight: 10 },
    { id: 'studded_leather', name: 'Cuero Tachonado', type: 'Ligera', ac: '12 + DES', stealthDisadvantage: false, cost: '45 po', weight: 13 },
    { id: 'hide', name: 'Pieles', type: 'Media', ac: '12 + DES (máx 2)', stealthDisadvantage: false, cost: '10 po', weight: 12 },
    { id: 'chain_shirt', name: 'Camisa de Malla', type: 'Media', ac: '13 + DES (máx 2)', stealthDisadvantage: false, cost: '50 po', weight: 20 },
    { id: 'scale_mail', name: 'Cota de Escamas', type: 'Media', ac: '14 + DES (máx 2)', stealthDisadvantage: true, cost: '50 po', weight: 45 },
    { id: 'breastplate', name: 'Coraza', type: 'Media', ac: '14 + DES (máx 2)', stealthDisadvantage: false, cost: '400 po', weight: 20 },
    { id: 'half_plate', name: 'Media Armadura', type: 'Media', ac: '15 + DES (máx 2)', stealthDisadvantage: true, cost: '750 po', weight: 40 },
    { id: 'ring_mail', name: 'Cota de Anillas', type: 'Pesada', ac: '14', stealthDisadvantage: true, cost: '30 po', weight: 40, strReq: 0 },
    { id: 'chain_mail', name: 'Cota de Malla', type: 'Pesada', ac: '16', stealthDisadvantage: true, cost: '75 po', weight: 55, strReq: 13 },
    { id: 'splint', name: 'Armadura de Bandas', type: 'Pesada', ac: '17', stealthDisadvantage: true, cost: '200 po', weight: 60, strReq: 15 },
    { id: 'plate', name: 'Armadura de Placas', type: 'Pesada', ac: '18', stealthDisadvantage: true, cost: '1500 po', weight: 65, strReq: 15 },
    { id: 'shield', name: 'Escudo', type: 'Escudo', ac: '+2', stealthDisadvantage: false, cost: '10 po', weight: 6 }
];

export const ADVENTURING_GEAR = [
    { id: 'torch', name: 'Antorcha', cost: '1 pc', weight: 1, description: 'Ilumina 20 pies (brillante) + 20 pies (tenue). Dura 1 hora.' },
    { id: 'rope_silk', name: 'Cuerda de Seda (50 pies)', cost: '10 po', weight: 5, description: '50 pies de cuerda resistente.' },
    { id: 'rope_hemp', name: 'Cuerda de Cáñamo (50 pies)', cost: '1 po', weight: 10, description: '50 pies de cuerda básica.' },
    { id: 'rations', name: 'Raciones (1 día)', cost: '5 ps', weight: 2, description: 'Comida empaquetada para un día.' },
    { id: 'waterskin', name: 'Cantimplora', cost: '2 ps', weight: 5, description: 'Contiene agua para un día.' },
    { id: 'bedroll', name: 'Saco de Dormir', cost: '1 po', weight: 7, description: 'Para descansar cómodamente.' },
    { id: 'backpack', name: 'Mochila', cost: '2 po', weight: 5, description: 'Puede guardar 30 libras de equipo.' },
    { id: 'tinderbox', name: 'Yesquero', cost: '5 ps', weight: 1, description: 'Para encender fuego.' },
    { id: 'lantern', name: 'Linterna', cost: '10 po', weight: 2, description: 'Ilumina 30 pies brillante + 30 tenue. Dura 6 horas.' },
    { id: 'healers_kit', name: 'Kit de Sanador', cost: '5 po', weight: 3, description: '10 usos. Permite estabilizar a 0 PG sin prueba de Medicina.' },
    { id: 'potion_healing', name: 'Poción de Curación', cost: '50 po', weight: 0.5, description: 'Recuperas 2d4+2 PG al beberla.' },
    { id: 'thieves_tools', name: 'Herramientas de Ladrón', cost: '25 po', weight: 1, description: 'Necesarias para abrir cerraduras y desactivar trampas.' },
    { id: 'holy_symbol', name: 'Símbolo Sagrado', cost: '5 po', weight: 1, description: 'Foco de conjuración para clérigos y paladines.' },
    { id: 'arcane_focus', name: 'Foco Arcano', cost: '10 po', weight: 1, description: 'Cristal, orbe o varita. Foco para hechiceros y magos.' },
    { id: 'component_pouch', name: 'Bolsa de Componentes', cost: '25 po', weight: 2, description: 'Contiene componentes materiales para conjuros.' },
    { id: 'old_scroll', name: 'Viejo Pergamino', cost: '0 po', weight: 0.1, description: 'Un pergamino antiguo con extraños símbolos. Parece contener instrucciones o un mapa vago hacia las profundidades de las catacumbas.' }
];

export function getWeaponById(id) {
    const all = [
        ...WEAPONS.simple_melee, ...WEAPONS.simple_ranged,
        ...WEAPONS.martial_melee, ...WEAPONS.martial_ranged
    ];
    return all.find(w => w.id === id);
}

export function getArmorById(id) {
    return ARMOR.find(a => a.id === id);
}

export function getEquipmentById(idOrName) {
    const allWeapons = [
        ...WEAPONS.simple_melee, ...WEAPONS.simple_ranged,
        ...WEAPONS.martial_melee, ...WEAPONS.martial_ranged
    ];
    let item = allWeapons.find(w => w.id === idOrName || w.name.toLowerCase() === idOrName.toLowerCase());
    if (item) return { ...item, equipType: 'weapon' };

    item = ARMOR.find(a => a.id === idOrName || a.name.toLowerCase() === idOrName.toLowerCase());
    if (item) return { ...item, equipType: 'armor' };

    item = ADVENTURING_GEAR.find(a => a.id === idOrName || a.name.toLowerCase() === idOrName.toLowerCase());
    if (item) return { ...item, equipType: 'gear' };

    return null;
}
