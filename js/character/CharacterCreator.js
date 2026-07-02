// ============================================
// CharacterCreator — Wizard de creación paso a paso
// ============================================

import { Character } from './Character.js';
import { RACES, getRaceById } from '../data/races.js';
import { CLASSES, getClassById } from '../data/classes.js';
import { BACKGROUNDS, getBackgroundById } from '../data/backgrounds.js';
import { ORIGIN_FEATS, getFeatById } from '../data/feats.js';
import { getSpellsForClass } from '../data/spells.js';
import { ABILITIES, ABILITY_NAMES, STANDARD_ARRAY, POINT_BUY_COSTS, POINT_BUY_TOTAL, formatModifier, getModifier } from './AbilityScores.js';

export class CharacterCreator {
    constructor(terminal, eventBus) {
        this.terminal = terminal;
        this.eventBus = eventBus;
        this.character = new Character();
    }

    /**
     * Inicia el flujo completo de creación
     * @returns {Promise<Character>}
     */
    async start() {
        this.terminal.clear();
        this._showCreationBanner();

        // Paso 1: Nombre
        await this._stepName();

        // Paso 2: Especie (Raza)
        await this._stepRace();

        // Paso 3: Clase
        await this._stepClass();

        // Paso 4: Trasfondo
        await this._stepBackground();

        // Paso 5: Ability Scores
        await this._stepAbilityScores();

        // Paso 6: Habilidades (Skills)
        await this._stepSkills();

        // Paso 7: Hechizos (si aplica)
        if (this.character.spellcastingAbility) {
            await this._stepSpells();
        }

        // Paso 8: Estilo de combate (si aplica)
        const classData = getClassById(this.character.classId);
        if (classData.fightingStyles) {
            await this._stepFightingStyle(classData);
        }

        // Finalizar
        this._finalizeCharacter();

        // Paso 9: Resumen
        await this._stepSummary();

        return this.character;
    }

    _showCreationBanner() {
        this.terminal.writeAsciiArt(`
  ╔═══════════════════════════════════════════╗
  ║     ⚔  CREACIÓN DE PERSONAJE  ⚔          ║
  ║        D&D 2024 — EREGEPIA                ║
  ╚═══════════════════════════════════════════╝`);
        this.terminal.writeBlank();
    }

    // ── PASO 1: NOMBRE ──────────────────────────
    async _stepName() {
        this.terminal.writeSystem('PASO 1/8 — NOMBRE DEL PERSONAJE');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('¿Cómo se llama tu personaje?');
        this.terminal.writeBlank();

        while (true) {
            const name = await this.terminal.waitForInput('text');
            if (name.length >= 2 && name.length <= 30) {
                this.character.name = name;
                this.terminal.writeSuccess(`Tu personaje se llamará: ${name}`);
                this.terminal.writeBlank();
                return;
            }
            this.terminal.writeError('El nombre debe tener entre 2 y 30 caracteres.');
        }
    }

    // ── PASO 2: ESPECIE ──────────────────────────
    async _stepRace() {
        this.terminal.writeSystem('PASO 2/8 — ESPECIE');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('Elige la especie de tu personaje:');
        this.terminal.writeBlank();

        RACES.forEach((race, i) => {
            this.terminal.writeOption(i + 1, `${race.name} — ${race.description}`);
        });
        this.terminal.writeBlank();

        const choice = await this.terminal.waitForChoice(1, RACES.length);
        const race = RACES[choice - 1];

        this.character.raceId = race.id;
        this.character.raceName = race.name;
        this.character.speed = race.speed;
        this.character.darkvision = race.darkvision || 0;
        this.character.raceTraits = race.traits;

        if (race.resistances) {
            this.character.resistances = [...race.resistances];
        }
        if (race.skillProficiencies) {
            this.character.skillProficiencies.push(...race.skillProficiencies);
        }

        // Mostrar info de la raza
        this.terminal.writeBlank();
        this.terminal.writeSuccess(`Especie: ${race.name}`);
        this.terminal.writeLine(`<span class="text-white">${race.description}</span>`);
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-cyan">Tamaño:</span> <span class="text-white">${race.size}</span>`);
        this.terminal.writeLine(`<span class="text-cyan">Velocidad:</span> <span class="text-white">${race.speed} pies</span>`);
        if (race.darkvision) {
            this.terminal.writeLine(`<span class="text-cyan">Visión Oscura:</span> <span class="text-white">${race.darkvision} pies</span>`);
        }
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-yellow">Rasgos raciales:</span>');
        race.traits.forEach(t => {
            this.terminal.writeLine(`  <span class="text-cyan">• ${t.name}:</span> <span class="text-dim">${t.desc}</span>`);
        });

        // Subtipo
        if (race.subTypes && race.subTypes.length > 0) {
            this.terminal.writeBlank();
            this.terminal.writeNarrative('Elige tu linaje:');
            race.subTypes.forEach((sub, i) => {
                this.terminal.writeOption(i + 1, `${sub.name} — ${sub.desc}`);
            });
            const subChoice = await this.terminal.waitForChoice(1, race.subTypes.length);
            this.character.raceSubType = race.subTypes[subChoice - 1];
            this.terminal.writeSuccess(`Linaje: ${this.character.raceSubType.name}`);

            // Speed override for subtypes
            if (this.character.raceSubType.bonusSpeed) {
                this.character.speed = this.character.raceSubType.bonusSpeed;
            }
        }

        this.terminal.writeBlank();
    }

