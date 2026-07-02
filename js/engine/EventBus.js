// ============================================
// EventBus — Sistema de eventos Pub/Sub
// ============================================

export class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * Suscribirse a un evento
     * @param {string} event
     * @param {Function} callback
     * @returns {Function} Función para desuscribirse
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Retorna función de unsubscribe
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Suscribirse a un evento una sola vez
     * @param {string} event
     * @param {Function} callback
     */
    once(event, callback) {
        const unsub = this.on(event, (...args) => {
            unsub();
            callback(...args);
        });
    }

    /**
     * Emitir un evento
     * @param {string} event
     * @param {*} data
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    /**
     * Eliminar todos los listeners de un evento
     * @param {string} event
     */
    off(event) {
        delete this.listeners[event];
    }

    /**
     * Eliminar todos los listeners
     */
    clear() {
        this.listeners = {};
    }
}
