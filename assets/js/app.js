import { AppBuilder } from './appBuilder.js';
import { DataBuilder } from './dataBuilder.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=',
    offset: 'offset=',
}

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');
        this.options = {... config};
        this.linksAPI = {};
        this.speciesNumber = ''; // '' for all
        this.pokemons = {};
        this.appBuilder = new AppBuilder(this);
        this.dataBuilder = new DataBuilder(this);
        this.init();
    };

    async init() {
        console.log('%c init() ', 'background: #7E57C2; color: #fff;');
        await this.appBuilder.init();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNumber();
        await this.checkPokemons();
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
        console.log('%c getAppUrls() ', 'background: #7E57C2; color: #fff;');
        this.linksAPI = await this.fetchAPI(this.options.baseUrl).then(res => res);
    }

    async getPokemonsSpeciesNumber() {
        console.log('%c getPokemonsSpeciesNumber() ', 'background: #7E57C2; color: #fff;');
        this.speciesNumber = await this.fetchAPI(this.linksAPI['pokemon-species'] + '?' + this.options.limit + 1).then(res => res.count);
    }

    async checkPokemons() {
        console.log('%c checkPokemons() ', 'background: #7E57C2; color: #fff;');

        if (localStorage.getItem("PokemonsData")) this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        if (localStorage.getItem("PokemonsData") && Object.keys(this.pokemons).length === this.speciesNumber) {
            console.log('Use local storage');
            this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.getPokemonData();
        }

        this.appBuilder.insertList();
    }
}

globalThis.Pokedex = new Pokedex();