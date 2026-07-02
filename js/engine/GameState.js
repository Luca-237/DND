// ============================================
// GameState — Estado global del juego
// ============================================

export const GAME_PHASES = {
    TITLE: 'title',
    CHARACTER_CREATION: 'character_creation',
    EXPLORATION: 'exploration',
    COMBAT: 'combat',
    DIALOGUE: 'dialogue',
    REST: 'rest',
    INVENTORY: 'inventory',
    STATS: 'stats',
    SPELLS: 'spells',
    LOGS: 'logs',
    GAME_OVER: 'game_over'
};

export class GameState {
    constructor() {
        this.phase = GAME_PHASES.TITLE;
        this.previousPhase = null;
        this.character = null;
        this.currentMap = null;
        this.currentRoom = null;
        this.turn = 0;
        this.logs = [];
        this.flags = {};       // Flags narrativas (quests, decisiones, etc.)
        this.visited = new Set(); // Habitaciones visitadas
    }

    setPhase(phase) {
        this.previousPhase = this.phase;
        this.phase = phase;
    }

    returnToPreviousPhase() {
        if (this.previousPhase) {
            const temp = this.phase;
            this.phase = this.previousPhase;
            this.previousPhase = temp;
        }
    }

    addLog(message, type = 'narrative') {
        this.logs.push({
            turn: this.turn,
            message,
            type,
            timestamp: Date.now()
        });
    }

    setFlag(key, value = true) {
        this.flags[key] = value;
    }

    getFlag(key) {
        return this.flags[key] || false;
    }

    markVisited(roomId) {
        this.visited.add(roomId);
    }

    hasVisited(roomId) {
        return this.visited.has(roomId);
    }

    /**
     * Serializar para guardado
     */
    serialize() {
        return {
            phase: this.phase,
            character: this.character,
            currentMap: this.currentMap?.id,
            turn: this.turn,
            logs: this.logs,
            flags: this.flags,
            visited: [...this.visited]
        };
    }

    /**
     * Cargar estado guardado
     */
    deserialize(data) {
        this.phase = data.phase;
        this.character = data.character;
        this.turn = data.turn;
        this.logs = data.logs || [];
        this.flags = data.flags || {};
        this.visited = new Set(data.visited || []);
    }
}
