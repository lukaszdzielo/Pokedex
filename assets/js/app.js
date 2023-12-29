import { AppBuilder } from './appBuilder.js';
import { DataBuilder } from './dataBuilder.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=999999999999999',
    offset: 'offset=',
    version: 0.1,
}

const storageNames = {
    list: 'PokemonList',
    types: 'PokemonTypes',
    genNum: 'PokemonGen',
}

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');

        this.options = {...config};
        this.storageNames = {...storageNames};

        this.linksAPI = {};
        this.speciesNumber = ''; // '' for all

        this.pokemonList = {};
        this.pokemonTypes = {};
        this.pokemonGenerations;
        this.pokemon = {};

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
        const isLocalList = !!localStorage.getItem(this.storageNames.list) && !!localStorage.getItem(this.storageNames.types) && !!localStorage.getItem(this.storageNames.genNum)
        if (isLocalList) {
            this.pokemonList = JSON.parse(localStorage.getItem(this.storageNames.list))
            this.pokemonTypes = JSON.parse(localStorage.getItem(this.storageNames.types))
            this.pokemonGenerations = JSON.parse(localStorage.getItem(this.storageNames.genNum))
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
        keys.forEach(key => size += key.length + localStorage.getItem(key).length )
        console.log(`localStorage: ${(size / 1024).toFixed(2)} kb`);
    };
}

globalThis.Pokedex = new Pokedex();