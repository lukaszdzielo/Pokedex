const config = {
    url: 'https://pokeapi.co/api/v2',
    species: '/pokemon-species',
    pokemon: '/pokemon',
    listLimit: '/pokemon/?limit=',
}

export class Pokedex {
    constructor(app) {
        this.app = app;
        this.appNav;
        this.appList;
        this.appLoader;
        this.PokemonsNumber = 2; // '' for all
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
        console.log('%c getPokemonsNumber() ', 'background: #3B78FF; color: #fff;');
        
        this.fetchAPI(config.url + config.species).then(res => {
            this.PokemonsNumber = this.PokemonsNumber || res.count;
            this.checkPokemons();
        });
    }

    checkPokemons() {
        console.log('%c getPokemons() ', 'background: #3B78FF; color: #fff;');
        if (localStorage.getItem("PokemonsNames") && (localStorage.getItem("PokemonsNames").length === this.PokemonsNumber || localStorage.getItem("PokemonsNames").split(',').length === this.PokemonsNumber)) {
            this.Pokemons = JSON.parse(localStorage.getItem("PokemonsNames"));
            this.updateList();
        } else {
            this.getPokemons();
        }
    }

    getPokemons() {
        console.log('%c getPokemons() ', 'background: #3B78FF; color: #fff;');
        
        this.fetchAPI(config.url + config.listLimit + this.PokemonsNumber).then(res => {
            console.log(config.url + config.listLimit);
            const pokemonNames = []
            res.results.forEach(pokemon => {
                pokemonNames.push({name: pokemon.name})
            });
            this.Pokemons = pokemonNames;
            localStorage.setItem("PokemonsNames", JSON.stringify(pokemonNames));
            this.updateList();
        });
    }

    buildApp() {
        this.buildLoader();
        this.buildNav();
        this.buildList();
    }

    buildLoader() {
        this.appLoader = document.createElement('div');
        this.appLoader.classList.add('loader', 'loading--start');
        this.appLoader.innerHTML = `<div class="loader--top">1</div><div class="loader--bottom">2</div>`;
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
        console.log('%c updateNav() ', 'background: #3B78FF; color: #fff;');
    }

    updateList() {
        console.log('%c updateList() ', 'background: #3B78FF; color: #fff;');
        const pattern = (pokemon, i) => {
            return `<div id="Pokemon--${i+1}" class="list__item">
                <div class="item__id">${i+1}</div>
                <img src="" alt="${pokemon.name}" class="item__img">
                <div class='item__name'>${pokemon.name}</div>
            </div>`};
            // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png
        this.Pokemons.forEach( (pokemon, i) => {
            const item = document.createElement("div");
            item.innerHTML = pattern(pokemon, i);
            this.appList.append(item.firstChild);
        })
    }
}