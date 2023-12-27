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
        this.speciesNumber = ''; // '' for all
        this.pokemonList = {};
        this.pokemonTypes = [];
        this.pokemonGenerations = [];
        this.pokemon = {};
        this.appBuilder = new AppBuilder(this);
        this.dataBuilder = new DataBuilder(this);
        this.init();
    };

    async init() {
        await this.appBuilder.init();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNumber();
        await this.getPokemons();
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

    async getPokemonsSpeciesNumber() {
        this.speciesNumber = await this.fetchAPI(this.linksAPI['pokemon-species'] + '?' + this.options.limit).then(res => res.count);
    }
    async getPokemons() {
        if (localStorage.getItem("PokemonsData")) this.pokemonList = JSON.parse(localStorage.getItem("PokemonsData"));
        if (localStorage.getItem("PokemonsData") && Object.keys(this.pokemonList).length === this.speciesNumber) {
            console.log('Use local storage');
            this.pokemonList = JSON.parse(localStorage.getItem("PokemonsData"));
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.getPokemonData();
        }

            // FAKE DB {"blastoise":{"id":9,"name":"Blastoise","type":["water"],"generation":"generation-i"},"caterpie":{"id":10,"name":"Caterpie","type":["bug"],"generation":"generation-i"},"mareep":{"id":179,"name":"Mareep","type":["electric"],"generation":"generation-ii"},"flaaffy":{"id":180,"name":"Flaaffy","type":["electric"],"generation":"generation-ii"},"aron":{"id":304,"name":"Aron","type":["steel","rock"],"generation":"generation-iii"},"lairon":{"id":305,"name":"Lairon","type":["steel","rock"],"generation":"generation-iii"},"drifloon":{"id":425,"name":"Drifloon","type":["ghost","flying"],"generation":"generation-iv"},"drifblim":{"id":426,"name":"Drifblim","type":["ghost","flying"],"generation":"generation-iv"},"buneary":{"id":427,"name":"Buneary","type":["normal"],"generation":"generation-iv"},"lopunny":{"id":428,"name":"Lopunny","type":["normal"],"generation":"generation-iv"},"mismagius":{"id":429,"name":"Mismagius","type":["ghost"],"generation":"generation-iv"}}
    }

    localStorageSize() {
        const keys = Object.keys(localStorage);
        let size = 0;
        keys.forEach(key => size += key.length + localStorage.getItem(key).length )
        console.log(`localStorage: ${(size / 1024).toFixed(2)} kb`);
    };
}

globalThis.Pokedex = new Pokedex();