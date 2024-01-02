const names = {
    list: 'PokemonList',
    types: 'PokemonTypes',
    genNum: 'PokemonGen',
    details: 'PokemonDetails',
};

export class StorageBuilder {
    constructor(app) {
        this.app = app;
        this.names = { ...names };
    };

    set(name, elem, placement) {
        placement.setItem(name, JSON.stringify(elem));
    }

    get(name, placement) {
        return JSON.parse(placement.getItem(name));
    }

    localSet(name, elem) {
        localStorage.setItem(name, JSON.stringify(elem));
    }

    localGet(name) {
        return JSON.parse(localStorage.getItem(name));
    }

    sessionSet(name, elem) {
        sessionStorage.setItem(name, JSON.stringify(elem));
    }

    sessionGet(name) {
        return JSON.parse(sessionStorage.getItem(name));
    }
}