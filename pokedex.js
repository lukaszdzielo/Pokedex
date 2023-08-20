const config = {
    url: 'https://pokeapi.co/api/v2',
    nameList: '/pokemon-species/',
    nameListLimit: '/pokemon-species/?limit=',
}

export class Pokedex {
    constructor(app) {
        this.app = app;
        this.PokemonsNumber = 0;
        this.Pokemons = [];
        this.init();
    };

    init() {
        this.fetchAPI(config.url).then( () => {
            this.getPokemonsNumber();
        });
    }

    async fetchAPI(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Http error: ${res.status}`);
            }
            const json = await res.json();
            return json;

        } catch (error) {
            console.error(error);
        }
    }

    getPokemonsNumber() {
        this.fetchAPI(config.url + config.nameList).then(res => {
            this.PokemonsNumber = res.count;
            localStorage.setItem("PokemonsNumber", res.count);
            this.checkPokemons();
        });
    }

    checkPokemons() {
        console.log('%c checkPokemons() ', 'background: #3B78FF');

        if (localStorage.getItem("PokemonsNames") && (localStorage.getItem("PokemonsNames").length === this.PokemonsNumber || localStorage.getItem("PokemonsNames").split(',').length === this.PokemonsNumber)) {
            this.Pokemons = JSON.parse(localStorage.getItem("PokemonsNames"))
            this.buildApp()
        } else {
            this.getPokemons()
        }

    }

    getPokemons() {
        console.log('%c getPokemons() ', 'background: #3B78FF');
        
        this.fetchAPI(config.url + config.nameListLimit + this.PokemonsNumber).then(res => {
            const pokemonNames = []
            res.results.forEach(pokemon => {
                pokemonNames.push({name: pokemon.name})
            });
            this.Pokemons = pokemonNames;
            localStorage.setItem("PokemonsNames", JSON.stringify(pokemonNames));
            this.buildApp()
        });
    }

    getPokemonNames(url) {
        // console.log('%c getPokemonNames() ', 'background: #3B78FF');

        // (async () => {
        //     try {
        //         const res = await fetch(url);
        //         if (!res.ok) {
        //             throw new Error(`Http error: ${res.status}`);
        //         }
        //         const json = await res.json();

        //         console.log(json);

        //     } catch (error) {
        //         console.error(error);
        //     }
        // })();

    }
    buildApp() {
        console.log('build?', this.Pokemons);
        let htmlTemplate = '';
        this.Pokemons.forEach(pokemon => {
            htmlTemplate += `<div class="item"><div class='name'>${pokemon.name}</div></div>`;
        })
        console.log(this)
        this.app.innerHTML = htmlTemplate;
    }
}