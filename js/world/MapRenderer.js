// ============================================
// MapRenderer — Mapa ASCII 15x15 con leyenda
// ============================================

export const TILE_TYPES = {
    WALL: '#',
    FLOOR: '.',
    DOOR: 'D',
    DOOR_OPEN: 'd',
    DOOR_LOCKED: 'L',
    STAIRS_DOWN: '>',
    STAIRS_UP: '<',
    WATER: '~',
    TRAP: '.',      // Trampas ocultas se ven como suelo
    TRAP_REVEALED: '!',
    CHEST: 'T',
    PLAYER: '@',
    EMPTY: ' ',
    FOG: '▓'
};

// Mapa de símbolos para la leyenda dinámica
const TILE_CSS = {
    '#': 'tile-wall',
    '.': 'tile-floor',
    'D': 'tile-door',
    'd': 'tile-door',
    'L': 'tile-door',
    '>': 'tile-stairs',
    '<': 'tile-stairs',
    '~': 'tile-water',
    '!': 'tile-enemy',
    'T': 'tile-treasure',
    '@': 'tile-player',
    '▓': 'tile-fog',
    ' ': ''
};

const TILE_DESCRIPTIONS = {
    '@': 'Tú',
    '#': 'Pared',
    '.': 'Suelo',
    'D': 'Puerta',
    'd': 'Puerta abierta',
    'L': 'Puerta cerrada',
    '>': 'Escaleras abajo',
    '<': 'Escaleras arriba',
    '~': 'Agua',
    '!': 'Trampa',
    'T': 'Cofre/Tesoro'
};

export class MapRenderer {
    constructor() {
        this.mapEl = document.getElementById('map-ascii');
        this.legendEl = document.getElementById('map-legend');
        this.infoEl = document.getElementById('map-info');
        this.width = 15;
        this.height = 15;
        this.grid = [];
        this.entities = [];
        this.revealed = [];  // Fog of war tracking
        this.playerX = 0;
        this.playerY = 0;
        this.visionRadius = 5;
        this.baseVisionRadius = 5;
        this.mapName = '';
    }

    /**
     * Inicializa el mapa con una grilla
     * @param {string[][]} grid - Grilla 2D de tiles
     * @param {number} playerX
     * @param {number} playerY
     * @param {string} mapName
     */
    init(grid, playerX, playerY, mapName = 'Desconocido') {
        this.grid = grid;
        this.height = grid.length;
        this.width = grid[0].length;
        this.playerX = playerX;
        this.playerY = playerY;
        this.mapName = mapName;

        // Init revealed array
        this.revealed = Array.from({ length: this.height }, () =>
            Array.from({ length: this.width }, () => false)
        );

        this.entities = [];
        this._updateVisibility();
        this.render();
    }

    /**
     * Mueve al jugador
     */
    movePlayer(newX, newY) {
        this.playerX = newX;
        this.playerY = newY;
        this._updateVisibility();
        this.render();
    }

    /**
     * Cambia el radio de visión dinámicamente
     * @param {number} radius
     */
    setVisionRadius(radius) {
        this.visionRadius = radius;
        this._updateVisibility();
        this.render();
    }

    /**
     * Agrega una entidad al mapa
     */
    addEntity(entity) {
        this.entities.push(entity);
        this.render();
    }

    /**
     * Remueve una entidad
     */
    removeEntity(entityId) {
        this.entities = this.entities.filter(e => e.id !== entityId);
        this.render();
    }

    /**
     * Actualiza visibilidad (fog of war)
     */
    _updateVisibility() {
        const px = this.playerX;
        const py = this.playerY;
        const r = this.visionRadius;

        for (let y = Math.max(0, py - r); y <= Math.min(this.height - 1, py + r); y++) {
            for (let x = Math.max(0, px - r); x <= Math.min(this.width - 1, px + r); x++) {
                const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
                if (dist <= r) {
                    // Simple line-of-sight: check if blocked by walls
                    if (this._hasLineOfSight(px, py, x, y)) {
                        this.revealed[y][x] = true;
                    }
                }
            }
        }
    }

