// ============================================
// Main — Bootstrap del juego
// ============================================

import { GameEngine } from './engine/GameEngine.js';

// Esperar a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start().catch(err => {
        console.error('Error en el juego:', err);
    });

    // Prevenir que el input pierda foco
    document.addEventListener('click', (e) => {
        const input = document.getElementById('terminal-input');
        if (input && !e.target.closest('#map-panel')) {
            input.focus();
        }
    });

    // Keyboard shortcuts globales
    document.addEventListener('keydown', (e) => {
        // Prevenir scroll con flechas
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            const input = document.getElementById('terminal-input');
            if (document.activeElement === input && input.value === '') {
                e.preventDefault();
            }
        }
    });
});
