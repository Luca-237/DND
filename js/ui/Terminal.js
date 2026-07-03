// ============================================
// Terminal — UI de terminal retro
// ============================================

export class Terminal {
    constructor() {
        this.outputEl = document.getElementById('terminal-output');
        this.inputEl = document.getElementById('terminal-input');
        this.promptEl = document.getElementById('terminal-prompt');
        this.typewriterSpeed = 12; // ms por caracter
        this.typewriterEnabled = true;
        this._inputCallback = null;
        this._inputMode = 'number'; // 'number', 'text', 'any'

        this._setupInput();
    }

    _setupInput() {
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.inputEl.value.trim();
                if (value === '' && this._inputMode !== 'text') return;

                this.inputEl.value = '';

                if (this._inputCallback) {
                    const cb = this._inputCallback;
                    cb(value);
                }
            }
        });

        // Click anywhere on terminal focuses input
        document.getElementById('terminal-panel').addEventListener('click', () => {
            this.inputEl.focus();
        });
    }

    /**
     * Escribe una línea en la terminal
     * @param {string} text
     * @param {string} cssClass - Clase CSS adicional
     * @param {boolean} typewrite - Efecto typewriter
     */
    writeLine(text, cssClass = '', typewrite = false) {
        const line = document.createElement('div');
        line.className = `terminal-line ${cssClass} fade-in`;

        if (typewrite && this.typewriterEnabled) {
            this.outputEl.appendChild(line);
            this._typewrite(line, text, cssClass);
        } else {
            line.innerHTML = text;
            this.outputEl.appendChild(line);
        }

        this._scrollToBottom();
    }

    /**
     * Escribe múltiples líneas
     * @param {string[]} lines
     * @param {string} cssClass
     */
    writeLines(lines, cssClass = '') {
        lines.forEach(text => this.writeLine(text, cssClass));
    }

    /**
     * Escribe texto con color usando spans
     */
    writeColored(text, colorClass) {
        this.writeLine(`<span class="${colorClass}">${text}</span>`);
    }

    /**
     * Escribe una línea narrativa (texto blanco con efecto)
     */
    writeNarrative(text) {
        this.writeLine(text, 'narrative');
    }

    /**
     * Escribe texto del sistema (cyan, italic)
     */
    writeSystem(text) {
        this.writeLine(`<span class="text-cyan">${text}</span>`, 'system');
    }

    /**
     * Escribe una opción de menú
     */
    writeOption(number, text, icon = '') {
        const iconStr = icon ? `${icon} ` : '';
        this.writeLine(`<span class="text-bright">[${number}]</span> <span class="text-yellow">${iconStr}${text}</span>`, 'option');
    }

    /**
     * Escribe un error
     */
    writeError(text) {
        this.writeLine(`<span class="text-red">✗ ${text}</span>`, 'error');
    }

    /**
     * Escribe un éxito
     */
    writeSuccess(text) {
        this.writeLine(`<span class="text-green">✓ ${text}</span>`, 'success');
    }

    /**
     * Escribe un separador
     */
    writeDivider(char = '─', length = 40) {
        this.writeLine(char.repeat(length), 'divider');
    }

    /**
     * Escribe un título
     */
    writeTitle(text) {
        this.writeLine(text, 'title');
    }

    /**
     * Anima un dado girando
     * @param {string} label
     * @param {string} finalResultStr
     * @param {number} durationMs
     */
    animateDiceRoll(label, finalResultStr, durationMs = 800) {
        const line = document.createElement('div');
        line.className = 'terminal-line text-yellow fade-in';
        this.outputEl.appendChild(line);
        this._scrollToBottom();

        return new Promise(resolve => {
            let elapsed = 0;
            const interval = 50;
            const timer = setInterval(() => {
                elapsed += interval;
                if (elapsed >= durationMs) {
                    clearInterval(timer);
                    line.innerHTML = finalResultStr;
                    resolve();
                } else {
                    const randomVal = Math.floor(Math.random() * 20) + 1;
                    line.innerHTML = `🎲 ${label}: girando... [${randomVal}]`;
                }
            }, interval);
        });
    }

    /**
     * Escribe un subtítulo
     */
    writeSubtitle(text) {
        this.writeLine(text, 'subtitle');
    }

    /**
     * Escribe una línea vacía
     */
    writeBlank() {
        this.writeLine('&nbsp;');
    }

    /**
     * Escribe ASCII art
     */
    writeAsciiArt(art) {
        const pre = document.createElement('pre');
        pre.className = 'ascii-art fade-in';
        pre.textContent = art;
        this.outputEl.appendChild(pre);
        this._scrollToBottom();
    }

    /**
     * Escribe una barra de HP
     */
    writeHPBar(current, max) {
        const percent = Math.round((current / max) * 100);
        const barWidth = 20;
        const filled = Math.round((current / max) * barWidth);
        const empty = barWidth - filled;

        let colorClass = 'text-green';
        if (percent <= 25) colorClass = 'text-red';
        else if (percent <= 50) colorClass = 'text-orange';

        const bar = `<span class="${colorClass}">${'█'.repeat(filled)}</span><span class="text-dim">${'░'.repeat(empty)}</span>`;
        this.writeLine(`PG: ${bar} ${current}/${max}`, 'stat-line');
    }

    /**
     * Limpia la terminal
     */
    clear() {
        this.outputEl.innerHTML = '';
    }

    /**
     * Espera input del usuario
     * @param {string} mode - 'number', 'text', 'any'
     * @returns {Promise<string>}
     */
    waitForInput(mode = 'any') {
        this._inputMode = mode;
        this.inputEl.focus();
        return new Promise((resolve) => {
            this._inputCallback = (value) => {
                resolve(value);
            };
        });
    }

    /**
     * Espera una selección numérica válida
     * @param {number} min
     * @param {number} max
     * @returns {Promise<number>}
     */
    async waitForChoice(min, max) {
        while (true) {
            const input = await this.waitForInput('number');
            const num = parseInt(input);
            if (!isNaN(num) && num >= min && num <= max) {
                return num;
            }
            this.writeError(`Ingresa un número entre ${min} y ${max}.`);
        }
    }

    /**
     * Espera por una pulsación de tecla específica (sin necesidad de Enter)
     * @param {string[]} allowedKeys - Array de keys permitidas, ej: ['ArrowUp', 'w', 'q']
     * @returns {Promise<string>}
     */
    waitForKey(allowedKeys) {
        this.inputEl.blur(); // Quitar foco del input para evitar que se escriba
        return new Promise((resolve) => {
            const handler = (e) => {
                const key = e.key.toLowerCase();
                // Check if the exact key or the lowercase version is allowed
                if (allowedKeys.includes(e.key) || allowedKeys.includes(key)) {
                    e.preventDefault();
                    window.removeEventListener('keydown', handler);
                    this.inputEl.focus();
                    resolve(key); // Return lowercase for easier handling
                }
            };
            window.addEventListener('keydown', handler);
        });
    }

    /**
     * Escribe un mensaje en el panel de chat
     * @param {string} name - Nombre del NPC
     * @param {string} text - Mensaje
     * @param {string} kaomoji - Kaomoji a mostrar
     */
    writeChatMessage(name, text, kaomoji = '👤') {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        msgDiv.innerHTML = `
            <div class="chat-avatar">${kaomoji}</div>
            <div class="chat-content">
                <div class="chat-name">${name}</div>
                <div class="chat-text">${text}</div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Cambia el prompt
     */
    setPrompt(text) {
        this.promptEl.textContent = text;
    }

    /**
     * Efecto typewriter interno
     */
    _typewrite(element, text, cssClass) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, this.typewriterSpeed);
    }

    /**
     * Scroll al final
     */
    _scrollToBottom() {
        requestAnimationFrame(() => {
            this.outputEl.scrollTop = this.outputEl.scrollHeight;
        });
    }
}
