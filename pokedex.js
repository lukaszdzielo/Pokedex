const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    species: 'https://pokeapi.co/api/v2/pokemon-species/',
    pokemon: 'https://pokeapi.co/api/v2/pokemon/',
    generation: 'https://pokeapi.co/api/v2/generation/', 
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

    init() {
        console.log('%c 1 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
        this.buildApp()
        this.getAppUrls()
    }

    async fetchAPI(fetchUrl) {
        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) {
                throw new Error(`Http error: ${res.status}`);
            }
            const json = await res.json();
            return json;

        } catch (error) {
            console.error(error);
        }
    }

    getAppUrls() {
        console.log('%c 2 getAppUrls() ', 'background: #1976D2; color: #fff;');
        this.fetchAPI(config.baseUrl).then( (res) => {
            this.appConfig = res;
            this.getPokemonsSpeciesNumber();
        });
    }

    getPokemonsSpeciesNumber() {
        console.log('%c 3 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
        if (this.pokemonsNumber > 0) {
            this.checkPokemons()
        } else {
            this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + 1).then(res => {
                this.pokemonsNumber = res.count;
                this.checkPokemons();
            });
        }
    }

    checkPokemons() {
        console.log('%c 4 checkPokemons() ', 'background: #1976D2; color: #fff;');

        // if (localStorage.getItem("PokemonsNames") && (localStorage.getItem("PokemonsNames").length === this.pokemonsNumber || localStorage.getItem("PokemonsNames").split(',').length === this.pokemonsNumber)) {
        //     this.pokemons = JSON.parse(localStorage.getItem("PokemonsNames"));
        //     this.updateList();
        // } else {
            this.getPokemonData();
        // }

        // console.log(localStorage.getItem("PokemonsNames"));
        // console.log(JSON.parse(localStorage.getItem("PokemonsNames")));
    }

    async getPokemonData() {
        console.log('%c 5 getPokemonData() ', 'background: #1976D2; color: #fff;');

        console.log('%c - getPokemonData() ', 'background: #2196F3; color: #fff;');

        const incorrectNames = await this.getPokemonNames();


        Promise.all([
            this.getPokemonCorrectNames(incorrectNames),
        //     this.getPokemonTypes(),
        //     this.getPokemonGenerations(),
        ])
        .then( () => {
            console.log('uruchom updateList'); //["user data", "books data", "pets data"]
        //     this.updateList();
        });

        //     this.updateList();
        console.log('END', this.pokemons)
    }




    async getPokemonNames() {
        console.log('%c 5.1 getPokemonNames() ', 'background: #1976D2; color: #fff;');

        const incorrectNames = []

        const res = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.pokemonsNumber);
        for await (const [i, pokemon] of res.results.entries()) {
            if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
            this.pokemons[pokemon.name] = {
                id: i+1,
                name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            }
        } 
        return incorrectNames;
    }

    getPokemonCorrectNames(incorrectNames) {
        console.log('%c 5.2 getPokemonCorrectNames() ', 'background: #1976D2; color: #fff;');

        for (const name of incorrectNames) {
            this.fetchAPI(this.appConfig['pokemon-species'] + name).then( res => {
                this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
                console.log(this.pokemons[name].name, name);
            })
        }

        new Promise((resolve, reject) => {
            // Przetwarzaj każde zadanie w kolejce.
            for (const name of incorrectNames) {
                
            }
        });
    }

    async getPokemonTypes() {
        console.log('%c 5.3 getPokemonTypes() ', 'background: #1976D2; color: #fff;');

        await setTimeout(1500);
        console.log('%c - getPokemonTypes() ', 'background: #2196F3; color: #fff;');

        // const res = await this.fetchAPI(this.appConfig.type)
        // for await (const type of res.results) {
        //     const res = await this.fetchAPI(type.url)
        //     for await (const elem of res.pokemon) {
        //         if (!this.pokemons[elem.pokemon.name]) continue;
        //         if (!this.pokemons[elem.pokemon.name].type) this.pokemons[elem.pokemon.name].type = [];
        //         this.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
        //     } 
        // }
    }

    async getPokemonGenerations() {
        console.log('%c 5.4 getPokemonGenerations() ', 'background: #1976D2; color: #fff;');
        
        await setTimeout(1500);
        console.log('%c - - getPokemonGenerations() ', 'background: #2196F3; color: #fff;');
    }

    buildLocalStorage() {
        console.log('%c buildLocalStorage() ', 'background: #1976D2; color: #fff;');

        // localStorage.setItem("PokemonsNames", JSON.stringify(pokemonNames));
    }

    buildApp() {
        this.buildLoader();
        this.buildNav();
        this.buildList();
    }

    buildLoader() {
        this.appLoader = document.createElement('div');
        this.appLoader.classList.add('loader', 'loading--start');
        // this.appLoader.innerHTML = `<div class="loader--top">1</div><div class="loader--bottom">2</div>`;
        this.app.appendChild(this.appLoader);
    }

    buildNav() {
        this.appNav = document.createElement('nav');
        this.app.appendChild(this.appNav);
    }

    buildList() {
        this.appList = document.createElement('div');
        this.appList.classList.add('list');
        this.app.appendChild(this.appList);
    }

    updateNav() {
        console.log('%c updateNav() ', 'background: #1976D2; color: #fff;');
    }

    updateList() {
        console.log('%c updateList() ', 'background: #1976D2; color: #fff;');

        // const pattern = pokemon => {
        //     return `<div id="Pokemon--${this.pokemons[pokemon].id}" class="list__item">
        //         <div class="item__id">${this.pokemons[pokemon].id}</div>
        //         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemons[pokemon].id}.png" alt="${this.pokemons[pokemon].name}" class="item__img">
        //         <div class='item__name'>${this.pokemons[pokemon].name}</div>
        //     </div>`};
        //     // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png
        //     for (const pokemon in this.pokemons) {
        //         const item = document.createElement("div");
        //         item.innerHTML = pattern(pokemon);
        //         this.appList.append(item.firstChild);
        //     }
    }
}