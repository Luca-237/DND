// ============================================
// DiceRoller — Sistema de dados D&D
// ============================================

export class DiceRoller {
    /**
     * Tira un dado de N caras
     * @param {number} sides - Número de caras
     * @returns {number}
     */
    static roll(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    /** d4 */
    static d4() { return this.roll(4); }
    /** d6 */
    static d6() { return this.roll(6); }
    /** d8 */
    static d8() { return this.roll(8); }
    /** d10 */
    static d10() { return this.roll(10); }
    /** d12 */
    static d12() { return this.roll(12); }
    /** d20 */
    static d20() { return this.roll(20); }
    /** d100 */
    static d100() { return this.roll(100); }

    /**
     * Tira NdX y devuelve la suma
     * @param {number} count - Cantidad de dados
     * @param {number} sides - Caras por dado
     * @returns {{ total: number, rolls: number[] }}
     */
    static rollMultiple(count, sides) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(this.roll(sides));
        }
        return {
            total: rolls.reduce((sum, r) => sum + r, 0),
            rolls
        };
    }

    /**
     * Parsea una notación de dado como "2d6+3" y la resuelve
     * @param {string} notation - Ej: "1d20", "2d6+3", "1d8-1"
     * @returns {{ total: number, rolls: number[], modifier: number, notation: string }}
     */
    static parse(notation) {
        const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
        if (!match) throw new Error(`Notación de dado inválida: ${notation}`);

        const count = parseInt(match[1]);
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        const { total, rolls } = this.rollMultiple(count, sides);

        return {
            total: total + modifier,
            rolls,
            modifier,
            notation
        };
    }

    /**
     * Tirada con ventaja (tira 2d20, toma el mayor)
     * @returns {{ result: number, rolls: number[] }}
     */
    static rollAdvantage() {
        const r1 = this.d20();
        const r2 = this.d20();
        return {
            result: Math.max(r1, r2),
            rolls: [r1, r2]
        };
    }

    /**
     * Tirada con desventaja (tira 2d20, toma el menor)
     * @returns {{ result: number, rolls: number[] }}
     */
    static rollDisadvantage() {
        const r1 = this.d20();
        const r2 = this.d20();
        return {
            result: Math.min(r1, r2),
            rolls: [r1, r2]
        };
    }

    /**
     * Tirada de habilidad (4d6, descarta el menor)
     * @returns {{ total: number, rolls: number[], dropped: number }}
     */
    static rollAbilityScore() {
        const { rolls } = this.rollMultiple(4, 6);
        const sorted = [...rolls].sort((a, b) => a - b);
        const dropped = sorted[0];
        const kept = sorted.slice(1);
        return {
            total: kept.reduce((sum, r) => sum + r, 0),
            rolls,
            dropped
        };
    }

    /**
     * Genera un string legible de la tirada
     * @param {string} label - Etiqueta
     * @param {number} result - Resultado
     * @param {number[]} rolls - Dados individuales
     * @param {number} modifier - Modificador
     * @returns {string}
     */
    static formatRoll(label, result, rolls, modifier = 0) {
        const rollStr = rolls.join(', ');
        const modStr = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : '';
        return `🎲 ${label}: [${rollStr}]${modStr} = ${result}`;
    }
}