    // ── PASO 3: CLASE ────────────────────────────
    async _stepClass() {
        this.terminal.writeSystem('PASO 3/8 — CLASE');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('Elige la clase de tu personaje:');
        this.terminal.writeBlank();

        CLASSES.forEach((cls, i) => {
            const spellIcon = cls.spellcaster ? '✦' : '⚔';
            this.terminal.writeOption(i + 1, `${spellIcon} ${cls.name} (d${cls.hitDie}) — ${cls.description}`);
        });
        this.terminal.writeBlank();

        const choice = await this.terminal.waitForChoice(1, CLASSES.length);
        const cls = CLASSES[choice - 1];

        this.character.classId = cls.id;
        this.character.className = cls.name;
        this.character.hitDie = cls.hitDie;
        this.character.savingThrowProficiencies = [...cls.savingThrows];

        if (cls.spellcaster) {
            this.character.spellcastingAbility = cls.spellcastingAbility;
            this.character.spellSlots = { ...cls.spellSlots };
        }

        // Mostrar info
        this.terminal.writeBlank();
        this.terminal.writeSuccess(`Clase: ${cls.name}`);
        this.terminal.writeLine(`<span class="text-white">${cls.description}</span>`);
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-cyan">Dado de Golpe:</span> <span class="text-yellow">d${cls.hitDie}</span>`);
        this.terminal.writeLine(`<span class="text-cyan">Habilidad Principal:</span> <span class="text-white">${cls.primaryAbility}</span>`);
        this.terminal.writeLine(`<span class="text-cyan">Salvaciones:</span> <span class="text-white">${cls.savingThrows.join(', ')}</span>`);
        if (cls.armorProficiencies.length > 0) {
            this.terminal.writeLine(`<span class="text-cyan">Armaduras:</span> <span class="text-white">${cls.armorProficiencies.join(', ')}</span>`);
        }
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-yellow">Rasgos de nivel 1:</span>');
        cls.features.forEach(f => {
            this.terminal.writeLine(`  <span class="text-cyan">• ${f.name}:</span> <span class="text-dim">${f.desc}</span>`);
        });
        this.character.features = cls.features.map(f => ({ ...f }));

        // Equipamiento
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-yellow">Equipo inicial:</span>');
        cls.equipment.forEach(e => {
            this.terminal.writeLine(`  <span class="text-white">• ${e.name}</span>`);
            this.character.addItem({ id: e.name.toLowerCase().replace(/\s/g, '_'), name: e.name, type: e.type, quantity: 1 });
        });

        this.terminal.writeBlank();
    }