    /**
     * Línea de visión simple (Bresenham) — público para uso del engine
     * @param {number} x0 - Origen X
     * @param {number} y0 - Origen Y
     * @param {number} x1 - Destino X
     * @param {number} y1 - Destino Y
     * @returns {boolean}
     */
    hasLineOfSight(x0, y0, x1, y1) {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let cx = x0, cy = y0;

        while (cx !== x1 || cy !== y1) {
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; cx += sx; }
            if (e2 < dx) { err += dx; cy += sy; }

            // Check if wall, closed door, or water blocks
            if (cx === x1 && cy === y1) return true;
            if (this.grid[cy]) {
                const tile = this.grid[cy][cx];
                if (tile === '#' || tile === 'D' || tile === 'L' || tile === '~') return false;
            }
        }
        return true;
    }

    /** @private alias for internal use */
    _hasLineOfSight(x0, y0, x1, y1) {
        return this.hasLineOfSight(x0, y0, x1, y1);
    }

    /**
     * Mueve una entidad del mapa a una nueva posición
     */
    moveEntity(entityId, newX, newY) {
        const entity = this.entities.find(e => e.id === entityId);
        if (entity) {
            entity.x = newX;
            entity.y = newY;
            this.render();
        }
    }

    /**
     * Verifica si una posición es transitable para una entidad (no pisa otras entidades)
     */
    isWalkableForEntity(x, y, ignoredEntityId = null) {
        if (!this.isWalkable(x, y)) return false;
        // No pisar al jugador
        if (x === this.playerX && y === this.playerY) return false;
        // No pisar otras entidades
        const blocking = this.entities.find(e =>
            e.x === x && e.y === y && e.id !== ignoredEntityId
        );
        return !blocking;
    }

    /**
     * Renderiza el mapa completo con leyenda
     */
    render() {
        let html = '';
        const visibleSymbols = new Set();
        const entitySymbols = new Map(); // symbol -> description

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let char = this.grid[y]?.[x] || ' ';
                let cssClass = '';

                if (!this.revealed[y]?.[x]) {
                    char = '▓';
                    cssClass = 'tile-fog';
                } else {
                    // Check for player
                    if (x === this.playerX && y === this.playerY) {
                        char = '@';
                        cssClass = 'tile-player';
                        visibleSymbols.add('@');
                    } else {
                        // Check for entities at this position
                        const entity = this.entities.find(e => e.x === x && e.y === y);
                        if (entity) {
                            char = entity.symbol;
                            cssClass = entity.cssClass || 'tile-npc';
                            visibleSymbols.add(char);
                            entitySymbols.set(char, entity.legendName || entity.name);
                        } else {
                            visibleSymbols.add(char);
                            cssClass = TILE_CSS[char] || '';
                        }
                    }
                }

                html += `<span class="${cssClass}">${char}</span>`;
            }
            html += '\n';
        }

        this.mapEl.innerHTML = html;

        // Render leyenda dinámica
        this._renderLegend(visibleSymbols, entitySymbols);

        // Render info
        this.infoEl.innerHTML = `<span class="text-cyan">${this.mapName}</span>`;
    }

    /**
     * Renderiza la leyenda debajo del mapa
     */
    _renderLegend(visibleSymbols, entitySymbols) {
        let legendHtml = '<div class="legend-title">— Leyenda —</div>';

        // Siempre mostrar el jugador primero
        if (visibleSymbols.has('@')) {
            legendHtml += this._legendEntry('@', 'tile-player', TILE_DESCRIPTIONS['@']);
        }

        // Entidades (NPCs, enemigos)
        for (const [symbol, desc] of entitySymbols) {
            const entity = this.entities.find(e => e.symbol === symbol);
            const css = entity?.cssClass || 'tile-npc';
            legendHtml += this._legendEntry(symbol, css, desc);
        }

        // Tiles del mapa
        const tileOrder = ['#', '.', 'D', 'L', '>', '<', '~', '!', 'T'];
        for (const tile of tileOrder) {
            if (visibleSymbols.has(tile) && TILE_DESCRIPTIONS[tile]) {
                legendHtml += this._legendEntry(tile, TILE_CSS[tile] || '', TILE_DESCRIPTIONS[tile]);
            }
        }

        this.legendEl.innerHTML = legendHtml;
    }

    _legendEntry(symbol, cssClass, description) {
        return `<div class="legend-entry"><span class="legend-symbol ${cssClass}">${symbol}</span> <span>${description}</span></div>`;
    }

    /**
     * Verifica si una posición es transitable
     */
    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        const tile = this.grid[y][x];
        return tile !== '#' && tile !== ' ' && tile !== '~';
    }

    /**
     * Obtiene la descripción del tile actual
     */
    getTileAt(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        return this.grid[y][x];
    }

    /**
     * Obtiene entidades en una posición
     */
    getEntityAt(x, y) {
        return this.entities.find(e => e.x === x && e.y === y);
    }

    /**
     * Obtiene todas las entidades de un tipo en un radio desde un punto
     */
    getEntitiesInRadius(cx, cy, radius, type = null) {
        return this.entities.filter(e => {
            if (type && e.type !== type) return false;
            const dist = Math.sqrt((e.x - cx) ** 2 + (e.y - cy) ** 2);
            return dist <= radius;
        });
    }

    /**
     * Limpia el mapa
     */
    clear() {
        this.mapEl.innerHTML = '';
        this.legendEl.innerHTML = '';
        this.infoEl.innerHTML = '';
    }
}
