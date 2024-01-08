import { StatusManager } from './StatusManager.js';
import { AppBuilder } from './appBuilder.js';
import { DataBuilder } from './dataBuilder.js';
import { StorageManager } from './StorageManager.js';
import { CatchedManager } from './CatchedManager.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=999999999999999',
    dev: {
        urls: ['http://localhost', 'https://localhost', 'http://192.168', 'http://127.0.0.1'],
        list: [1, 4, 5, 6, 7, 8, 9, 123, 710, 902, 1020, 1024, 1025],
    },
    version: 0.2,
};

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');
        this.options = { ...config };
        this.isDev = this.isDev();

        this.linksAPI = {};
        this.speciesNumber;

        this.status = new StatusManager(this);
        this.storage = new StorageManager(this);
        this.appBuilder = new AppBuilder(this);
        this.dataBuilder = new DataBuilder(this);
        this.catchedManager = new CatchedManager(this);

        this.pokemonList = this.storage.getLocal(this.storage.names.list) || {};
        this.pokemonTypes = this.storage.getLocal(this.storage.names.types) || {};
        this.pokemonGenerations = this.storage.getLocal(this.storage.names.genNum) || 0;
        this.pokemonDetails = this.storage.getSession(this.storage.names.details) || {};
        this.pokemonCatched = this.storage.getLocal(this.storage.names.catched) || [];
        this.currentShown;

        this.init();
    };

    async init() {
        // await this.appBuilder.init();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNum();
        await this.getPokemonList();
        await this.catchedManager.mergeCatched();
        if (this.isDev) await this.devLimiter();
        await this.appBuilder.insertList();
        // this.appBuilder.hideLoader();
        this.localStorageSize();
    }

    async fetchAPI(fetchUrl) {
        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error(`Http error: ${res.status}`);
            const json = await res.json();
            return json;

        } catch (error) {
            console.error(error);
        }
    }

    async getAppUrls() {
        this.linksAPI = await this.fetchAPI(this.options.baseUrl).then(res => res);
    }

    async getPokemonsSpeciesNum() {
        this.speciesNumber = await this.fetchAPI(this.linksAPI['pokemon-species']).then(res => res.count);
    }

    async getPokemonList() {

        const isLocalList = !!this.pokemonList && !!this.pokemonTypes && !!this.pokemonGenerations;

        if (isLocalList && Object.keys(this.pokemonList).length === this.speciesNumber) {
            console.log('Use local storage');
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.getPokemonListData();
        }
    }

    isDev() {
        return (this.options.dev.urls.some((url) => window.location.href.startsWith(url)));
    }

    devLimiter() {
        this.pokemonList = Object.keys(this.pokemonList).reduce((acc, id) => {
            if (this.options.dev.list.includes(+id)) acc[id] = this.pokemonList[+id];
            return acc;
        }, {});
    }

    localStorageSize() {
        const keys = Object.keys(localStorage);
        let size = 0;
        keys.forEach(key => size += key.length + localStorage.getItem(key).length);
        console.log(`localStorage: ${(size / 1024).toFixed(2)} kb`);
    };
}

globalThis.Pokedex = new Pokedex();