// ============================================
// Character — Modelo del Personaje
// ============================================

import { getModifier, formatModifier, getProficiencyBonus, calculateAC, SKILLS } from './AbilityScores.js';

export class Character {
    constructor() {
        this.name = '';
        this.raceId = '';
        this.raceName = '';
        this.raceSubType = null;
        this.classId = '';
        this.className = '';
        this.backgroundId = '';
        this.backgroundName = '';
        this.level = 1;

        this.abilityScores = { FUE: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 };
        this.maxHP = 0;
        this.currentHP = 0;
        this.tempHP = 0;
        this.armorClass = 10;

        this.skillProficiencies = [];
        this.savingThrowProficiencies = [];

        this.inventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = null;
        this.hasShield = false;
        this.gold = 0;

        this.knownCantrips = [];
        this.knownSpells = [];
        this.spellSlots = {};
        this.currentSpellSlots = {};
        this.spellcastingAbility = null;

        this.features = [];
        this.originFeat = null;
        this.raceTraits = [];

        this.fightingStyle = null;
        this.hitDie = 8;

        this.speed = 30;
        this.darkvision = 0;
        this.resistances = [];

        // Recursos
        this.heroismPoints = 0;
        this.rageUses = 0;
        this.currentRageUses = 0;
        this.kiPoints = 0;
        this.currentKiPoints = 0;
        this.layOnHandsPool = 0;
        this.currentLayOnHands = 0;
        this.bardicInspirationUses = 0;
        this.currentBardicInspiration = 0;

        // Position on map
        this.x = 0;
        this.y = 0;
    }

    /**
     * Calcula HP máximo a nivel 1
     */
    calculateMaxHP() {
        const conMod = getModifier(this.abilityScores.CON);
        this.maxHP = this.hitDie + conMod;

        // Dureza Enana: +1 PG por nivel
        if (this.raceId === 'dwarf') {
            this.maxHP += this.level;
        }

        // Dote Resistente: +2 PG por nivel
        if (this.originFeat?.id === 'tough') {
            this.maxHP += 2 * this.level;
        }

        this.currentHP = this.maxHP;
    }

    /**
     * Calcula la CA
     */
    calculateAC() {
        this.armorClass = calculateAC(this);
    }

    /**
     * Obtiene el bonus de competencia
     */
    get proficiencyBonus() {
        return getProficiencyBonus(this.level);
    }

    /**
     * Obtiene el modificador de una habilidad
     */
    getAbilityModifier(ability) {
        return getModifier(this.abilityScores[ability]);
    }

    /**
     * Obtiene el bonus para una salvación
     */
    getSavingThrow(ability) {
        const mod = this.getAbilityModifier(ability);
        if (this.savingThrowProficiencies.includes(ability)) {
            return mod + this.proficiencyBonus;
        }
        return mod;
    }

    /**
     * Obtiene el bonus para una habilidad (skill)
     */
    getSkillBonus(skillName) {
        const ability = SKILLS[skillName];
        if (!ability) return 0;
        const mod = this.getAbilityModifier(ability);
        if (this.skillProficiencies.includes(skillName)) {
            return mod + this.proficiencyBonus;
        }
        return mod;
    }

    /**
     * Obtiene el modificador de ataque mágico
     */
    get spellAttackBonus() {
        if (!this.spellcastingAbility) return 0;
        return this.getAbilityModifier(this.spellcastingAbility) + this.proficiencyBonus;
    }

    /**
     * Obtiene la CD de salvación de conjuros
     */
    get spellSaveDC() {
        if (!this.spellcastingAbility) return 0;
        return 8 + this.getAbilityModifier(this.spellcastingAbility) + this.proficiencyBonus;
    }

    /**
     * Inicializa recursos de clase
     */
    initClassResources() {
        switch (this.classId) {
            case 'barbarian':
                this.rageUses = 2;
                this.currentRageUses = 2;
                break;
            case 'bard':
                this.bardicInspirationUses = Math.max(1, this.getAbilityModifier('CAR'));
                this.currentBardicInspiration = this.bardicInspirationUses;
                break;
            case 'monk':
                this.kiPoints = this.level;
                this.currentKiPoints = this.kiPoints;
                break;
            case 'paladin':
                this.layOnHandsPool = 5 * this.level;
                this.currentLayOnHands = this.layOnHandsPool;
                break;
        }
        // Spell slots
        if (this.spellSlots) {
            this.currentSpellSlots = { ...this.spellSlots };
        }
    }

