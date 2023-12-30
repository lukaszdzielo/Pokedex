import { AppBuilder } from './appBuilder.js';
import { DataBuilder } from './dataBuilder.js';
import { StorageBuilder } from './storageBuilder.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=999999999999999',
    devlimit: 9,
    version: 0.2,
};

const storageNames = {
    list: 'PokemonList',
    types: 'PokemonTypes',
    genNum: 'PokemonGen',
};

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');

        this.options = { ...config };

        this.linksAPI = {};
        this.speciesNumber = ''; // '' for all

        this.pokemonList = {};
        this.pokemonTypes = {};
        this.pokemonGenerations;
        this.pokemon = {};

        this.storage = new StorageBuilder(this);
        this.appBuilder = new AppBuilder(this);
        this.dataBuilder = new DataBuilder(this);

        this.init();
    };

    async init() {
        await this.appBuilder.init();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNum();
        await this.getPokemonList();
        await this.appBuilder.insertList();
        this.appBuilder.hideLoader();
        this.localStorageSize();
    }

    async fetchAPI(fetchUrl) {
        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) {
                console.error('Res not ok :(');
                throw new Error(`Http error: ${res.status}`);
            }
            const json = await res.json();
            return json;

        } catch (error) {
            console.error('Catch error');
            console.error(error);
        }
    }

    async getAppUrls() {
        this.linksAPI = await this.fetchAPI(this.options.baseUrl).then(res => res);
    }

    async getPokemonsSpeciesNum() {
        this.speciesNumber = await this.fetchAPI(this.linksAPI['pokemon-species'] + '?' + this.options.limit).then(res => res.count);
    }
    async getPokemonList() {

        const isLocalList = !!this.storage.localGet(this.storage.names.list) && !!this.storage.localGet(this.storage.names.types) && !!this.storage.localGet(this.storage.names.genNum);

        if (isLocalList) {
            this.pokemonList = this.storage.localGet(this.storage.names.list, true);
            this.pokemonTypes = this.storage.localGet(this.storage.names.types, true);
            this.pokemonGenerations = this.storage.localGet(this.storage.names.genNum);
        };

        if (isLocalList && Object.keys(this.pokemonList).length === this.speciesNumber) {
            console.log('Use local storage');
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.getPokemonListData();
        }
    }

    localStorageSize() {
        const keys = Object.keys(localStorage);
        let size = 0;
        keys.forEach(key => size += key.length + localStorage.getItem(key).length);
        console.log(`localStorage: ${(size / 1024).toFixed(2)} kb`);
    };
}

globalThis.Pokedex = new Pokedex();