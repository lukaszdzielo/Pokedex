const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=',
    offset: 'offset=',
}

export class Pokedex {
    constructor(app) {
        this.app = app;
        this.appConfig = {};
        this.appNav;
        this.appList;
        this.appLoader;
        this.pokemonsNumber = ''; // '' for all
        this.pokemons = {};
        this.init();
    };

    async init() {
        // console.log('%c 1 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
        await this.buildApp();
        await this.getAppUrls();
        await this.getPokemonsSpeciesNumber();
        await this.checkPokemons();
    }

    async fetchAPI(fetchUrl) {
        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) {
                console.log('ups1');
                throw new Error(`Http error: ${res.status}`);
            }
            const json = await res.json();
            return json;

        } catch (error) {
            console.log('ups2');
            console.error(error);
        }
    }

    async getAppUrls() {
        // console.log('%c 2 getAppUrls() ', 'background: #1976D2; color: #fff;');
        this.appConfig = await this.fetchAPI(config.baseUrl).then(res => res);
    }

    async getPokemonsSpeciesNumber() {
        // console.log('%c 3 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
        this.pokemonsNumber = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + 1).then(res => res.count);
    }

    async checkPokemons() {
        console.log('%c 4 checkPokemons() ', 'background: #1976D2; color: #fff;');

        if (localStorage.getItem("PokemonsData")) this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        if (localStorage.getItem("PokemonsData") && Object.keys(this.pokemons).length === this.pokemonsNumber) {
            console.log('Use local storage');
            this.pokemons = JSON.parse(localStorage.getItem("PokemonsData"));
        } else {
            console.log('Get new pokemon data and save localy');
            await this.getPokemonData();
            localStorage.setItem("PokemonsData", JSON.stringify(this.pokemons));
        }
        this.insertList();
    }

    async getPokemonData() {
        console.log('%c 5 getPokemonData() ', 'background: #1976D2; color: #fff;');

        const incorrectNames = await this.getPokemonCodeNames();

        await this.getPokemonCorrectNames(incorrectNames);
        await this.getPokemonTypes();
        await this.getPokemonGenerations();

        console.log('%c END ', 'background: #E53935; color: #fff;');
    }

    async getPokemonCodeNames() {
        console.log('%c 5.1 getPokemonNames() ', 'background: #1976D2; color: #fff;');
        const incorrectNames = [];
        await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.pokemonsNumber).then(res => {
            res.results.forEach((pokemon,i) => {
                if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
                this.pokemons[pokemon.name] = {
                    id: i+1,
                    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                };
            });
        });
        return incorrectNames;
    }

    async getPokemonCorrectNames(incorrectNames) {
        console.log('%c 5.2 getPokemonCorrectNames() ', 'background: #1976D2; color: #fff;');

        for (const name of incorrectNames) {
            await this.fetchAPI(this.appConfig['pokemon-species'] + name).then(res => {
                this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
                console.log('correctNames:', name, this.pokemons[name].name);
            });
        };
    }

    async getPokemonTypes() {
        console.log('%c 5.3 getPokemonTypes() ', 'background: #1976D2; color: #fff;');

        const res = await this.fetchAPI(this.appConfig.type);
        for (const type of res.results) {
            const res = await this.fetchAPI(type.url)
            for (const elem of res.pokemon) {
                if (!this.pokemons[elem.pokemon.name]) continue;
                if (!this.pokemons[elem.pokemon.name].type) this.pokemons[elem.pokemon.name].type = [];
                this.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
            };
            console.log('types:', type);
        };
    }

    async getPokemonGenerations() {
        console.log('%c 5.4 getPokemonGenerations() ', 'background: #1976D2; color: #fff;');

        const res = await this.fetchAPI(this.appConfig.generation);
        for (const gen of res.results) {
            const res = await this.fetchAPI(gen.url)
            for (const pokemon of res.pokemon_species) {
                if (!this.pokemons[pokemon.name]) continue;
                this.pokemons[pokemon.name].generation = gen.name;
            };
            console.log('gen:', gen);
        };
    }

    buildApp() {
        this.buildLoader();
        this.buildNav();
        this.buildList();
    }

    buildLoader() {
        this.appLoader = document.querySelector('.loader');
        this.showLoader()
    }

    buildNav() {
        this.appNav = document.querySelector('nav');
    }

    buildList() {
        this.appList = document.querySelector('.list');
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

    insertList() {
        console.log('%c insertList() ', 'background: #43A047; color: #fff;');

        const pokemonCard = pokemon => {
            return `<div class="list__item loading" data-pokemon-id="${this.pokemons[pokemon].id}" data-pokemon-generation="${this.pokemons[pokemon].generation}">
                <div class="item__id">${this.pokemons[pokemon].id}</div>
                <div class='item__name'>${this.pokemons[pokemon].name}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemons[pokemon].id}.png" alt="${this.pokemons[pokemon].name}" class="item__img" loading="lazy">
            </div>`};
        // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemons[pokemon].id}.png
        for (const pokemon in this.pokemons) {
            const item = document.createElement("div");
            item.innerHTML = pokemonCard(pokemon);
            this.appList.append(item.firstChild);
            // this.pokemons[pokemon].type.forEach(type => {
            //     console.log(this.pokemons[pokemon], type);
            // })
        }

        const pokemonCards = this.appList.querySelectorAll(".list__item");
        for (const card of pokemonCards) {
            card.querySelector(".item__img").addEventListener("load", () => {
                setTimeout(() => {
                    card.classList.remove("loading");
                }, 400);
            });
        }

        this.hideLoader();
    }
}