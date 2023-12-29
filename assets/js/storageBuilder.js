const names = {
    list: 'PokemonList',
    types: 'PokemonTypes',
    genNum: 'PokemonGen',
};

export class StorageBuilder {
    constructor(app) {
        this.app = app;
        this.names = { ...names };
    };

    localSet(name, elem, toString = false) {
        localStorage.setItem(name, (toString ? JSON.stringify(elem) : elem));
    }

    localGet(name, parse = false) {
        return parse ? JSON.parse(localStorage.getItem(name)) : localStorage.getItem(name);
    }
}