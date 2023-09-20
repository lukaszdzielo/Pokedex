import { AppBuilder } from './appBuilder.js';
import { DataBuilder } from './dataBuilder.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=',
    offset: 'offset=',
    version: 0.1,
}

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');
        this.options = {... config};
        this.linksAPI = {};
        this.speciesNumber = 10; // '' for all
        this.pokemons = {};
        this.appBuilder = new AppBuilder(this);
        this.dataBuilder = new DataBuilder(this);
        this.init();
    };

    async init() {
        await this.appBuilder.init();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNumber();
        await this.checkPokemons();
        this.appBuilder.insertList();
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

    async getPokemonsSpeciesNumber() {
        this.speciesNumber = await this.fetchAPI(this.linksAPI['pokemon-species'] + '?' + this.options.limit + 1).then(res => res.count);
    }
    async checkPokemons() {
        if (localStorage.getItem("PokemonsData")) this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        if (localStorage.getItem("PokemonsData") && Object.keys(this.pokemons).length === this.speciesNumber) {
            console.log('Use local storage');
            this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.getPokemonData();
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