const config = {
    url: 'https://pokeapi.co/api/v2',
    nameList: '/pokemon-species',
    nameListLimit: '/pokemon-species/?limit=',
}

export class Pokedex {
    constructor(app) {
        this.app = app;
        this.appNav = '';
        this.appList = '';
        this.PokemonsNumber = 0;
        this.Pokemons = [];
        this.init();
    };

    init() {
        this.buildApp()
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
            this.updateList()
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
        });
    }

    buildApp() {
        this.appNav = document.createElement('nav');
        this.appList = document.createElement('div');

        this.appList.classList.add('list');

        this.app.appendChild(this.appNav);
        this.app.appendChild(this.appList);
    }

    updateNav() {
        
    }

    updateList() {
        console.log('build?', this.Pokemons);
        const pattern = (pokemon, i) => {
            return `<div id="Pokemon--${i+1}" class="list__item">
                <div class='id'>${i+1}</div>
                <img src="https://github.com/PokeAPI/sprites/raw/master/sprites/pokemon/other/dream-world/${i+1}.svg" alt="${pokemon.name}" style="width: 100%;" loading="lazy">
                <div class='name'>${pokemon.name}</div>
            </div>`};
        this.Pokemons.forEach( (pokemon, i) => {
            const item = document.createElement("div");
            item.innerHTML = pattern(pokemon, i);
            this.appList.append(item.firstChild);
        })
    }
}