    // ── PASO 4: TRASFONDO ────────────────────────
    async _stepBackground() {
        this.terminal.writeSystem('PASO 4/8 — TRASFONDO');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('El trasfondo define tu pasado y otorga habilidades, herramientas y un Dote de Origen.');
        this.terminal.writeNarrative('En D&D 2024, el trasfondo también determina tus bonificadores de característica (+2/+1).');
        this.terminal.writeBlank();

        BACKGROUNDS.forEach((bg, i) => {
            const feat = getFeatById(bg.originFeat);
            const featName = feat ? feat.name : bg.originFeat;
            this.terminal.writeOption(i + 1, `${bg.name} — Dote: ${featName} | Habilidades: ${bg.skillProficiencies.join(', ')}`);
        });
        this.terminal.writeBlank();

        const choice = await this.terminal.waitForChoice(1, BACKGROUNDS.length);
        const bg = BACKGROUNDS[choice - 1];

        this.character.backgroundId = bg.id;
        this.character.backgroundName = bg.name;
        this.character.skillProficiencies.push(...bg.skillProficiencies);

        // Dote de origen
        const feat = getFeatById(bg.originFeat);
        if (feat) {
            this.character.originFeat = feat;
        }

        // Equipo de trasfondo
        if (bg.equipment) {
            bg.equipment.forEach(e => {
                if (typeof e === 'string') {
                    this.character.addItem({ id: e.toLowerCase().replace(/\s/g, '_'), name: e, type: 'misc', quantity: 1 });
                }
            });
        }

        // Gold from equipment list
        const goldMatch = bg.equipment?.find(e => typeof e === 'string' && e.match(/\d+\s*po/));
        if (goldMatch) {
            const goldAmount = parseInt(goldMatch.match(/(\d+)/)[1]);
            this.character.gold += goldAmount;
        }

        // Mostrar info
        this.terminal.writeBlank();
        this.terminal.writeSuccess(`Trasfondo: ${bg.name}`);
        this.terminal.writeLine(`<span class="text-white">${bg.description}</span>`);
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-cyan">Habilidades:</span> <span class="text-white">${bg.skillProficiencies.join(', ')}</span>`);
        this.terminal.writeLine(`<span class="text-cyan">Herramienta:</span> <span class="text-white">${bg.toolProficiency}</span>`);
        if (feat) {
            this.terminal.writeLine(`<span class="text-cyan">Dote de Origen:</span> <span class="text-yellow">${feat.name}</span>`);
            feat.effects.forEach(e => {
                this.terminal.writeLine(`  <span class="text-dim">• ${e}</span>`);
            });
        }
        this.terminal.writeBlank();
    }

    // ── PASO 5: ABILITY SCORES ──────────────────
    async _stepAbilityScores() {
        this.terminal.writeSystem('PASO 5/8 — PUNTUACIONES DE CARACTERÍSTICA');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('Elige cómo asignar tus puntuaciones de característica:');
        this.terminal.writeBlank();
        this.terminal.writeOption(1, 'Array Estándar [15, 14, 13, 12, 10, 8] — Equilibrado y rápido');
        this.terminal.writeOption(2, 'Point Buy (27 puntos) — Personalización total');
        this.terminal.writeBlank();

        const method = await this.terminal.waitForChoice(1, 2);

        if (method === 1) {
            await this._assignStandardArray();
        } else {
            await this._assignPointBuy();
        }

        // Aplicar bonificadores del trasfondo (+2/+1)
        await this._assignBackgroundBonuses();

        // Mostrar resultado final
        this.terminal.writeBlank();
        this.terminal.writeSuccess('Puntuaciones finales (con bonificadores de trasfondo):');
        this._displayAbilityScores();
        this.terminal.writeBlank();
    }

    async _assignStandardArray() {
        const remaining = [...STANDARD_ARRAY];
        const scores = {};

        this.terminal.writeBlank();
        this.terminal.writeNarrative('Asigna cada valor del Array Estándar a una característica.');

        for (const ability of ABILITIES) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-cyan">Valores disponibles:</span> <span class="text-yellow">[${remaining.join(', ')}]</span>`);
            this.terminal.writeNarrative(`¿Qué valor asignas a ${ABILITY_NAMES[ability]} (${ability})?`);

            remaining.forEach((val, i) => {
                this.terminal.writeOption(i + 1, `${val} (${formatModifier(val)})`);
            });

            const choice = await this.terminal.waitForChoice(1, remaining.length);
            scores[ability] = remaining[choice - 1];
            remaining.splice(choice - 1, 1);
            this.terminal.writeSuccess(`${ability}: ${scores[ability]} (${formatModifier(scores[ability])})`);
        }

