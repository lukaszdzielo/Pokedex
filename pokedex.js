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
        this.pokemonsNumber = 30; // '' for all
        this.pokemons = {};
        this.init();
    };

    init() {
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
        this.fetchAPI(config.baseUrl).then( (res) => {
            this.appConfig = res;
            this.getPokemonsSpeciesNumber();
        });
    }

    getPokemonsSpeciesNumber() {
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
        // console.log('%c checkPokemons() ', 'background: #3B78FF; color: #fff;');

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
        // ToDo create empty objects {} inside array
        // this.pokemons.length = 5;
        // console.log( this.pokemons, this.pokemons.length );
        // console.log({})
        // const x = this.pokemons.map(() => {
        //     return ({'s':'s'})
        // })
        // console.log( x );
        // console.log( this.pokemons, this.pokemons.length );

        await this.getPokemonNames();
        await this.getPokemonTypes();
        
        // const promise1 = new Promise((resolve, reject) => {
        //     // Wykonaj asynchroniczne zadanie 1
        //     setTimeout(() => {
        //         resolve( );
        //     }, 2000);
        // });
          
        // const promise2 = new Promise((resolve, reject) => {
        //     // Wykonaj asynchroniczne zadanie 2
            
        //     setTimeout(() => {
        //       resolve( this.getPokemonTypes() );
        //     }, 2000);
        // });
          
        // // Wykonaj funkcję 3 dopiero kiedy obydwie funkcje 1 i 2 zostaną wykonane
        // promise1.then(() => {
        //     // Funkcja 1 jest wykonana
        //     console.log("Funkcja 1 jest wykonana");
            
        //     // Wykonaj funkcję 3
        //     promise2.then((result) => {
        //         console.log(result);
        //     });
        // });

    }

    async getPokemonNames() {
        console.log('%c getPokemonNames() ', 'background: #3B78FF; color: #fff;');
        const res = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.pokemonsNumber);
        for await (const [i, pokemon] of res.results.entries()) {
            let name = '';
            if (/\-/.test(pokemon.name)) {
                const res = await this.fetchAPI(this.appConfig['pokemon-species'] + pokemon.name);
                name = (res.names.find((object) => object.language.name === "en")).name;
            }

            this.pokemons[pokemon.name] = {
                id: i,
                name: name || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            }
        }
        console.log(this.pokemons)
    }

    getPokemonTypes() {
        console.log('%c getPokemonTypes() ', 'background: #3B78FF; color: #fff;');
        
        // this.fetchAPI( config.API + config.pokemon + '?' + config.limit + this.pokemonsNumber).then(res => {
        //     this.pokemons = res.results.map(elem => ({nssame: elem.name}) );
        //     console.log(this.pokemons)
        // });
    }

    buildLocalStorage() {
        console.log('%c buildLocalStorage() ', 'background: #3B78FF; color: #fff;');

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
        this.pokemons.forEach( (pokemon, i) => {
            const item = document.createElement("div");
            item.innerHTML = pattern(pokemon, i);
            this.appList.append(item.firstChild);
        })
    }
}