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

    set(name, elem, placement) {
        placement.setItem(name, JSON.stringify(elem));
    }

    get(name, placement) {
        return JSON.parse(placement.getItem(name));
    }
}