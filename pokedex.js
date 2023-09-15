import { DataBuilder } from './dataBuilder.js';
import { ListBuilder } from './listBuilder.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=',
    offset: 'offset=',
}

const pokemonCard = (codeName, pokemon) => {
    return `<div class="list__item loading" data-pokemon-code-name="${codeName}" data-pokemon-generation="${pokemon.generation}">
        <div class="item__id">${pokemon.id}</div>
        <div class='item__name'>${pokemon.name}</div>
        <div class='item__type'>${pokemon.type}</div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" class="item__img" loading="lazy">
    </div>`};

export class Pokedex {
    constructor(app) {
        this.app = app;
        this.appConfig = {};
        this.appNav;
        this.appLoader;
        this.pokemonsNumber = ''; // '' for all
        this.pokemons = {};
        this.dataBuilder = new DataBuilder(this);
        this.listBuilder = new ListBuilder(this);
        this.init();
    };

    async init() {
        // console.log('%c 1 init() ', 'background: #7E57C2; color: #fff;');
        await this.buildApp();
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
        // console.log('%c 2 getAppUrls() ', 'background: #7E57C2; color: #fff;');
        this.appConfig = await this.fetchAPI(config.baseUrl).then(res => res);
    }

    async getPokemonsSpeciesNumber() {
        // console.log('%c 3 getPokemonsSpeciesNumber() ', 'background: #7E57C2; color: #fff;');
        this.pokemonsNumber = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + 1).then(res => res.count);
    }

    async checkPokemons() {
        console.log('%c 4 checkPokemons() ', 'background: #7E57C2; color: #fff;');

        if (localStorage.getItem("PokemonsData")) this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        if (localStorage.getItem("PokemonsData") && Object.keys(this.pokemons).length === this.pokemonsNumber) {
            console.log('Use local storage');
            this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        } else {
            console.log('Get new pokemon data and save localy');
            await this.dataBuilder.init(this);
        }

        this.listBuilder.insertList();
    }

    buildApp() {
        this.buildLoader();
        this.buildNav();
        this.listBuilder.buildList();
    }

    buildLoader() {
        this.appLoader = document.querySelector('.loader');
        this.showLoader()
    }

    buildNav() {
        this.appNav = document.querySelector('nav');
    }

    updateNav() {
        console.log('%c updateNav() ', 'background: #43A047; color: #fff;');
    }

    showLoader() {
        console.log('%c showLoader() ', 'background: #43A047; color: #fff;');
        document.documentElement.classList.add('scrollDisabled');
        this.appLoader.classList.add('loading');
    }

    hideLoader() {
        console.log('%c hideLoader() ', 'background: #43A047; color: #fff;');
        setTimeout(() => {
            document.documentElement.classList.remove('scrollDisabled');
            this.appLoader.classList.remove('loading');
        }, 800);
    }
}