const names = {
    list: 'PokemonList',
    types: 'PokemonTypes',
    genNum: 'PokemonGen',
    details: 'PokemonDetails',
};

export class StorageManager {
    constructor(app) {
        this.app = app;
        this.names = { ...names };
    };

    setLocal(name, elem) {
        localStorage.setItem(name, JSON.stringify(elem));
    }

    getLocal(name) {
        return JSON.parse(localStorage.getItem(name));
    }

    setSession(name, elem) {
        sessionStorage.setItem(name, JSON.stringify(elem));
    }

    getSession(name) {
        return JSON.parse(sessionStorage.getItem(name));
    }
}