    /**
     * Recibe daño
     */
    takeDamage(amount) {
        // Primero absorbe PG temporales
        if (this.tempHP > 0) {
            if (this.tempHP >= amount) {
                this.tempHP -= amount;
                return { absorbed: amount, remaining: 0 };
            }
            amount -= this.tempHP;
            this.tempHP = 0;
        }
        this.currentHP = Math.max(0, this.currentHP - amount);
        return { absorbed: 0, remaining: amount };
    }

    /**
     * Cura PG
     */
    heal(amount) {
        this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
    }

    /**
     * Descansa (Descanso Largo)
     */
    longRest() {
        this.currentHP = this.maxHP;
        this.tempHP = 0;
        this.currentSpellSlots = { ...this.spellSlots };
        this.currentRageUses = this.rageUses;
        this.currentKiPoints = this.kiPoints;
        this.currentLayOnHands = this.layOnHandsPool;
        this.currentBardicInspiration = this.bardicInspirationUses;
        this.heroismPoints = 1;
    }

    /**
     * Agrega item al inventario
     */
    addItem(item) {
        const existing = this.inventory.find(i => i.id === item.id);
        if (existing && item.stackable !== false) {
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
        } else {
            this.inventory.push({ ...item, quantity: item.quantity || 1 });
        }
    }

    /**
     * Remueve item del inventario
     */
    removeItem(itemId, quantity = 1) {
        const idx = this.inventory.findIndex(i => i.id === itemId);
        if (idx === -1) return false;
        const item = this.inventory[idx];
        if ((item.quantity || 1) <= quantity) {
            this.inventory.splice(idx, 1);
        } else {
            item.quantity -= quantity;
        }
        return true;
    }

    /**
     * Genera resumen de stats para la terminal
     */
    getStatsSummary() {
        const lines = [];
        lines.push(`═══ ${this.name} ═══`);
        lines.push(`${this.raceName} ${this.className} Nivel ${this.level}`);
        if (this.backgroundName) lines.push(`Trasfondo: ${this.backgroundName}`);
        lines.push(`──────────────────────────`);
        lines.push(`PG: ${this.currentHP}/${this.maxHP}${this.tempHP > 0 ? ` (+${this.tempHP} temp)` : ''}  |  CA: ${this.armorClass}  |  Velocidad: ${this.speed} pies`);
        lines.push(`Bonus de Competencia: +${this.proficiencyBonus}`);
        if (this.spellcastingAbility) {
            lines.push(`Ataque Mágico: +${this.spellAttackBonus}  |  CD Conjuro: ${this.spellSaveDC}`);
        }
        lines.push(`──────────────────────────`);
        lines.push(`  FUE  DES  CON  INT  SAB  CAR`);
        const scores = `  ${this.abilityScores.FUE.toString().padStart(2)}   ${this.abilityScores.DES.toString().padStart(2)}   ${this.abilityScores.CON.toString().padStart(2)}   ${this.abilityScores.INT.toString().padStart(2)}   ${this.abilityScores.SAB.toString().padStart(2)}   ${this.abilityScores.CAR.toString().padStart(2)}`;
        lines.push(scores);
        const mods = ` (${formatModifier(this.abilityScores.FUE)}) (${formatModifier(this.abilityScores.DES)}) (${formatModifier(this.abilityScores.CON)}) (${formatModifier(this.abilityScores.INT)}) (${formatModifier(this.abilityScores.SAB)}) (${formatModifier(this.abilityScores.CAR)})`;
        lines.push(mods);

        if (this.darkvision > 0) {
            lines.push(`\nVisión en la Oscuridad: ${this.darkvision} pies`);
        }
        if (this.resistances.length > 0) {
            lines.push(`Resistencias: ${this.resistances.join(', ')}`);
        }

        return lines;
    }
}
