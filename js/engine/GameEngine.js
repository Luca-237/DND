// ============================================
// GameEngine — Motor principal del juego
// ============================================

import { GameState, GAME_PHASES } from './GameState.js';
import { EventBus } from './EventBus.js';
import { DiceRoller } from './DiceRoller.js';
import { Terminal } from '../ui/Terminal.js';
import { MapRenderer } from '../world/MapRenderer.js';
import { CharacterCreator } from '../character/CharacterCreator.js';
import { getScenario } from '../world/scenarios.js';
import { formatModifier, SKILLS } from '../character/AbilityScores.js';
import { getEquipmentById } from '../data/equipment.js';
import { getSpellById } from '../data/spells.js';
import { Character } from '../character/Character.js';

export class GameEngine {
    constructor() {
        this.state = new GameState();
        this.events = new EventBus();
        this.terminal = new Terminal();
        this.map = new MapRenderer();
        this.currentScenario = null;
        this.npcDialogueIndex = {};
        this.activeLightSource = null; // 'torch', 'candle', 'spell', or null
    }

    /**
     * Inicia el juego
     */
    async start() {
        this._showTitle();
        await this._waitForStart();

        // Comprobar localStorage
        const savedData = localStorage.getItem('eregepeia_character');
        let useSaved = false;

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                this.terminal.writeBlank();
                this.terminal.writeSystem(`Personaje guardado encontrado: ${parsed.name} (${parsed.className} Nivel ${parsed.level})`);
                this.terminal.writeOption(1, `Continuar aventura con ${parsed.name}`);
                this.terminal.writeOption(2, 'Crear un nuevo personaje');
                this.terminal.writeBlank();
                
                const choice = await this.terminal.waitForChoice(1, 2);
                if (choice === 1) {
                    useSaved = true;
                    const charObj = new Character();
                    Object.assign(charObj, parsed);
                    this.state.character = charObj;
                } else {
                    localStorage.removeItem('eregepeia_character');
                }
            } catch (e) {
                console.error("Error al cargar personaje", e);
                localStorage.removeItem('eregepeia_character');
            }
        }

        if (!useSaved) {
            // Creación de personaje
            this.state.setPhase(GAME_PHASES.CHARACTER_CREATION);
            const creator = new CharacterCreator(this.terminal, this.events);
            const character = await creator.start();
            this.state.character = character;
        }

        // Restaurar mapa por si venimos de la creación de personaje
        const mapDisplay = document.getElementById('map-display');
        if (mapDisplay && !useSaved) {
            mapDisplay.innerHTML = '<pre id="map-ascii"></pre>';
            this.map.mapEl = document.getElementById('map-ascii');
        }

        // Iniciar exploración
        await this._startExploration('tavern');
    }

    /**
     * Muestra la pantalla de título
     */
    _showTitle() {
        this.terminal.clear();
        this.map.clear();
        this.terminal.writeAsciiArt(`
    ███████╗██████╗ ███████╗ ██████╗ ███████╗██████╗ ██╗ █████╗
    ██╔════╝██╔══██╗██╔════╝██╔════╝ ██╔════╝██╔══██╗██║██╔══██╗
    █████╗  ██████╔╝█████╗  ██║  ███╗█████╗  ██████╔╝██║███████║
    ██╔══╝  ██╔══██╗██╔══╝  ██║   ██║██╔══╝  ██╔═══╝ ██║██╔══██║
    ███████╗██║  ██║███████╗╚██████╔╝███████╗██║     ██║██║  ██║
    ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝`);
        this.terminal.writeBlank();
        this.terminal.writeSubtitle('⚔ Un RPG de texto inspirado en D&D 2024 ⚔');
        this.terminal.writeBlank();
        this.terminal.writeDivider('═', 50);
        this.terminal.writeBlank();
        this.terminal.writeNarrative('En las tierras de Eregepia, la oscuridad se extiende.');
        this.terminal.writeNarrative('Criaturas ancestrales despiertan en las profundidades,');
        this.terminal.writeNarrative('y solo los más valientes se atreven a enfrentar lo desconocido.');
        this.terminal.writeBlank();
        this.terminal.writeDivider('─', 50);
        this.terminal.writeBlank();
        this.terminal.writeOption(1, 'Nueva Partida');
        this.terminal.writeBlank();
    }

    async _waitForStart() {
        await this.terminal.waitForChoice(1, 1);
    }

    /**
     * Inicia la exploración de un escenario
     */
    async _startExploration(scenarioId) {
        this.state.setPhase(GAME_PHASES.EXPLORATION);
        this.currentScenario = getScenario(scenarioId);
        this.state.currentScenario = scenarioId;

        if (!this.currentScenario) {
            this.terminal.writeError(`Escenario "${scenarioId}" no encontrado.`);
            return;
        }

        const scenario = this.currentScenario;
        const char = this.state.character;

        // Posición del jugador
        char.x = scenario.playerStart.x;
        char.y = scenario.playerStart.y;

        // Inicializar mapa
        const gridCopy = scenario.grid.map(row => [...row]);
        this.map.init(gridCopy, char.x, char.y, scenario.name);

        // Agregar entidades
        scenario.entities.forEach(entity => {
            this.map.addEntity({ ...entity });
        });

        // Configurar visión según escenario (oscuridad)
        this._updateVisionForScenario();

        this.map.render();

        // Mostrar descripción del escenario
        this.terminal.clear();
        this.terminal.writeTitle(`📍 ${scenario.name}`);
        this.terminal.writeDivider('─', 45);
        this.terminal.writeBlank();
        scenario.description.forEach(line => {
            this.terminal.writeNarrative(line);
        });
        this.terminal.writeBlank();

        // Log
        this.state.addLog(`Entraste a: ${scenario.name}`, 'exploration');
        this.state.markVisited(scenarioId);

        // Game loop
        await this._explorationLoop();
    }

    /**
     * Loop principal de exploración
     */
    async _explorationLoop() {
        while (this.state.phase === GAME_PHASES.EXPLORATION) {
            this._showMenu();
            const choice = await this.terminal.waitForInput('any');

            switch (choice) {
                case '1': await this._showInventory(); break;
                case '2': await this._showStats(); break;
                case '3': await this._showSpells(); break;
                case '4': await this._handleMovement(); break;
                case '5': await this._handleFreeWrite(); break;
                case '6': await this._showLogs(); break;
                case '7': await this._handleRest(); break;
                case 'w': case 'W': await this._move(0, -1); break;
                case 's': case 'S': await this._move(0, 1); break;
                case 'a': case 'A': await this._move(-1, 0); break;
                case 'd': case 'D': await this._move(1, 0); break;
                default:
                    this.terminal.writeError('Opción no válida. Usa un número del menú o WASD para moverte.');
            }
        }
    }

    /**
     * Muestra el menú de opciones
     */
    _showMenu() {
        this.terminal.writeBlank();
        this.terminal.writeDivider('═', 50);
        this.terminal.writeLine(
            '<span class="text-bright">[1]</span> <span class="text-yellow">📦 Inventario</span>  ' +
            '<span class="text-bright">[2]</span> <span class="text-yellow">📊 Stats</span>  ' +
            '<span class="text-bright">[3]</span> <span class="text-yellow">📖 Spells</span>  ' +
            '<span class="text-bright">[4]</span> <span class="text-yellow">🧭 Moverse</span>'
        );
        this.terminal.writeLine(
            '<span class="text-bright">[5]</span> <span class="text-yellow">✏️  Escribir</span>  ' +
            '<span class="text-bright">[6]</span> <span class="text-yellow">📜 Logs</span>    ' +
            '<span class="text-bright">[7]</span> <span class="text-yellow">🏕️  Descansar</span>  ' +
            '<span class="text-dim">WASD: Mover</span>'
        );
        this.terminal.writeDivider('═', 50);
    }

    // ── INVENTARIO ───────────────────────────────
    async _showInventory() {
        const char = this.state.character;
        let inInventory = true;

        while (inInventory) {
            this.terminal.writeBlank();
            this.terminal.writeTitle('📦 INVENTARIO');
            this.terminal.writeDivider('─', 35);

            if (char.inventory.length === 0) {
                this.terminal.writeNarrative('Tu inventario está vacío.');
                this.terminal.writeLine(`\n  <span class="text-yellow">💰 Oro: ${char.gold} po</span>`);
                this.terminal.writeBlank();
                this.terminal.writeOption(1, 'Volver');
                await this.terminal.waitForChoice(1, 1);
                inInventory = false;
                return;
            }

            char.inventory.forEach((item, i) => {
                const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
                const equipped = (item === char.equippedWeapon) ? ' <span class="text-green">[Equipado]</span>' : '';
                this.terminal.writeOption(i + 1, `${item.name}${qty}${equipped}`);
            });
            this.terminal.writeLine(`\n  <span class="text-yellow">💰 Oro: ${char.gold} po</span>`);
            this.terminal.writeBlank();
            
            const exitOpt = char.inventory.length + 1;
            this.terminal.writeOption(exitOpt, 'Volver');

            const choice = await this.terminal.waitForChoice(1, exitOpt);

            if (choice === exitOpt) {
                inInventory = false;
            } else {
                const item = char.inventory[choice - 1];
                await this._interactWithItem(item);
            }
        }
    }

    async _interactWithItem(item) {
        const char = this.state.character;
        let viewing = true;

        while (viewing) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-yellow">🔍 Analizando: ${item.name}</span>`);
            this.terminal.writeDivider('─', 35);

            const details = getEquipmentById(item.name);
            if (details) {
                if (details.equipType === 'weapon') {
                    this.terminal.writeLine(`<span class="text-white">Daño:</span> <span class="text-red">${details.damage} ${details.damageType}</span>`);
                    this.terminal.writeLine(`<span class="text-white">Propiedades:</span> <span class="text-cyan">${details.properties.join(', ') || 'Ninguna'}</span>`);
                    this.terminal.writeLine(`<span class="text-white">Maestría:</span> <span class="text-magenta">${details.mastery}</span>`);
                } else if (details.equipType === 'armor') {
                    this.terminal.writeLine(`<span class="text-white">CA:</span> <span class="text-yellow">${details.ac}</span>`);
                    this.terminal.writeLine(`<span class="text-white">Tipo:</span> <span class="text-cyan">${details.type}</span>`);
                    if (details.stealthDisadvantage) {
                        this.terminal.writeLine(`<span class="text-red">Desventaja en Sigilo</span>`);
                    }
                } else if (details.equipType === 'gear') {
                    this.terminal.writeLine(`<span class="text-white">${details.description}</span>`);
                }
            } else {
                let desc = '';
                if (item.type === 'weapon') desc = 'Arma. Puede ser equipada para combate.';
                else if (item.type === 'consumable') desc = 'Objeto consumible.';
                else desc = 'Objeto misceláneo.';
                this.terminal.writeLine(`<span class="text-white">${desc}</span>`);
            }
            this.terminal.writeBlank();

            const isEquipped = (char.equippedWeapon === item);
            this.terminal.writeOption(1, isEquipped ? 'Desequipar' : 'Equipar / Usar');
            this.terminal.writeOption(2, 'Volver');

            const action = await this.terminal.waitForChoice(1, 2);

            if (action === 2) {
                viewing = false;
            } else if (action === 1) {
                if (item.type === 'weapon' || (details && details.equipType === 'weapon')) {
                    if (isEquipped) {
                        char.equippedWeapon = null;
                        this.terminal.writeSuccess(`Has desequipado: ${item.name}`);
                    } else {
                        char.equippedWeapon = item;
                        this.terminal.writeSuccess(`Has equipado: ${item.name}`);
                    }
                } else if (item.type === 'consumable' || item.name.includes('Poción') || item.name.includes('Raciones')) {
                    this.terminal.writeSuccess(`Usaste: ${item.name}`);
                    if (item.name.includes('Poción de Curación')) {
                        const heal = DiceRoller.parse('2d4+2');
                        char.heal(heal.total);
                        this.terminal.writeSuccess(`Recuperas ${heal.total} PG. PG actual: ${char.currentHP}/${char.maxHP}`);
                    }
                    item.quantity--;
                    if (item.quantity <= 0) {
                        char.inventory = char.inventory.filter(i => i !== item);
                        viewing = false;
                    }
                } else {
                    this.terminal.writeNarrative(`Examinas ${item.name}, pero no tiene un uso evidente por ahora.`);
                }
                if (viewing) {
                    this.terminal.writeBlank();
                    this.terminal.writeOption(1, 'Continuar');
                    await this.terminal.waitForChoice(1, 1);
                    viewing = false;
                }
            }
        }
    }

    // ── STATS ────────────────────────────────────
    async _showStats() {
        const char = this.state.character;
        this.terminal.writeBlank();
        this.terminal.writeTitle(`📊 ${char.name}`);
        this.terminal.writeDivider('─', 35);

        const lines = char.getStatsSummary();
        lines.forEach(line => {
            this.terminal.writeLine(`<span class="text-white">${line}</span>`, 'stat-line');
        });

        // Habilidades con bonificadores
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-cyan">Competencias en Habilidades:</span>');
        char.skillProficiencies.forEach(skill => {
            const bonus = char.getSkillBonus(skill);
            this.terminal.writeLine(`  <span class="text-white">${skill}:</span> <span class="text-green">+${bonus}</span>`);
        });

        // Rasgos
        this.terminal.writeBlank();
        this.terminal.writeLine('<span class="text-yellow">Rasgos:</span>');
        char.raceTraits.forEach(t => {
            this.terminal.writeLine(`  <span class="text-cyan">• ${t.name}</span>`);
        });
        char.features.forEach(f => {
            this.terminal.writeLine(`  <span class="text-cyan">• ${f.name}</span>`);
        });
        if (char.originFeat) {
            this.terminal.writeLine(`  <span class="text-yellow">★ ${char.originFeat.name}</span>`);
        }

        this.terminal.writeBlank();
    }

    // ── HECHIZOS ─────────────────────────────────
    async _showSpells() {
        const char = this.state.character;
        let viewing = true;

        while (viewing) {
            this.terminal.writeBlank();
            this.terminal.writeTitle('📖 LIBRO DE HECHIZOS');
            this.terminal.writeDivider('─', 35);

            if (!char.spellcastingAbility) {
                this.terminal.writeNarrative('Tu clase no posee habilidades mágicas.');
                this.terminal.writeBlank();
                return;
            }

            this.terminal.writeLine(`<span class="text-cyan">Aptitud Mágica:</span> <span class="text-yellow">${char.spellcastingAbility}</span>`);
            this.terminal.writeLine(`<span class="text-cyan">Ataque Mágico:</span> <span class="text-yellow">+${char.spellAttackBonus}</span>  |  <span class="text-cyan">CD:</span> <span class="text-yellow">${char.spellSaveDC}</span>`);

            // Spell slots
            let currentSlots = 0;
            if (char.spellSlots[1]) {
                currentSlots = char.currentSpellSlots[1] || 0;
                const max = char.spellSlots[1];
                this.terminal.writeLine(`<span class="text-cyan">Espacios Nv1:</span> <span class="text-yellow">${'◆'.repeat(currentSlots)}${'◇'.repeat(max - currentSlots)}</span> (${currentSlots}/${max})`);
            }

            let allSpells = [];

            // Cantrips
            if (char.knownCantrips.length > 0) {
                this.terminal.writeBlank();
                this.terminal.writeLine('<span class="text-magenta">── Cantrips (A voluntad) ──</span>');
                char.knownCantrips.forEach((spell) => {
                    allSpells.push(spell);
                    this.terminal.writeLine(`  <span class="text-yellow">${allSpells.length}.</span> <span class="text-white">${spell.name}</span> <span class="text-dim">[${spell.school}]</span>`);
                    this.terminal.writeLine(`     <span class="text-dim">${spell.castTime} | ${spell.range} | ${spell.duration}</span>`);
                    this.terminal.writeLine(`     <span class="text-dim">${spell.description}</span>`);
                });
            }

            // Level 1 spells
            if (char.knownSpells.length > 0) {
                this.terminal.writeBlank();
                this.terminal.writeLine('<span class="text-magenta">── Nivel 1 ──</span>');
                char.knownSpells.forEach((spell) => {
                    allSpells.push(spell);
                    this.terminal.writeLine(`  <span class="text-yellow">${allSpells.length}.</span> <span class="text-white">${spell.name}</span> <span class="text-dim">[${spell.school}]</span>`);
                    this.terminal.writeLine(`     <span class="text-dim">${spell.castTime} | ${spell.range} | ${spell.duration}</span>`);
                    this.terminal.writeLine(`     <span class="text-dim">${spell.description}</span>`);
                });
            }

            this.terminal.writeBlank();
            
            if (allSpells.length === 0) {
                this.terminal.writeOption(1, 'Volver');
                await this.terminal.waitForChoice(1, 1);
                viewing = false;
                break;
            }

            this.terminal.writeOption(1, 'Lanzar hechizo');
            this.terminal.writeOption(2, 'Volver');
            const action = await this.terminal.waitForChoice(1, 2);

            if (action === 2) {
                viewing = false;
            } else {
                this.terminal.writeBlank();
                this.terminal.writeNarrative('Elige el número del hechizo a lanzar (o 0 para cancelar):');
                const spellIdx = await this.terminal.waitForChoice(0, allSpells.length);
                if (spellIdx === 0) continue;

                const spell = allSpells[spellIdx - 1];
                const isLevel1 = char.knownSpells.includes(spell);

                if (isLevel1 && currentSlots <= 0) {
                    this.terminal.writeError('No te quedan espacios de conjuro de nivel 1.');
                    await this.terminal.waitForChoice(1, 1);
                    continue;
                }

                // Intentar lanzar el hechizo fuera de combate
                const lowerName = spell.name.toLowerCase();
                const canCastOut = ['luz', 'curar', 'sanar', 'prestidigitación', 'taumaturgia', 'ilusión'].some(kw => lowerName.includes(kw));

                if (!canCastOut) {
                    this.terminal.writeError('Ese hechizo no tiene un uso obvio fuera de combate ahora mismo.');
                } else {
                    this.terminal.writeLine(`<span class="text-magenta">✨ Conjuras ${spell.name}!</span>`);
                    if (isLevel1) {
                        char.currentSpellSlots[1]--;
                    }
                    
                    if (lowerName.includes('curar') || lowerName.includes('sanar')) {
                        const heal = DiceRoller.parse('1d8').total + char.getAbilityModifier(char.spellcastingAbility);
                        char.heal(heal);
                        this.terminal.writeSuccess(`La magia recorre tus venas. Curas ${heal} PG. PG: ${char.currentHP}/${char.maxHP}`);
                    } else if (lowerName.includes('luz')) {
                        this.activeLightSource = 'spell';
                        this._updateVisionForScenario();
                        this.terminal.writeSuccess('Una luz brillante ilumina los alrededores.');
                    } else {
                        this.terminal.writeSuccess(`Usas ${spell.name}. El entorno reacciona sutilmente a tu magia.`);
                    }
                }
                
                this.terminal.writeBlank();
                this.terminal.writeOption(1, 'Continuar');
                await this.terminal.waitForChoice(1, 1);
            }
        }
    }

    // ── MOVIMIENTO ───────────────────────────────
    async _handleMovement() {
        this.terminal.writeBlank();
        this.terminal.writeNarrative('Has entrado al Modo Movimiento. Usa WASD o las flechas para moverte.');
        this.terminal.writeNarrative('Presiona Q para salir. El modo se detendrá si encuentras algo de interés.');
        this.terminal.writeDivider('─', 35);
        this.state.addLog('Iniciaste Modo Movimiento fluido', 'system');

        let moving = true;
        while (moving) {
            const key = await this.terminal.waitForKey(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'q', 'Escape']);
            
            if (key === 'q' || key === 'escape') {
                this.terminal.writeNarrative('Saliendo del modo movimiento.');
                break;
            }

            let dx = 0, dy = 0, dirName = '';
            switch(key) {
                case 'arrowup': case 'w': dy = -1; dirName = 'norte'; break;
                case 'arrowdown': case 's': dy = 1; dirName = 'sur'; break;
                case 'arrowleft': case 'a': dx = -1; dirName = 'oeste'; break;
                case 'arrowright': case 'd': dx = 1; dirName = 'este'; break;
            }

            const moveResult = await this._move(dx, dy, dirName);
            if (moveResult === 'interrupted') {
                moving = false;
            }
        }
    }

    async _move(dx, dy, dirName = '') {
        const char = this.state.character;
        const newX = char.x + dx;
        const newY = char.y + dy;

        // Comprobar límites y walkability
        if (!this.map.isWalkable(newX, newY)) {
            const tile = this.map.getTileAt(newX, newY);
            if (tile === '#') {
                this.terminal.writeNarrative('Una pared de piedra sólida bloquea tu camino.');
            } else if (tile === '~') {
                this.terminal.writeNarrative('Un cuerpo de agua te impide pasar.');
            } else {
                this.terminal.writeNarrative('No puedes ir en esa dirección.');
            }
            return;
        }

        // Mover al jugador
        char.x = newX;
        char.y = newY;
        this.map.movePlayer(newX, newY);
        this.state.turn++;

        // Comprobar tile especial
        const tile = this.map.getTileAt(newX, newY);

        // Comprobar transiciones dinámicas
        const transitionKey = `${newX},${newY}`;
        const currentScenario = this.currentScenario;
        if (currentScenario?.transitions && currentScenario.transitions[transitionKey]) {
            const trans = currentScenario.transitions[transitionKey];
            this.terminal.writeSystem(trans.text);
            this.terminal.writeOption(1, trans.option);
            this.terminal.writeOption(2, 'Quedarse');
            const choice = await this.terminal.waitForChoice(1, 2);
            if (choice === 1) {
                await this._startExploration(trans.target);
                return 'interrupted';
            }
            return 'interrupted';
        }

        if (tile === 'D' || tile === 'L') {
            this.terminal.writeNarrative('Abres la puerta y avanzas.');
            this.map.grid[newY][newX] = 'd'; // Puerta abierta
        } else if (tile === '>') {
            this.terminal.writeSystem('Ves unas escaleras que descienden a la oscuridad...');
        } else if (tile === '<') {
            this.terminal.writeSystem('Ves escaleras que ascienden...');
        }

        // Comprobar entidad en la posición
        const entity = this.map.getEntityAt(newX, newY);
        let interrupted = false;
        if (entity) {
            if (entity.type === 'npc') {
                await this._interactWithNPC(entity);
                interrupted = true;
            } else if (entity.type === 'enemy') {
                await this._encounterEnemy(entity);
                interrupted = true;
            } else if (entity.type === 'chest') {
                await this._openChest(entity);
                interrupted = true;
            }
        }

        // Descripción ambiental aleatoria
        if (Math.random() < 0.15 && !entity) {
            const ambience = this._getRandomAmbience();
            this.terminal.writeLine(`<span class="text-dim">${ambience}</span>`);
        }

        const dName = dirName || this._getDirName(dx, dy);
        this.state.addLog(`Te moviste al ${dName} (${newX}, ${newY})`, 'movement');

        // IA de enemigos: mover enemigos cercanos hacia el jugador
        if (!interrupted) {
            const aiResult = await this._processEnemyAI();
            if (aiResult === 'combat') return 'interrupted';
        }

        if (interrupted) return 'interrupted';
        return 'success';
    }

    _getDirName(dx, dy) {
        if (dy < 0) return 'norte';
        if (dy > 0) return 'sur';
        if (dx < 0) return 'oeste';
        if (dx > 0) return 'este';
        return '';
    }
    _getRandomAmbience() {
        const scenarioId = this.currentScenario?.id;
        const ambienceMap = {
            tavern: [
                'El fuego crepita suavemente en la chimenea.',
                'Escuchas risas apagadas desde algún rincón de la taberna.',
                'Un ratón se escabulle rápidamente bajo una mesa.',
                'El olor a estofado te hace rugir el estómago.',
                'Una corriente de aire frío entra por debajo de la puerta.',
                'Las velas parpadean proyectando sombras danzantes en las paredes.',
                'Alguien tose en una esquina oscura del salón.',
                'El tabernero silba una melodía antigua mientras limpia una jarra.'
            ],
            catacombs_entrance: [
                'Un eco lejano resuena en los corredores de piedra.',
                'El agua gotea lentamente desde el techo.',
                'Sientes un escalofrío recorrer tu espalda.',
                'El aire huele a moho y algo indefinidamente muerto.',
                'Tus pasos levantan una fina nube de polvo antiguo.',
                'Crees escuchar huesos crujiendo en la distancia...',
                'Una corriente de aire frío te golpea la cara.',
                'Algo se mueve en las sombras... o quizás fue tu imaginación.'
            ],
            catacombs_ossuary: [
                'Huesos crujen bajo tus pies con cada paso.',
                'Un cráneo parece seguirte con sus cuencas vacías.',
                'El hedor a muerte y polvo de huesos es casi insoportable.',
                'Las pilas de huesos vibran imperceptiblemente...',
                'Escuchas un susurro en un idioma olvidado.',
                'Una mandíbula se cae de la pared con un chasquido seco.',
                'El aire se siente más pesado aquí, como si la oscuridad tuviera peso.',
                'Las runas en las paredes parpadean débilmente.'
            ],
            catacombs_altar: [
                'La energía oscura del altar pulsa como un latido maligno.',
                'Llamas púrpuras danzan en los bordes de tu visión.',
                'El suelo tiembla levemente bajo tus pies.',
                'Sientes una presencia antigua observándote con odio.',
                'El aire crepita con energía nigromántica.',
                'Susurros ininteligibles emanan del altar profanado.',
                'Una onda de frío sobrenatural te envuelve momentáneamente.',
                'Los huesos de los caídos resuenan como campanas funerarias.'
            ]
        };
        const ambiences = ambienceMap[scenarioId] || ambienceMap.catacombs_entrance;
        return ambiences[Math.floor(Math.random() * ambiences.length)];
    }

    // ── VISIÓN EN OSCURIDAD ───────────────────

    /**
     * Actualiza el radio de visión según el escenario y las capacidades del personaje.
     * Salas oscuras reducen la visión a menos que el personaje tenga visión en la oscuridad
     * o una fuente de luz activa.
     */
    _updateVisionForScenario() {
        const scenario = this.currentScenario;
        const char = this.state.character;
        if (!scenario || !char) return;

        const isDark = scenario.dark === true;
        const FULL_VISION = 5;
        const DARK_VISION = 3;   // visión reducida con darkvision (sin color, pero ves)
        const NO_LIGHT_VISION = 1; // casi ciego, solo la casilla adyacente

        if (!isDark) {
            // Escenario iluminado
            this.map.setVisionRadius(FULL_VISION);
            return;
        }

        // Escenario oscuro: comprobar fuentes de luz
        const hasLightSource = this._hasActiveLightSource();
        const hasDarkvision = char.darkvision > 0;

        if (hasLightSource) {
            // Antorcha/vela/hechizo: visión completa
            this.map.setVisionRadius(FULL_VISION);
        } else if (hasDarkvision) {
            // Darkvision: visión reducida (tonos grises, D&D style)
            this.map.setVisionRadius(DARK_VISION);
        } else {
            // Sin luz ni darkvision: prácticamente ciego
            this.map.setVisionRadius(NO_LIGHT_VISION);
            this.terminal.writeLine(`<span class="text-red">⚠ Estás en la oscuridad total. Tu visión está severamente reducida.</span>`);
            this.terminal.writeLine(`<span class="text-dim">Usa una antorcha, vela o hechizo de luz para ver mejor.</span>`);
        }
    }

    /**
     * Comprueba si el personaje tiene una fuente de luz activa.
     * Busca en inventario: Antorcha, Vela, o hechizo de luz conocido.
     */
    _hasActiveLightSource() {
        const char = this.state.character;

        // Fuente de luz manual activa
        if (this.activeLightSource) return true;

        // Buscar en inventario
        const lightItems = ['antorcha', 'vela', 'linterna', 'lámpara'];
        const hasLightItem = char.inventory.some(item =>
            lightItems.some(li => item.name.toLowerCase().includes(li))
        );
        if (hasLightItem) {
            this.activeLightSource = 'item';
            return true;
        }

        // Buscar hechizos de luz conocidos (cantrips)
        const lightSpells = ['luz', 'light', 'fuego sagrado', 'luces danzantes', 'dancing lights'];
        const hasLightSpell = char.knownCantrips?.some(spell =>
            lightSpells.some(ls => spell.name.toLowerCase().includes(ls))
        );
        if (hasLightSpell) {
            this.activeLightSource = 'spell';
            return true;
        }

        return false;
    }

    // ── IA DE ENEMIGOS ────────────────────────

    /**
     * Procesa la IA de todos los enemigos cercanos.
     * Los enemigos que ven al jugador se mueven hacia él.
     * Si un enemigo llega adyacente, inicia combate.
     */
    async _processEnemyAI() {
        const char = this.state.character;
        const visionRange = this.map.visionRadius + 2; // los enemigos ven un poco más
        const enemies = this.map.getEntitiesInRadius(char.x, char.y, visionRange, 'enemy');

        for (const enemy of enemies) {
            // Comprobar línea de visión directa (sin paredes/agua)
            if (!this.map.hasLineOfSight(enemy.x, enemy.y, char.x, char.y)) {
                continue;
            }

            // Calcular distancia
            const dist = Math.sqrt((enemy.x - char.x) ** 2 + (enemy.y - char.y) ** 2);

            // Si ya está adyacente (dist <= 1.5 para diagonales), combate
            if (dist <= 1.5) {
                this.terminal.writeLine(`<span class="text-red">⚠ ¡${enemy.name} se abalanza sobre ti!</span>`);
                await this._encounterEnemy(enemy);
                return 'combat';
            }

            // Velocidad del enemigo (en casillas por turno, default 1)
            const speed = enemy.stats?.speed || 1;

            // Mover el enemigo hacia el jugador (hasta 'speed' pasos)
            let moved = false;
            for (let step = 0; step < speed; step++) {
                const result = this._enemyMoveToward(enemy, char.x, char.y);
                if (!result) break;
                moved = true;

                // Después de moverse, comprobar si ahora está adyacente
                const newDist = Math.sqrt((enemy.x - char.x) ** 2 + (enemy.y - char.y) ** 2);
                if (newDist <= 1.5) {
                    this.terminal.writeLine(`<span class="text-red">⚠ ¡${enemy.name} te alcanza y ataca!</span>`);
                    await this._encounterEnemy(enemy);
                    return 'combat';
                }
            }

            if (moved) {
                this.terminal.writeLine(`<span class="text-dim">${enemy.name} se acerca amenazante...</span>`);
                this.state.addLog(`${enemy.name} se movió hacia ti.`, 'combat');
            }
        }

        return 'none';
    }

    /**
     * Mueve un enemigo un paso en dirección al objetivo (simple pathfinding greedy).
     * Intenta moverse en la mejor dirección cardinal/diagonal.
     * @returns {boolean} true si se movió
     */
    _enemyMoveToward(enemy, targetX, targetY) {
        const dx = targetX - enemy.x;
        const dy = targetY - enemy.y;

        // Generar opciones de movimiento ordenadas por prioridad
        const moves = [];

        // Movimiento ideal (dirección directa)
        const sx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        const sy = dy > 0 ? 1 : dy < 0 ? -1 : 0;

        // Prioridad: diagonal ideal > cardinal ideal > alternativas
        if (sx !== 0 && sy !== 0) moves.push({ x: sx, y: sy }); // diagonal
        if (sx !== 0) moves.push({ x: sx, y: 0 });              // horizontal
        if (sy !== 0) moves.push({ x: 0, y: sy });              // vertical
        // Alternativas laterales
        if (sy !== 0) moves.push({ x: 1, y: sy }, { x: -1, y: sy });
        if (sx !== 0) moves.push({ x: sx, y: 1 }, { x: sx, y: -1 });

        // Filtrar duplicados
        const seen = new Set();
        const uniqueMoves = moves.filter(m => {
            const key = `${m.x},${m.y}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        for (const move of uniqueMoves) {
            const newX = enemy.x + move.x;
            const newY = enemy.y + move.y;

            if (this.map.isWalkableForEntity(newX, newY, enemy.id)) {
                // Verificar que no se aleja del objetivo
                const oldDist = Math.sqrt((enemy.x - targetX) ** 2 + (enemy.y - targetY) ** 2);
                const newDist = Math.sqrt((newX - targetX) ** 2 + (newY - targetY) ** 2);
                if (newDist < oldDist) {
                    enemy.x = newX;
                    enemy.y = newY;
                    this.map.moveEntity(enemy.id, newX, newY);
                    return true;
                }
            }
        }

        return false;
    }


    // ── INTERACCIÓN CON NPC ─────────────────────
    async _interactWithNPC(npc) {
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-yellow">◆ ${npc.name}</span>`);
        this.terminal.writeDivider('─', 35);

        // Obtener índice de diálogo
        if (!this.npcDialogueIndex[npc.id]) {
            this.npcDialogueIndex[npc.id] = 0;
        }

        const idx = this.npcDialogueIndex[npc.id];
        let greeting = '';
        if (npc.dialogue && idx < npc.dialogue.length) {
            greeting = npc.dialogue[idx];
            this.npcDialogueIndex[npc.id]++;
        } else if (npc.dialogue && npc.dialogue.length > 0) {
            greeting = npc.dialogue[npc.dialogue.length - 1];
        }

        if (greeting) {
            this.terminal.writeLine(`<span class="text-white">"${greeting}"</span>`);
            this.terminal.writeChatMessage(npc.name, greeting, npc.kaomoji || '( ? )');
        }

        this.state.addLog(`Hablaste con ${npc.name}.`, 'dialogue');

        // Loop de diálogo con opciones
        let talking = true;
        while (talking) {
            this.terminal.writeBlank();

            // Filtrar opciones visibles (checkFlag, onceOnly)
            const visibleOptions = this._getVisibleOptions(npc.options || []);
            
            visibleOptions.forEach((opt, i) => {
                let label = opt.text;
                if (opt.cost) label += ` <span class="text-dim">(${opt.cost} po)</span>`;
                this.terminal.writeOption(i + 1, label);
            });
            
            const writeIdx = visibleOptions.length + 1;
            const exitIdx = writeIdx + 1;
            this.terminal.writeOption(writeIdx, 'Escribir (IA)', '✏️');
            this.terminal.writeOption(exitIdx, 'Despedirse', '👋');

            const choice = await this.terminal.waitForChoice(1, exitIdx);
            
            if (choice === exitIdx) {
                const farewell = npc.farewell || `Te despides de ${npc.name}.`;
                this.terminal.writeNarrative(farewell);
                talking = false;
            } else if (choice === writeIdx) {
                this.terminal.writeNarrative('Escribe tu respuesta:');
                const text = await this.terminal.waitForInput('text');
                this.terminal.writeChatMessage('Tú', text, '( •_•)');
                
                // Placeholder para la IA
                this.terminal.writeLine(`<span class="text-dim">[ Función de IA en desarrollo ]</span>`);
                const reply = `Interesante lo que dices ("${text}"). ¿Algo más?`;
                this.terminal.writeLine(`<span class="text-white">"${reply}"</span>`);
                this.terminal.writeChatMessage(npc.name, reply, npc.kaomoji || '( ? )');
            } else if (choice <= visibleOptions.length) {
                const opt = visibleOptions[choice - 1];
                await this._executeDialogueOption(npc, opt);
            }
        }
        this.terminal.writeBlank();
    }

    /**
     * Filtra opciones visibles según flags y estado
     */
    _getVisibleOptions(options) {
        return options.filter(opt => {
            // Opción ya usada (onceOnly)
            if (opt.onceOnly && opt._used) return false;
            // Requiere flag activo
            if (opt.requireFlag && !this.state.getFlag(opt.requireFlag)) return false;
            // Requiere flag NO activo
            if (opt.requireNoFlag && this.state.getFlag(opt.requireNoFlag)) return false;
            return true;
        });
    }

    /**
     * Ejecuta una opción de diálogo con todas sus acciones
     */
    async _executeDialogueOption(npc, opt) {
        const char = this.state.character;

        // Mostrar texto del jugador
        this.terminal.writeChatMessage('Tú', opt.text, '( •_•)');

        // Comprobar coste de oro
        if (opt.cost) {
            if (char.gold < opt.cost) {
                const failMsg = opt.failResponse || 'No tienes suficiente oro.';
                this.terminal.writeLine(`<span class="text-red">"${failMsg}"</span>`);
                this.terminal.writeChatMessage(npc.name, failMsg, npc.kaomoji || '( ? )');
                return;
            }
            char.gold -= opt.cost;
            this.terminal.writeLine(`<span class="text-dim">-${opt.cost} po</span>`);
        }

        // Tirada de habilidad si es necesaria
        if (opt.skillCheck) {
            const { skill, dc } = opt.skillCheck;
            const bonus = char.getSkillBonus(skill);
            const roll = DiceRoller.d20();
            const total = roll + bonus;
            this.terminal.writeLine(DiceRoller.formatRoll(skill, total, [roll], bonus));

            if (total < dc) {
                const failMsg = opt.skillCheck.failResponse || 'No lo logras.';
                this.terminal.writeLine(`<span class="text-red">"${failMsg}"</span>`);
                this.terminal.writeChatMessage(npc.name, failMsg, npc.kaomoji || '( ? )');
                return;
            }
            // Si pasó, continúa con la respuesta normal
        }

        // Mostrar respuesta del NPC
        this.terminal.writeLine(`<span class="text-white">"${opt.response}"</span>`);
        this.terminal.writeChatMessage(npc.name, opt.response, npc.kaomoji || '( ? )');

        // Dar item
        if (opt.giveItem && !opt._givenItem) {
            char.addItem({ 
                id: opt.giveItem.toLowerCase().replace(/\s/g, '_'), 
                name: opt.giveItem, 
                type: opt.giveItemType || 'gear', 
                quantity: opt.giveItemQty || 1 
            });
            this.terminal.writeSuccess(`Has recibido: ${opt.giveItem}`);
            opt._givenItem = true;
        }

        // Dar oro
        if (opt.giveGold) {
            char.gold += opt.giveGold;
            this.terminal.writeSuccess(`+${opt.giveGold} po`);
        }

        // Curar
        if (opt.heal) {
            const oldHP = char.currentHP;
            char.heal(opt.heal);
            this.terminal.writeSuccess(`Recuperas ${char.currentHP - oldHP} PG. PG: ${char.currentHP}/${char.maxHP}`);
        }

        // Setear flag
        if (opt.setFlag) {
            this.state.setFlag(opt.setFlag);
        }

        // Marcar como usada (onceOnly)
        if (opt.onceOnly) {
            opt._used = true;
        }

        // Log
        this.state.addLog(`Elegiste: "${opt.text}" con ${npc.name}`, 'dialogue');
    }

    // ── ENCUENTRO CON ENEMIGO ────────────────────
    async _encounterEnemy(enemy) {
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-red">⚔ ¡Encuentro hostil! ¡${enemy.name} te ataca!</span>`, 'combat');
        this.terminal.writeDivider('─', 35);

        const char = this.state.character;
        let enemyHP = enemy.stats.hp;
        const enemyAC = enemy.stats.ac;

        // --- Setup Combat UI ---
        const mapDisplay = document.getElementById('map-display');
        const mapLegend = document.getElementById('map-legend');
        
        const originalMapHtml = mapDisplay.innerHTML;
        const originalLegendHtml = mapLegend.innerHTML;
        
        const enemyImgUrl = `https://placehold.co/200x200/333333/FFFFFF/png?text=${encodeURIComponent(enemy.name)}`;
        
        const classMap = { 'guerrero': 'fighter', 'mago': 'wizard', 'picaro': 'rogue', 'clerigo': 'cleric', 'bardo': 'bard', 'druida': 'druid', 'explorador': 'ranger', 'paladin': 'paladin', 'brujo': 'warlock', 'hechicero': 'sorcerer' };
        const raceMap = { 'humano': 'human', 'elfo': 'elf', 'enano': 'dwarf', 'mediano': 'halfling', 'orco': 'orc', 'draconido': 'dragonborn', 'tiefling': 'tiefling' };
        const playerClassEn = classMap[char.classId] || 'fighter';
        const playerRaceEn = raceMap[char.raceId] || 'human';
        const playerImgUrl = `./img/portraits/${playerRaceEn}_${playerClassEn}.png`;

        mapDisplay.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-end; height:100%; padding: 40px; background: url('catacumbas1.jpeg') no-repeat center center; background-size: cover;">
                <div style="text-align:center;">
                    <img src="${enemyImgUrl}" style="width:150px; height:150px; border: 2px solid #cc0000; border-radius: 8px; object-fit: cover;" />
                    <div style="margin-top:10px; font-weight:bold; color:#cc0000; background:rgba(0,0,0,0.5); padding:2px;">${enemy.name}</div>
                </div>
                <div style="text-align:center;">
                    <img src="${playerImgUrl}" style="width:150px; height:150px; border: 2px solid #555; border-radius: 8px; object-fit: cover; transform: scaleX(-1);" />
                    <div style="margin-top:10px; font-weight:bold; background:rgba(0,0,0,0.5); padding:2px;">${char.name}</div>
                </div>
            </div>
        `;

        const updateCombatInfo = () => {
            mapLegend.innerHTML = `
                <div class="legend-title" style="color: #ffaa00; border-bottom: 1px solid #ffaa00; margin-bottom: 10px;">🛡 INFO DE COMBATE</div>
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                    <div style="margin-bottom:15px; flex: 1; min-width: 45%;">
                        <div style="font-weight:bold; color:#00ff00;">${char.name}</div>
                        <div>PG: ${char.currentHP} / ${char.maxHP}</div>
                        <div>CA: ${char.armorClass}</div>
                        ${char.maxSpellSlots > 0 ? `<div style="margin-top:5px; color:#00ffff;">Espacios: ${char.spellSlots} / ${char.maxSpellSlots}</div>` : ''}
                    </div>
                    <div style="flex: 1; min-width: 45%; text-align: right;">
                        <div style="font-weight:bold; color:#ff3333;">${enemy.name}</div>
                        <div>PG: ${Math.max(0, enemyHP)} / ${enemy.stats.hp}</div>
                        <div>CA: ${enemyAC}</div>
                    </div>
                </div>
            `;
        };

        const waitForSpace = async () => {
            this.terminal.writeLine('<span class="text-dim">[Presiona ESPACIO para continuar...]</span>');
            await this.terminal.waitForKey([' ']);
            this.terminal.writeBlank();
        };

        updateCombatInfo();

        while (enemyHP > 0 && char.currentHP > 0) {
            // Turno del jugador
            this.terminal.writeSystem('Tu turno:');
            this.terminal.writeOption(1, '⚔ Atacar');
            this.terminal.writeOption(2, '🏃 Huir');
            if (char.knownCantrips.length > 0 || char.knownSpells.length > 0) {
                this.terminal.writeOption(3, '✨ Lanzar hechizo');
            }
            this.terminal.writeOption(4, '📖 Acción Libre / Narrativa');
            this.terminal.writeBlank();

            const action = await this.terminal.waitForChoice(1, 4);

            if (action === 2) {
                // Huir
                const roll = DiceRoller.d20();
                const total = roll + char.getAbilityModifier('DES');
                await this.terminal.animateDiceRoll('Huida (DES)', DiceRoller.formatRoll('Huida', total, [roll], char.getAbilityModifier('DES')));
                
                if (total >= 12) {
                    this.terminal.writeSuccess('¡Logras escapar!');
                    this.state.addLog(`Huiste de ${enemy.name}.`, 'combat');
                    char.x -= 1;
                    this.map.movePlayer(char.x, char.y);
                    break;
                } else {
                    this.terminal.writeError('¡No logras escapar!');
                }
                await waitForSpace();
            } else if (action === 1) {
                // Atacar - Seleccionar arma
                const weapons = char.inventory.filter(i => i.type === 'weapon');
                if (weapons.length === 0) {
                    weapons.push({ id: 'unarmed', name: 'Golpe Desarmado', damage: '1' });
                }

                this.terminal.writeLine('¿Con qué atacas?');
                weapons.forEach((w, i) => this.terminal.writeOption(i + 1, w.name));
                const wIdx = await this.terminal.waitForChoice(1, weapons.length);
                const selectedWeapon = weapons[wIdx - 1];

                const attackRoll = DiceRoller.d20();
                const abilityMod = char.getAbilityModifier('FUE'); // Simplificación
                const totalAttack = attackRoll + abilityMod + char.proficiencyBonus;

                const attackStr = DiceRoller.formatRoll('Ataque', totalAttack, [attackRoll], abilityMod + char.proficiencyBonus);
                await this.terminal.animateDiceRoll('Tirada de Ataque', attackStr);
                await waitForSpace();

                if (attackRoll === 20 || totalAttack >= enemyAC) {
                    let dmgExpr = selectedWeapon.damage || '1d4';
                    if (attackRoll === 20 && dmgExpr.includes('d')) {
                        const parts = dmgExpr.split('d');
                        dmgExpr = `${parseInt(parts[0])*2}d${parts[1]}`;
                        this.terminal.writeLine(`<span class="text-yellow">¡¡GOLPE CRÍTICO!!</span>`, 'combat');
                    }
                    const dmgRoll = DiceRoller.parse(dmgExpr);
                    const totalDmg = dmgRoll.total + abilityMod;
                    
                    const dmgStr = DiceRoller.formatRoll('Daño', totalDmg, dmgRoll.rolls, abilityMod);
                    await this.terminal.animateDiceRoll('Tirada de Daño', dmgStr);
                    
                    this.terminal.writeLine(`<span class="text-green">¡Impactas a ${enemy.name} por ${totalDmg} de daño!</span>`, 'combat');
                    enemyHP -= totalDmg;
                } else {
                    this.terminal.writeLine(`<span class="text-red">Fallas el ataque.</span>`);
                }
                updateCombatInfo();
                await waitForSpace();

            } else if (action === 3) {
                // Hechizo
                const combatSpells = [...char.knownCantrips, ...char.knownSpells];
                if (combatSpells.length === 0) {
                    this.terminal.writeError('No tienes hechizos disponibles.');
                    await waitForSpace();
                    continue; 
                }

                this.terminal.writeLine('¿Qué hechizo lanzas?');
                combatSpells.forEach((s, i) => {
                    let levelLabel = s.level === 0 ? ' (Cantrip)' : ' (Nivel 1 - Consume 1 Espacio)';
                    let fxLabel = s.damage ? ` [${s.damage} daño]` : (s.healing ? ` [${s.healing} cura]` : ' [Efecto]');
                    this.terminal.writeOption(i + 1, `${s.name}${fxLabel}${levelLabel}`);
                });
                const sIdx = await this.terminal.waitForChoice(1, combatSpells.length);
                const baseSpell = combatSpells[sIdx - 1];
                const spell = getSpellById(baseSpell.id) || baseSpell;

                if (spell.level > 0) {
                    if (char.spellSlots <= 0) {
                        this.terminal.writeError('No tienes espacios de hechizo disponibles.');
                        await waitForSpace();
                        continue;
                    }
                    char.spellSlots--;
                    updateCombatInfo();
                }

                this.terminal.writeLine(`<span class="text-magenta">✨ Invocas ${spell.name}!</span>`);

                if (spell.damage) {
                    const attackRoll = DiceRoller.d20();
                    const totalAttack = attackRoll + char.spellAttackBonus;

                    const attackStr = DiceRoller.formatRoll('Ataque mágico', totalAttack, [attackRoll], char.spellAttackBonus);
                    await this.terminal.animateDiceRoll('Ataque Mágico', attackStr);
                    await waitForSpace();

                    if (totalAttack >= enemyAC || attackRoll === 20) {
                        let dmgExpr = spell.damage;
                        if (attackRoll === 20) {
                            const parts = dmgExpr.split('d');
                            dmgExpr = `${parseInt(parts[0])*2}d${parts[1]}`;
                            this.terminal.writeLine(`<span class="text-yellow">¡¡CRÍTICO MÁGICO!!</span>`);
                        }
                        const dmgRoll = DiceRoller.parse(dmgExpr);
                        const dmgStr = DiceRoller.formatRoll('Daño', dmgRoll.total, dmgRoll.rolls, 0);
                        await this.terminal.animateDiceRoll('Daño Mágico', dmgStr);

                        this.terminal.writeLine(`<span class="text-magenta">¡El hechizo golpea por ${dmgRoll.total} de daño!</span>`, 'combat');
                        enemyHP -= dmgRoll.total;
                    } else {
                        this.terminal.writeLine(`<span class="text-red">El hechizo falla.</span>`);
                    }
                } else if (spell.healing) {
                    const healRoll = DiceRoller.parse(spell.healing);
                    await this.terminal.animateDiceRoll('Curación Mágica', DiceRoller.formatRoll('Curación', healRoll.total, healRoll.rolls, 0));
                    char.heal(healRoll.total);
                    this.terminal.writeSuccess(`Recuperas ${healRoll.total} PG. (PG actuales: ${char.currentHP})`);
                } else {
                    this.terminal.writeLine(`<span class="text-cyan">${spell.description}</span>`);
                    this.terminal.writeLine(`<span class="text-dim">[ Efecto táctico/narrativo aplicado. ]</span>`);
                }

                updateCombatInfo();
                await waitForSpace();

            } else if (action === 4) {
                // Acción libre
                this.terminal.writeNarrative('Describe qué quieres hacer (ej. "le tiro arena a los ojos"):');
                const text = await this.terminal.waitForInput('text');
                this.terminal.writeLine(`<span class="text-cyan">Tú intentas: "${text}"</span>`);
                this.terminal.writeLine(`<span class="text-dim">[ La IA procesará esto pronto. Por ahora, asombrosamente, funciona y el DM queda perplejo. ]</span>`);
                
                // Efecto "dummy" positivo
                const roll = DiceRoller.d20();
                await this.terminal.animateDiceRoll('Suerte (DM)', DiceRoller.formatRoll('Suerte', roll, [roll], 0));
                if (roll >= 10) {
                    this.terminal.writeSuccess('¡Tu artimaña distrae al enemigo! Ganas ventaja en el próximo turno.');
                } else {
                    this.terminal.writeError('El enemigo no se deja engañar por tu táctica.');
                }
                await waitForSpace();
            }

            // Turno del enemigo (si sigue vivo)
            if (enemyHP > 0) {
                this.terminal.writeBlank();
                this.terminal.writeSystem(`Turno de ${enemy.name}:`);
                const enemyAttack = DiceRoller.d20() + 4;
                const eAttackStr = DiceRoller.formatRoll('Ataque enemigo', enemyAttack, [enemyAttack - 4], 4);
                await this.terminal.animateDiceRoll('Enemigo Ataca', eAttackStr);
                await waitForSpace();

                if (enemyAttack >= char.armorClass) {
                    const dmg = DiceRoller.parse('1d6');
                    const totalDmg = dmg.total + 2;
                    const eDmgStr = DiceRoller.formatRoll('Daño enemigo', totalDmg, dmg.rolls, 2);
                    await this.terminal.animateDiceRoll('Enemigo Daña', eDmgStr);
                    
                    char.takeDamage(totalDmg);
                    this.terminal.writeLine(`<span class="text-red">¡${enemy.name} te golpea por ${totalDmg} de daño!</span>`, 'combat');
                } else {
                    this.terminal.writeLine(`<span class="text-green">${enemy.name} falla su ataque.</span>`);
                }
                
                updateCombatInfo();
                await waitForSpace();
            }
        }

        // Restore map UI
        mapDisplay.innerHTML = originalMapHtml;
        mapLegend.innerHTML = originalLegendHtml;
        
        // Re-render map completely in case UI needs refreshing
        this.map.mapEl = document.getElementById('map-ascii');
        this.map.render();

        if (enemyHP <= 0) {
            this.terminal.writeBlank();
            this.terminal.writeLine(`<span class="text-yellow">⚔ ¡Has derrotado a ${enemy.name}!</span>`, 'combat');
            if (enemy.stats.xp) {
                this.terminal.writeLine(`<span class="text-yellow">✦ Ganas ${enemy.stats.xp} XP</span>`);
            }
            this.map.removeEntity(enemy.id);
            this.state.addLog(`Derrotaste a ${enemy.name} (+${enemy.stats.xp} XP).`, 'combat');
        }

        if (char.currentHP <= 0) {
            this.terminal.writeBlank();
            this.terminal.writeLine('<span class="text-red">═══════════════════════════</span>');
            this.terminal.writeLine('<span class="text-red">  ☠ HAS CAÍDO EN COMBATE ☠</span>');
            this.terminal.writeLine('<span class="text-red">═══════════════════════════</span>');
            this.state.setPhase(GAME_PHASES.GAME_OVER);
            this.terminal.writeBlank();
            this.terminal.writeOption(1, 'Crear nuevo personaje');
            await this.terminal.waitForChoice(1, 1);
            localStorage.removeItem('eregepeia_character');
            location.reload();
        }
    }

    // ── COFRE ────────────────────────────────────
    async _openChest(chest) {
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-yellow">📦 ¡Encontraste un ${chest.name}!</span>`, 'loot');

        if (chest.loot) {
            chest.loot.forEach(item => {
                if (item.type === 'gold') {
                    this.state.character.gold += item.amount;
                    this.terminal.writeLine(`  <span class="text-yellow">💰 +${item.amount} po</span>`);
                } else {
                    this.state.character.addItem({
                        id: item.name.toLowerCase().replace(/\s/g, '_'),
                        name: item.name,
                        type: 'consumable',
                        quantity: item.quantity || 1
                    });
                    const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
                    this.terminal.writeLine(`  <span class="text-white">+ ${item.name}${qty}</span>`);
                }
            });
        }

        this.map.removeEntity(chest.id);
        this.state.addLog(`Abriste ${chest.name}.`, 'loot');
        this.terminal.writeBlank();
    }

    // ── ESCRIBIR ACCIÓN LIBRE ────────────────────
    async _handleFreeWrite() {
        this.terminal.writeBlank();
        this.terminal.writeSystem('ACCIÓN LIBRE');
        this.terminal.writeNarrative('Escribe lo que quieres hacer (función de IA próximamente):');
        this.terminal.writeBlank();

        const input = await this.terminal.waitForInput('text');
        this.terminal.writeBlank();
        this.terminal.writeLine(`<span class="text-dim">Intentas: "${input}"</span>`);

        // Interpretación básica de comandos
        const lower = input.toLowerCase();
        if (lower.includes('mirar') || lower.includes('observar') || lower.includes('examinar')) {
            this.terminal.writeNarrative('Observas detenidamente tu entorno...');
            // Percepción check
            const check = DiceRoller.d20() + this.state.character.getSkillBonus('Percepción');
            this.terminal.writeLine(DiceRoller.formatRoll('Percepción', check, [check - this.state.character.getSkillBonus('Percepción')], this.state.character.getSkillBonus('Percepción')));
            if (check >= 15) {
                this.terminal.writeSuccess('Notas algunos detalles interesantes en tu entorno.');
            } else if (check >= 10) {
                this.terminal.writeNarrative('No notas nada fuera de lo común.');
            } else {
                this.terminal.writeNarrative('No notas nada especial.');
            }
        } else if (lower.includes('descansar') || lower.includes('dormir')) {
            await this._handleRest();
        } else if (lower.includes('buscar') || lower.includes('registrar')) {
            const check = DiceRoller.d20() + this.state.character.getSkillBonus('Investigación');
            this.terminal.writeLine(DiceRoller.formatRoll('Investigación', check, [check - this.state.character.getSkillBonus('Investigación')], this.state.character.getSkillBonus('Investigación')));
            if (check >= 15) {
                this.terminal.writeSuccess('Encuentras algo interesante...');
            } else {
                this.terminal.writeNarrative('No encuentras nada notable.');
            }
        } else {
            this.terminal.writeLine('<span class="text-dim">[ Esta función se expandirá con IA en futuras actualizaciones. Por ahora usa las opciones del menú. ]</span>');
        }

        this.state.addLog(`Acción libre: "${input}"`, 'action');
        this.terminal.writeBlank();
    }

    // ── LOGS ─────────────────────────────────────
    async _showLogs() {
        const logs = this.state.logs;
        this.terminal.writeBlank();
        this.terminal.writeTitle('📜 HISTORIAL');
        this.terminal.writeDivider('─', 35);

        if (logs.length === 0) {
            this.terminal.writeNarrative('No hay registros aún.');
        } else {
            const recentLogs = logs.slice(-20); // Últimos 20
            recentLogs.forEach(log => {
                const typeColors = {
                    'narrative': 'text-white',
                    'exploration': 'text-cyan',
                    'combat': 'text-red',
                    'dialogue': 'text-yellow',
                    'loot': 'text-orange',
                    'system': 'text-dim',
                    'movement': 'text-dim',
                    'action': 'text-magenta'
                };
                const color = typeColors[log.type] || 'text-white';
                this.terminal.writeLine(`  <span class="text-dim">[T${log.turn}]</span> <span class="${color}">${log.message}</span>`);
            });
        }
        this.terminal.writeBlank();
    }

    // ── DESCANSAR ────────────────────────────────
    async _handleRest() {
        const char = this.state.character;
        this.terminal.writeBlank();
        this.terminal.writeSystem('🏕️ DESCANSO');
        this.terminal.writeOption(1, 'Descanso Corto (1 hora — recuperar dados de golpe)');
        this.terminal.writeOption(2, 'Descanso Largo (8 horas — recuperar todo)');
        this.terminal.writeOption(3, 'Cancelar');
        this.terminal.writeBlank();

        const choice = await this.terminal.waitForChoice(1, 3);

        if (choice === 3) return;

        if (choice === 1) {
            // Descanso Corto
            this.terminal.writeNarrative('Te tomas un momento para descansar y vendas tus heridas...');
            const oldHP = char.currentHP;
            // Hit die healing
            const roll = DiceRoller.roll(char.hitDie);
            const healed = roll + char.getAbilityModifier('CON');
            char.heal(Math.max(0, healed));
            this.terminal.writeLine(DiceRoller.formatRoll('Dado de Golpe', healed, [roll], char.getAbilityModifier('CON')));
            this.terminal.writeSuccess(`Recuperas ${char.currentHP - oldHP} PG. PG: ${char.currentHP}/${char.maxHP}`);
            this.state.addLog('Tomaste un Descanso Corto.', 'system');
        } else {
            // Descanso Largo
            this.terminal.writeNarrative('Te recuestas y duermes profundamente durante 8 horas...');
            this.terminal.writeNarrative('El amanecer te despierta renovado.');
            char.longRest();
            this.terminal.writeSuccess(`Todos tus recursos restaurados. PG: ${char.currentHP}/${char.maxHP}`);
            if (char.spellSlots[1]) {
                this.terminal.writeSuccess(`Espacios de conjuro restaurados.`);
            }
            this.state.addLog('Completaste un Descanso Largo. Todo restaurado.', 'system');
            this.state.turn += 48; // ~8 horas
        }

        this.terminal.writeBlank();
    }
}
