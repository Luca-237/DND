// ============================================
// HECHIZOS — D&D 2024 (Cantrips + Nivel 1)
// Organizados por lista de clase
// ============================================

export const SPELLS = {
    // ========== CANTRIPS ==========
    cantrips: [
        // --- Bardo ---
        { id: 'blade_ward', name: 'Custodia de Cuchillas', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Abjuración', castTime: 'Acción', range: 'Personal', duration: '1 asalto', description: 'Ganas resistencia a daño contundente, cortante y perforante hasta tu próximo turno.' },
        { id: 'friends', name: 'Amigos', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Encantamiento', castTime: 'Acción', range: 'Toque', duration: 'Concentración, 1 min', description: 'Ganas ventaja en pruebas de Carisma contra una criatura. Al terminar, la criatura sabe que la encantaste.' },
        { id: 'light', name: 'Luz', level: 0, lists: ['bard', 'cleric', 'sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: 'Toque', duration: '1 hora', description: 'Un objeto que toques emite luz brillante en un radio de 20 pies.' },
        { id: 'mage_hand', name: 'Mano de Mago', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Conjuración', castTime: 'Acción', range: '30 pies', duration: '1 minuto', description: 'Creas una mano espectral flotante que puede manipular objetos a distancia.' },
        { id: 'message', name: 'Mensaje', level: 0, lists: ['bard', 'druid', 'sorcerer', 'wizard'], school: 'Transmutación', castTime: 'Acción', range: '120 pies', duration: '1 asalto', description: 'Susurras un mensaje que solo el objetivo puede escuchar. Puede responder de la misma forma.' },
        { id: 'minor_illusion', name: 'Ilusión Menor', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Ilusión', castTime: 'Acción', range: '30 pies', duration: '1 minuto', description: 'Creas un sonido o una imagen ilusoria dentro del alcance.' },
        { id: 'prestidigitation', name: 'Prestidigitación', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Transmutación', castTime: 'Acción', range: '10 pies', duration: '1 hora', description: 'Realizas un pequeño truco mágico: encender una vela, limpiar ropa, crear un efecto sensorial menor.' },
        { id: 'true_strike', name: 'Golpe Certero', level: 0, lists: ['bard', 'sorcerer', 'warlock', 'wizard'], school: 'Adivinación', castTime: 'Acción', range: 'Personal', duration: 'Instantáneo', description: 'Realizas un ataque con arma cuerpo a cuerpo. Si impactas, añades daño Radiante extra.' },
        { id: 'vicious_mockery', name: 'Burla Cruel', level: 0, lists: ['bard'], school: 'Encantamiento', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Desatas una cadena de insultos mágicos. El objetivo debe hacer una salvación de SAB o recibe 1d6 psíquico y tiene desventaja en su próximo ataque.' },

        // --- Clérigo ---
        { id: 'guidance', name: 'Guía', level: 0, lists: ['cleric', 'druid'], school: 'Adivinación', castTime: 'Acción', range: 'Toque', duration: 'Concentración, 1 min', description: 'El objetivo puede sumar 1d4 a una prueba de habilidad de su elección.' },
        { id: 'resistance', name: 'Resistencia', level: 0, lists: ['cleric', 'druid'], school: 'Abjuración', castTime: 'Acción', range: 'Toque', duration: 'Concentración, 1 min', description: 'El objetivo puede sumar 1d4 a una salvación de su elección.' },
        { id: 'sacred_flame', name: 'Llama Sagrada', level: 0, lists: ['cleric'], school: 'Evocación', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Llamas descienden sobre una criatura. Salvación de DES o 1d8 radiante. Ignora cobertura.' },
        { id: 'spare_the_dying', name: 'Piedad', level: 0, lists: ['cleric', 'druid'], school: 'Nigromancia', castTime: 'Acción', range: '15 pies', duration: 'Instantáneo', description: 'Una criatura a 0 PG se estabiliza automáticamente.' },
        { id: 'thaumaturgy', name: 'Taumaturgia', level: 0, lists: ['cleric'], school: 'Transmutación', castTime: 'Acción', range: '30 pies', duration: '1 minuto', description: 'Manifiestas un signo sobrenatural: voz atronadora, llamas parpadean, temblar el suelo.' },
        { id: 'toll_the_dead', name: 'Tañido de Muerte', level: 0, lists: ['cleric', 'warlock', 'wizard'], school: 'Nigromancia', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Salvación de SAB o 1d8 necrótico (1d12 si ya está herido).' },
        { id: 'word_of_radiance', name: 'Palabra Radiante', level: 0, lists: ['cleric'], school: 'Evocación', castTime: 'Acción', range: '5 pies', duration: 'Instantáneo', description: 'Cada criatura elegida a 5 pies: salvación de CON o 1d6 radiante.' },

        // --- Druida ---
        { id: 'druidcraft', name: 'Truco Druídico', level: 0, lists: ['druid'], school: 'Transmutación', castTime: 'Acción', range: '30 pies', duration: 'Instantáneo', description: 'Creas un efecto natural menor: predecir clima, hacer florecer una planta, efecto sensorial.' },
        { id: 'produce_flame', name: 'Producir Llama', level: 0, lists: ['druid'], school: 'Conjuración', castTime: 'Acción', range: 'Personal / 30 pies', duration: '10 minutos', description: 'Una llama aparece en tu mano (ilumina 20 pies). Puedes lanzarla: ataque ranged, 1d8 fuego.' },
        { id: 'shillelagh', name: 'Shillelagh', level: 0, lists: ['druid'], school: 'Transmutación', castTime: 'Acción Adicional', range: 'Toque', duration: '1 minuto', description: 'Un bastón o garrote usa tu aptitud mágica para ataque y daño, y su dado de daño es 1d8.' },
        { id: 'thorn_whip', name: 'Látigo de Espinas', level: 0, lists: ['druid'], school: 'Transmutación', castTime: 'Acción', range: '30 pies', duration: 'Instantáneo', description: 'Ataque de conjuro a distancia. 1d6 perforante y arrastras al objetivo 10 pies hacia ti.' },

        // --- Hechicero/Mago/Brujo ---
        { id: 'acid_splash', name: 'Salpicadura de Ácido', level: 0, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Lanzas una burbuja de ácido. 1 o 2 criaturas adyacentes: salvación de DES o 1d6 ácido.' },
        { id: 'chill_touch', name: 'Toque Gélido', level: 0, lists: ['sorcerer', 'warlock', 'wizard'], school: 'Nigromancia', castTime: 'Acción', range: '120 pies', duration: '1 asalto', description: 'Ataque de conjuro a distancia. 1d10 necrótico y el objetivo no puede recuperar PG hasta tu próximo turno.' },
        { id: 'eldritch_blast', name: 'Rayo Místico', level: 0, lists: ['warlock'], school: 'Evocación', castTime: 'Acción', range: '120 pies', duration: 'Instantáneo', description: 'Lanzas un rayo de energía. Ataque de conjuro a distancia, 1d10 de fuerza. Rayos adicionales a niveles superiores.' },
        { id: 'fire_bolt', name: 'Descarga de Fuego', level: 0, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: '120 pies', duration: 'Instantáneo', description: 'Lanzas un dardo de fuego. Ataque de conjuro a distancia, 1d10 de fuego.' },
        { id: 'poison_spray', name: 'Rociada de Veneno', level: 0, lists: ['druid', 'sorcerer', 'warlock', 'wizard'], school: 'Nigromancia', castTime: 'Acción', range: '30 pies', duration: 'Instantáneo', description: 'Exhalas una nube de gas venenoso. Salvación de CON o 1d12 veneno.' },
        { id: 'ray_of_frost', name: 'Rayo de Escarcha', level: 0, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Rayo gélido. Ataque de conjuro a distancia, 1d8 frío y -10 pies velocidad.' },
        { id: 'shocking_grasp', name: 'Agarre Electrizante', level: 0, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: 'Toque', duration: 'Instantáneo', description: 'Ataque de conjuro cuerpo a cuerpo, 1d8 relámpago. Ventaja si lleva armadura metálica.' },
    ],

    // ========== HECHIZOS NIVEL 1 ==========
    level1: [
        // --- Bardo ---
        { id: 'charm_person', name: 'Encantar Persona', level: 1, lists: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'], school: 'Encantamiento', castTime: 'Acción', range: '30 pies', duration: '1 hora', description: 'Un humanoide debe hacer salvación de SAB o quedarte encantado. Ventaja si estáis en combate.' },
        { id: 'cure_wounds', name: 'Curar Heridas', level: 1, lists: ['bard', 'cleric', 'druid', 'paladin', 'ranger'], school: 'Evocación', castTime: 'Acción', range: 'Toque', duration: 'Instantáneo', description: 'Curas 2d8 + mod aptitud mágica PG al tocar a una criatura.' },
        { id: 'dissonant_whispers', name: 'Susurros Disonantes', level: 1, lists: ['bard'], school: 'Encantamiento', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Susurras una melodía disonante. Salvación de SAB: 3d6 psíquico y debe huir (mitad y no huye en éxito).' },
        { id: 'faerie_fire', name: 'Fuego Feérico', level: 1, lists: ['bard', 'druid'], school: 'Evocación', castTime: 'Acción', range: '60 pies', duration: 'Concentración, 1 min', description: 'Criaturas en un cubo de 20 pies: salvación de DES o quedan delineadas por luz. Ataques contra ellas tienen ventaja.' },
        { id: 'healing_word', name: 'Palabra Sanadora', level: 1, lists: ['bard', 'cleric', 'druid'], school: 'Evocación', castTime: 'Acción Adicional', range: '60 pies', duration: 'Instantáneo', description: 'Una criatura que puedas ver recupera 2d4 + mod aptitud mágica PG.' },
        { id: 'heroism', name: 'Heroísmo', level: 1, lists: ['bard', 'paladin'], school: 'Encantamiento', castTime: 'Acción', range: 'Toque', duration: 'Concentración, 1 min', description: 'El objetivo es inmune al miedo y gana PG temporales iguales a tu mod de aptitud mágica al inicio de cada turno.' },
        { id: 'sleep', name: 'Dormir', level: 1, lists: ['bard', 'sorcerer', 'wizard'], school: 'Encantamiento', castTime: 'Acción', range: '60 pies', duration: '1 minuto', description: 'Criaturas en un área de 5 pies de radio deben hacer salvación de SAB o caer inconscientes.' },
        { id: 'thunderwave', name: 'Onda Atronadora', level: 1, lists: ['bard', 'druid', 'sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: 'Personal (cubo 15 pies)', duration: 'Instantáneo', description: 'Una onda de fuerza atronadora surge de ti. Salvación de CON: 2d8 trueno y empujadas 10 pies (mitad sin empuje).' },

        // --- Clérigo ---
        { id: 'bless', name: 'Bendición', level: 1, lists: ['cleric', 'paladin'], school: 'Encantamiento', castTime: 'Acción', range: '30 pies', duration: 'Concentración, 1 min', description: 'Hasta 3 criaturas suman 1d4 a tiradas de ataque y salvaciones.' },
        { id: 'command', name: 'Orden', level: 1, lists: ['cleric', 'paladin'], school: 'Encantamiento', castTime: 'Acción', range: '60 pies', duration: 'Instantáneo', description: 'Das una orden de una palabra (Acércate, Huye, Cae, etc.). Salvación de SAB o debe obedecer en su próximo turno.' },
        { id: 'guiding_bolt', name: 'Rayo Guía', level: 1, lists: ['cleric'], school: 'Evocación', castTime: 'Acción', range: '120 pies', duration: '1 asalto', description: 'Ataque de conjuro a distancia. 4d6 radiante. El siguiente ataque contra el objetivo tiene ventaja.' },
        { id: 'inflict_wounds', name: 'Infligir Heridas', level: 1, lists: ['cleric'], school: 'Nigromancia', castTime: 'Acción', range: 'Toque', duration: 'Instantáneo', description: 'Ataque de conjuro cuerpo a cuerpo. 2d10 necrótico.' },
        { id: 'shield_of_faith', name: 'Escudo de Fe', level: 1, lists: ['cleric', 'paladin'], school: 'Abjuración', castTime: 'Acción Adicional', range: '60 pies', duration: 'Concentración, 10 min', description: 'Un campo de luz protectora otorga +2 a CA al objetivo.' },

        // --- Druida ---
        { id: 'entangle', name: 'Enmarañar', level: 1, lists: ['druid', 'ranger'], school: 'Conjuración', castTime: 'Acción', range: '90 pies', duration: 'Concentración, 1 min', description: 'Plantas se levantan en un cuadrado de 20 pies. Salvación de FUE o quedan agarradas. Terreno difícil.' },
        { id: 'goodberry', name: 'Bayas Mágicas', level: 1, lists: ['druid', 'ranger'], school: 'Conjuración', castTime: 'Acción', range: 'Toque', duration: 'Instantáneo', description: 'Creas 10 bayas mágicas. Cada una cura 1 PG y nutre por un día.' },
        { id: 'speak_with_animals', name: 'Hablar con Animales', level: 1, lists: ['bard', 'druid', 'ranger'], school: 'Adivinación', castTime: 'Acción', range: 'Personal', duration: '10 minutos', description: 'Puedes comunicarte con bestias durante la duración.' },

        // --- Guerrero (no lanzador) ---

        // --- Mago ---
        { id: 'burning_hands', name: 'Manos Ardientes', level: 1, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: 'Personal (cono 15 pies)', duration: 'Instantáneo', description: 'Llamas surgen de tus manos en un cono. Salvación de DES: 3d6 fuego (mitad en éxito).' },
        { id: 'detect_magic', name: 'Detectar Magia', level: 1, lists: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'], school: 'Adivinación', castTime: 'Acción', range: 'Personal (30 pies)', duration: 'Concentración, 10 min', description: 'Sientes la presencia de magia a 30 pies. Puedes ver un aura y determinar la escuela.' },
        { id: 'mage_armor', name: 'Armadura de Mago', level: 1, lists: ['sorcerer', 'wizard'], school: 'Abjuración', castTime: 'Acción', range: 'Toque', duration: '8 horas', description: 'La CA base del objetivo se convierte en 13 + mod DES. No funciona con armadura.' },
        { id: 'magic_missile', name: 'Proyectil Mágico', level: 1, lists: ['sorcerer', 'wizard'], school: 'Evocación', castTime: 'Acción', range: '120 pies', duration: 'Instantáneo', description: 'Tres dardos de fuerza mágica impactan automáticamente. Cada uno hace 1d4+1 de fuerza.' },
        { id: 'shield', name: 'Escudo', level: 1, lists: ['sorcerer', 'wizard'], school: 'Abjuración', castTime: 'Reacción', range: 'Personal', duration: '1 asalto', description: 'Una barrera de fuerza invisible te da +5 a CA hasta tu próximo turno, incluyendo contra el ataque que la activó.' },
        { id: 'witch_bolt', name: 'Descarga de Bruja', level: 1, lists: ['sorcerer', 'warlock', 'wizard'], school: 'Evocación', castTime: 'Acción', range: '60 pies', duration: 'Concentración, 1 min', description: 'Ataque de conjuro a distancia. 2d12 relámpago. Turnos siguientes: 1d12 automático.' },

        // --- Explorador ---
        { id: 'hunters_mark', name: 'Marca del Cazador', level: 1, lists: ['ranger'], school: 'Adivinación', castTime: 'Acción Adicional', range: '90 pies', duration: 'Concentración, 1 hora', description: 'Marcas a una criatura. Tus ataques con arma le hacen 1d6 daño extra.' },
        { id: 'longstrider', name: 'Zancada Larga', level: 1, lists: ['bard', 'druid', 'ranger', 'wizard'], school: 'Transmutación', castTime: 'Acción', range: 'Toque', duration: '1 hora', description: 'La velocidad del objetivo aumenta en 10 pies.' },

        // --- Paladín ---
        { id: 'divine_smite', name: 'Castigo Divino', level: 1, lists: ['paladin'], school: 'Evocación', castTime: 'Acción Adicional (al impactar)', range: 'Personal', duration: 'Instantáneo', description: 'Al impactar con un ataque cuerpo a cuerpo, añades 2d8 radiante (+1d8 si es muerto viviente o demonio).' },
        { id: 'divine_favor', name: 'Favor Divino', level: 1, lists: ['paladin'], school: 'Transmutación', castTime: 'Acción Adicional', range: 'Personal', duration: 'Concentración, 1 min', description: 'Tus ataques con arma hacen 1d4 daño radiante extra.' },

        // --- Brujo ---
        { id: 'armor_of_agathys', name: 'Armadura de Agathys', level: 1, lists: ['warlock'], school: 'Abjuración', castTime: 'Acción', range: 'Personal', duration: '1 hora', description: 'Ganas 5 PG temporales. Mientras los tengas, cualquier criatura que te golpee cuerpo a cuerpo recibe 5 de frío.' },
        { id: 'hex', name: 'Maldición', level: 1, lists: ['warlock'], school: 'Encantamiento', castTime: 'Acción Adicional', range: '90 pies', duration: 'Concentración, 1 hora', description: 'Maldices a una criatura. Tus ataques le hacen 1d6 necrótico extra. Desventaja en pruebas de una habilidad elegida.' },
    ]
};

export function getSpellsForClass(classId, level = 0) {
    const list = level === 0 ? SPELLS.cantrips : SPELLS.level1;
    return list.filter(s => s.lists.includes(classId));
}

export function getSpellById(id) {
    const all = [...SPELLS.cantrips, ...SPELLS.level1];
    return all.find(s => s.id === id);
}
