class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config.initial === undefined) 
            throw new Error
        else {
            this.state = config.initial;
            this.config = config;
            this.undoHistory = [];
            this.redoHistory = [];
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this.config.states) {
            this.undoHistory.push(this.state);
            this.state = state;
            this.redoHistory = [];
        }
        else
            throw new Error
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!(event in this.config.states[this.state].transitions)) throw new Error;
        this.undoHistory.push(this.state);
        this.state = this.config.states[this.state].transitions[event];
        this.redoHistory = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.undoHistory.push(this.state);
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];

        if (event === undefined) {
            for (let key in this.config.states) {
                result.push(key);
            }
        } else {
            for (let key in this.config.states) {
                if (event in this.config.states[key].transitions) result.push(key);
            }
        }

        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.undoHistory.length === 0) {
            return false;
        } 
        this.redoHistory.push(this.state);
        this.state = this.undoHistory.pop();

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.redoHistory.length === 0) {
            return false;
        } 
        this.undoHistory.push(this.state);
        this.state = this.redoHistory.pop();

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoHistory = [];
        this.redoHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/