        this.character.abilityScores = scores;
    }

    async _assignPointBuy() {
        const scores = { FUE: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 };
        let pointsRemaining = POINT_BUY_TOTAL;

        this.terminal.writeBlank();
        this.terminal.writeNarrative('Point Buy: Tienes 27 puntos. Cada característica empieza en 8 (mín) y puede subir hasta 15 (máx).');
        this.terminal.writeLine('<span class="text-dim">Costos: 8→9: 1pt | 9→10: 1pt | 10→11: 1pt | 11→12: 1pt | 12→13: 1pt | 13→14: 2pt | 14→15: 2pt</span>');

        for (const ability of ABILITIES) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-cyan">Puntos restantes:</span> <span class="text-yellow">${pointsRemaining}</span>`);
            this.terminal.writeNarrative(`¿Qué valor para ${ABILITY_NAMES[ability]} (${ability})? [8-15]`);

            // Mostrar opciones válidas
            const validOptions = [];
            for (let v = 8; v <= 15; v++) {
                const cost = POINT_BUY_COSTS[v];
                if (cost <= pointsRemaining) {
                    validOptions.push(v);
                }
            }

            validOptions.forEach((val, i) => {
                const cost = POINT_BUY_COSTS[val];
                this.terminal.writeOption(i + 1, `${val} (${formatModifier(val)}) — Costo: ${cost} pts`);
            });

            const choice = await this.terminal.waitForChoice(1, validOptions.length);
            const chosenValue = validOptions[choice - 1];
            scores[ability] = chosenValue;
            pointsRemaining -= POINT_BUY_COSTS[chosenValue];
            this.terminal.writeSuccess(`${ability}: ${chosenValue} (${formatModifier(chosenValue)})`);
        }

        this.character.abilityScores = scores;
    }

    async _assignBackgroundBonuses() {
        this.terminal.writeBlank();
        this.terminal.writeSystem('BONIFICADORES DE TRASFONDO');
        this.terminal.writeNarrative('Tu trasfondo te permite añadir +2 a una característica y +1 a otra (o +1 a tres).');
        this.terminal.writeBlank();
        this.terminal.writeOption(1, '+2 a una característica y +1 a otra');
        this.terminal.writeOption(2, '+1 a tres características diferentes');
        this.terminal.writeBlank();

        const method = await this.terminal.waitForChoice(1, 2);

        if (method === 1) {
            // +2 / +1
            this.terminal.writeNarrative('¿A qué característica asignas +2?');
            ABILITIES.forEach((a, i) => {
                this.terminal.writeOption(i + 1, `${ABILITY_NAMES[a]} (${a}): ${this.character.abilityScores[a]} → ${this.character.abilityScores[a] + 2}`);
            });
            const choice1 = await this.terminal.waitForChoice(1, 6);
            const ability1 = ABILITIES[choice1 - 1];
            this.character.abilityScores[ability1] += 2;
            this.terminal.writeSuccess(`${ability1} +2 → ${this.character.abilityScores[ability1]}`);

            this.terminal.writeNarrative('¿A qué característica asignas +1?');
            const remaining = ABILITIES.filter(a => a !== ability1);
            remaining.forEach((a, i) => {
                this.terminal.writeOption(i + 1, `${ABILITY_NAMES[a]} (${a}): ${this.character.abilityScores[a]} → ${this.character.abilityScores[a] + 1}`);
            });
            const choice2 = await this.terminal.waitForChoice(1, remaining.length);
            const ability2 = remaining[choice2 - 1];
            this.character.abilityScores[ability2] += 1;
            this.terminal.writeSuccess(`${ability2} +1 → ${this.character.abilityScores[ability2]}`);
        } else {
            // +1 / +1 / +1
            const chosen = [];
            for (let i = 0; i < 3; i++) {
                this.terminal.writeNarrative(`¿Característica para +1? (${i + 1}/3)`);
                const remaining = ABILITIES.filter(a => !chosen.includes(a));
                remaining.forEach((a, j) => {
                    this.terminal.writeOption(j + 1, `${ABILITY_NAMES[a]} (${a}): ${this.character.abilityScores[a]} → ${this.character.abilityScores[a] + 1}`);
                });
                const choice = await this.terminal.waitForChoice(1, remaining.length);
                const ability = remaining[choice - 1];
                this.character.abilityScores[ability] += 1;
                chosen.push(ability);
                this.terminal.writeSuccess(`${ability} +1 → ${this.character.abilityScores[ability]}`);
            }
        }
    }

    _displayAbilityScores() {
        this.terminal.writeLine('┌──────┬──────┬──────┬──────┬──────┬──────┐', 'divider');
        this.terminal.writeLine('│ <span class="text-cyan"> FUE</span> │ <span class="text-cyan"> DES</span> │ <span class="text-cyan"> CON</span> │ <span class="text-cyan"> INT</span> │ <span class="text-cyan"> SAB</span> │ <span class="text-cyan"> CAR</span> │');
        const scores = ABILITIES.map(a => {
            const val = this.character.abilityScores[a].toString().padStart(3);
            return `<span class="text-yellow">${val}</span> `;
        }).join('│ ');
        this.terminal.writeLine(`│ ${scores}│`);
        const mods = ABILITIES.map(a => {
            const mod = formatModifier(this.character.abilityScores[a]).padStart(3);
            return `<span class="text-green">${mod}</span> `;
        }).join('│ ');
        this.terminal.writeLine(`│ ${mods}│`);
        this.terminal.writeLine('└──────┴──────┴──────┴──────┴──────┴──────┘', 'divider');
    }

    // ── PASO 6: HABILIDADES ──────────────────────
    async _stepSkills() {
        const cls = getClassById(this.character.classId);
        const { count, from: availableSkills } = cls.skillChoices;

        // Filter out already proficient skills
        const choosable = availableSkills.filter(s => !this.character.skillProficiencies.includes(s));

        this.terminal.writeSystem('PASO 6/8 — HABILIDADES');
        this.terminal.writeDivider();
        this.terminal.writeLine(`<span class="text-white">Ya tienes competencia en:</span> <span class="text-yellow">${this.character.skillProficiencies.join(', ') || 'Ninguna'}</span>`);
        this.terminal.writeNarrative(`Tu clase te permite elegir ${count} habilidades adicionales:`);
        this.terminal.writeBlank();

        const chosen = [];
        for (let i = 0; i < count && choosable.length > 0; i++) {
            const remaining = choosable.filter(s => !chosen.includes(s));
            if (remaining.length === 0) break;

            remaining.forEach((skill, j) => {
                this.terminal.writeOption(j + 1, skill);
            });
            this.terminal.writeBlank();

            const choice = await this.terminal.waitForChoice(1, remaining.length);
            const skill = remaining[choice - 1];
            chosen.push(skill);
            this.character.skillProficiencies.push(skill);
            this.terminal.writeSuccess(`Competencia en: ${skill} (${i + 1}/${count})`);
        }

        this.terminal.writeBlank();
    }

    // ── PASO 7: HECHIZOS ────────────────────────
    async _stepSpells() {
        const cls = getClassById(this.character.classId);

        this.terminal.writeSystem('PASO 7/8 — HECHIZOS');
        this.terminal.writeDivider();
        this.terminal.writeLine(`<span class="text-cyan">Aptitud mágica:</span> <span class="text-yellow">${this.character.spellcastingAbility}</span>`);
        this.terminal.writeBlank();

        // Cantrips
        if (cls.cantripsKnown > 0) {
            const cantrips = getSpellsForClass(cls.spellList, 0);
            this.terminal.writeNarrative(`Elige ${cls.cantripsKnown} cantrips (trucos):`);
            this.terminal.writeBlank();

            const chosenCantrips = [];
            for (let i = 0; i < cls.cantripsKnown; i++) {
                const available = cantrips.filter(s => !chosenCantrips.includes(s.id));
                available.forEach((spell, j) => {
                    this.terminal.writeOption(j + 1, `${spell.name} — ${spell.description}`);
                });
                this.terminal.writeBlank();

                const choice = await this.terminal.waitForChoice(1, available.length);
                const spell = available[choice - 1];
                chosenCantrips.push(spell.id);
                this.character.knownCantrips.push(spell);
                this.terminal.writeSuccess(`Cantrip aprendido: ${spell.name} (${i + 1}/${cls.cantripsKnown})`);
                this.terminal.writeBlank();
            }
        }

        // Hechizos de nivel 1
        const spellCount = cls.spellsKnown || (cls.preparedCaster ? getModifier(this.character.abilityScores[cls.spellcastingAbility]) + this.character.level : 0);
        if (spellCount > 0) {
            const spells = getSpellsForClass(cls.spellList, 1);
            const toChoose = Math.max(1, Math.min(spellCount, spells.length));

            this.terminal.writeNarrative(`Elige ${toChoose} hechizo(s) de nivel 1:`);
            this.terminal.writeBlank();

            const chosenSpells = [];
            for (let i = 0; i < toChoose; i++) {
                const available = spells.filter(s => !chosenSpells.includes(s.id));
                if (available.length === 0) break;

                available.forEach((spell, j) => {
                    this.terminal.writeOption(j + 1, `${spell.name} [${spell.school}] — ${spell.description}`);
                });
                this.terminal.writeBlank();

                const choice = await this.terminal.waitForChoice(1, available.length);
                const spell = available[choice - 1];
                chosenSpells.push(spell.id);
                this.character.knownSpells.push(spell);
                this.terminal.writeSuccess(`Hechizo aprendido: ${spell.name} (${i + 1}/${toChoose})`);
                this.terminal.writeBlank();
            }
        }

        // Warlock: Rayo Místico gratis
        if (cls.id === 'warlock') {
            const eb = getSpellsForClass('warlock', 0).find(s => s.id === 'eldritch_blast');
            if (eb && !this.character.knownCantrips.find(c => c.id === 'eldritch_blast')) {
                this.character.knownCantrips.push(eb);
                this.terminal.writeSuccess('Cantrip gratuito: Rayo Místico');
            }
        }
    }

    // ── PASO 8: ESTILO DE COMBATE ───────────────
    async _stepFightingStyle(classData) {
        this.terminal.writeSystem('PASO 8/8 — ESTILO DE COMBATE');
        this.terminal.writeDivider();
        this.terminal.writeNarrative('Elige un estilo de combate:');
        this.terminal.writeBlank();

        classData.fightingStyles.forEach((style, i) => {
            this.terminal.writeOption(i + 1, `${style.name} — ${style.desc}`);
        });
        this.terminal.writeBlank();

        const choice = await this.terminal.waitForChoice(1, classData.fightingStyles.length);
        this.character.fightingStyle = classData.fightingStyles[choice - 1];
        this.terminal.writeSuccess(`Estilo de combate: ${this.character.fightingStyle.name}`);
        this.terminal.writeBlank();
    }

    // ── FINALIZACIÓN ─────────────────────────────
    _finalizeCharacter() {
        // Calcular HP
        this.character.calculateMaxHP();

        // Calcular AC (simplificado, basado en equipo inicial de clase)
        const cls = getClassById(this.character.classId);
        const hasHeavyArmor = cls.equipment.some(e => e.name.includes('Cota de Malla'));
        const hasMediumArmor = cls.equipment.some(e => e.name.includes('Cuero Tachonado'));
        const hasLightArmor = cls.equipment.some(e => e.name.includes('Cuero') && !e.name.includes('Tachonado'));
        const hasShield = cls.equipment.some(e => e.name === 'Escudo');

        if (hasHeavyArmor) {
            this.character.equippedArmor = { type: 'Pesada', ac: '16' };
        } else if (hasMediumArmor) {
            this.character.equippedArmor = { type: 'Ligera', ac: '12' };
        } else if (hasLightArmor) {
            this.character.equippedArmor = { type: 'Ligera', ac: '11' };
        }

        this.character.hasShield = hasShield;
        this.character.calculateAC();

        // Fighting style bonus
        if (this.character.fightingStyle?.id === 'defense' && this.character.equippedArmor) {
            this.character.armorClass += 1;
        }

        // Init resources
        this.character.initClassResources();

        // Spell slots
        if (this.character.spellSlots) {
            this.character.currentSpellSlots = { ...this.character.spellSlots };
        }

        // Equipped weapon (first weapon from inventory)
        const weapon = this.character.inventory.find(i => i.type === 'weapon');
        if (weapon) {
            this.character.equippedWeapon = weapon;
        }
    }

    // ── RESUMEN FINAL ────────────────────────────
    async _stepSummary() {
        this.terminal.clear();
        this.terminal.writeAsciiArt(`
  ╔═══════════════════════════════════════════╗
  ║        📜 FICHA DE PERSONAJE 📜           ║
  ╚═══════════════════════════════════════════╝`);
        this.terminal.writeBlank();

        // Info básica
        this.terminal.writeTitle(`⚔ ${this.character.name} ⚔`);
        this.terminal.writeSubtitle(`${this.character.raceName} ${this.character.className} — Nivel ${this.character.level}`);
        this.terminal.writeLine(`<span class="text-cyan">Trasfondo:</span> <span class="text-white">${this.character.backgroundName}</span>`);
        if (this.character.raceSubType) {
            this.terminal.writeLine(`<span class="text-cyan">Linaje:</span> <span class="text-white">${this.character.raceSubType.name}</span>`);
        }
        this.terminal.writeDivider('═', 45);

        // Combate
        this.terminal.writeBlank();
        this.terminal.writeHPBar(this.character.currentHP, this.character.maxHP);
        this.terminal.writeLine(`<span class="text-cyan">CA:</span> <span class="text-yellow">${this.character.armorClass}</span>  |  <span class="text-cyan">Velocidad:</span> <span class="text-white">${this.character.speed} pies</span>  |  <span class="text-cyan">Dado Golpe:</span> <span class="text-white">d${this.character.hitDie}</span>`);
        this.terminal.writeLine(`<span class="text-cyan">Competencia:</span> <span class="text-yellow">+${this.character.proficiencyBonus}</span>`);

        // Ability Scores
        this.terminal.writeBlank();
        this._displayAbilityScores();

        // Salvaciones
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-cyan">Salvaciones competentes:</span> <span class="text-yellow">${this.character.savingThrowProficiencies.join(', ')}</span>`);

        // Habilidades
        this.terminal.writeLine(`<span class="text-cyan">Habilidades:</span> <span class="text-white">${this.character.skillProficiencies.join(', ')}</span>`);

        // Rasgos especiales
        if (this.character.darkvision > 0) {
            this.terminal.writeLine(`<span class="text-cyan">Visión Oscura:</span> <span class="text-white">${this.character.darkvision} pies</span>`);
        }
        if (this.character.resistances.length > 0) {
            this.terminal.writeLine(`<span class="text-cyan">Resistencias:</span> <span class="text-white">${this.character.resistances.join(', ')}</span>`);
        }

        // Dote
        if (this.character.originFeat) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-yellow">Dote:</span> <span class="text-white">${this.character.originFeat.name}</span>`);
        }

        // Hechizos
        if (this.character.knownCantrips.length > 0 || this.character.knownSpells.length > 0) {
            this.terminal.writeBlank();
            this.terminal.writeLine('<span class="text-magenta">═══ HECHIZOS ═══</span>');
            if (this.character.spellcastingAbility) {
                this.terminal.writeLine(`<span class="text-cyan">Ataque Mágico:</span> <span class="text-yellow">+${this.character.spellAttackBonus}</span>  |  <span class="text-cyan">CD:</span> <span class="text-yellow">${this.character.spellSaveDC}</span>`);
            }
            if (this.character.knownCantrips.length > 0) {
                this.terminal.writeLine(`<span class="text-cyan">Cantrips:</span> <span class="text-white">${this.character.knownCantrips.map(s => s.name).join(', ')}</span>`);
            }
            if (this.character.knownSpells.length > 0) {
                this.terminal.writeLine(`<span class="text-cyan">Nivel 1:</span> <span class="text-white">${this.character.knownSpells.map(s => s.name).join(', ')}</span>`);
                const slots = this.character.spellSlots[1] || 0;
                this.terminal.writeLine(`<span class="text-cyan">Espacios Nivel 1:</span> <span class="text-yellow">${'◆'.repeat(slots)}${'◇'.repeat(Math.max(0, 4 - slots))}</span>`);
            }
        }

        // Inventario
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-orange">═══ INVENTARIO ═══</span>');
        this.character.inventory.forEach(item => {
            const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
            this.terminal.writeLine(`  <span class="text-white">• ${item.name}${qty}</span>`);
        });
        this.terminal.writeLine(`  <span class="text-yellow">💰 ${this.character.gold} po</span>`);

        // Estilo de combate
        if (this.character.fightingStyle) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-cyan">Estilo de Combate:</span> <span class="text-white">${this.character.fightingStyle.name} — ${this.character.fightingStyle.desc}</span>`);
        }

        // Confirmación
        this.terminal.writeBlank();
        this.terminal.writeDivider('═', 45);
        this.terminal.writeBlank();
        this.terminal.writeOption(1, '✓ Confirmar personaje y empezar la aventura');
        this.terminal.writeOption(2, '✗ Empezar de nuevo');
        this.terminal.writeBlank();

        const confirm = await this.terminal.waitForChoice(1, 2);
        if (confirm === 2) {
            this.character = new Character();
            return this.start();
        }
    }
}
