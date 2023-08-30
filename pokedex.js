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
        // console.log('%c 1 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
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
        // console.log('%c 2 getAppUrls() ', 'background: #1976D2; color: #fff;');
        this.fetchAPI(config.baseUrl).then( (res) => {
            this.appConfig = res;
            this.getPokemonsSpeciesNumber();
        });
    }

    getPokemonsSpeciesNumber() {
        // console.log('%c 3 getPokemonsSpeciesNumber() ', 'background: #1976D2; color: #fff;');
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
        // console.log('%c 4 checkPokemons() ', 'background: #1976D2; color: #fff;');

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

        const incorrectNames = await this.getPokemonCodeNames();

         function test() {
            for (const name of incorrectNames) {
                // console.log(name, incorrectNames);
                // console.log(config.species + name);
                this.fetchAPI('https://pokeapi.co/api/v2/pokemon-species/' + name).then(res => {
                    console.log(res);
                });
                // console.log(res);
                // this.fetchAPI(this.appConfig['pokemon-species'] + name).then(res => {
                //     this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
                //     console.log(this.pokemons[name].name, name);
                //     console.log(name);
                // })
            }
        }
        test();

        this.updateList();

        // await Promise.all([
        //     this.getPokemonCorrectNames(incorrectNames),
        //     this.getPokemonTypes(),
        //     this.getPokemonGenerations(),
        // ]).then(()=>{
        //     this.updateList();
        // })

        // const promises = [
        //     new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             console.log('1');
        //             resolve("Metoda 1");
        //         }, 0);
        //     }),
        //     new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             console.log('2');
        //             resolve("Metoda 2");
        //         }, 5000); 
        //     }),
        //     new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             console.log('3');
        //             resolve("Metoda 3");
        //         }, 0);
        //     }),
        // ];
        // // Uruchom obietnice.
        // Promise.all(promises).then((values) => {
        //       this.updateList();
        // });

    }

    async getPokemonCodeNames() {
        console.log('%c 5.1 getPokemonNames() ', 'background: #1976D2; color: #fff;');

        const incorrectNames = []

        const res = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.pokemonsNumber)
        res.results.forEach((pokemon,i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
            this.pokemons[pokemon.name] = {
                id: i+1,
                name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            }
        });
        return incorrectNames;
    }

    getPokemonCorrectNames(incorrectNames) {
        console.log('%c 5.2 getPokemonCorrectNames() ', 'background: #1976D2; color: #fff;');

        return new Promise((resolve, reject) => {
            console.log('getPokemonCorrectNames', incorrectNames);
            resolve();
        });

        // return new Promise((resolve, reject) => {
        //     // Wykonaj pętlę z `setTimeout()`.
        //     for (const name of incorrectNames) {
        //         this.fetchAPI(this.appConfig['pokemon-species'] + name).then(res => {
        //             this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
        //             console.log(this.pokemons[name].name, name);
        //             console.log(name);
        //         })
        //     }
        
        //     resolve();
        // });




        // for (const name of incorrectNames) {
        //     this.fetchAPI(this.appConfig['pokemon-species'] + name).then(res => {
        //         this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
        //         console.log(this.pokemons[name].name, name);
        //         console.log(name);
        //     })
        // }
        console.log(this.pokemons);
    }

     getPokemonTypes() {
        console.log('%c 5.3 getPokemonTypes() ', 'background: #1976D2; color: #fff;');

        return new Promise((resolve, reject) => {
            console.log('getPokemonTypes');
            resolve();
        });

        // const res = await this.fetchAPI(this.appConfig.type);
        // console.log(res);
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
        console.log('%c updateList() ', 'background: #E53935; color: #fff;');

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

































// export class Pokedex {
//     constructor(app) {
//         this.app = app;
//         this.appConfig = {};
//         this.appNav;
//         this.appList;
//         this.appLoader;
//         this.pokemonsNumber = ''; // '' for all
//         this.pokemons = {};
//         this.init();
//     };

//     init() {
//         console.log('%c 1 getPokemonsSpeciesNumber() ', 'background: #3B78FF; color: #fff;');
//         this.buildApp()
//         this.getAppUrls()
//     }

//     async fetchAPI(fetchUrl) {
//         try {
//             const res = await fetch(fetchUrl);
//             if (!res.ok) {
//                 throw new Error(`Http error: ${res.status}`);
//             }
//             const json = await res.json();
//             return json;

//         } catch (error) {
//             console.error(error);
//         }
//     }

//     getAppUrls() {
//         console.log('%c 2 getAppUrls() ', 'background: #3B78FF; color: #fff;');
//         this.fetchAPI(config.baseUrl).then( (res) => {
//             this.appConfig = res;
//             this.getPokemonsSpeciesNumber();
//         });
//     }

//     getPokemonsSpeciesNumber() {
//         console.log('%c 3 getPokemonsSpeciesNumber() ', 'background: #3B78FF; color: #fff;');
//         if (this.pokemonsNumber > 0) {
//             this.checkPokemons()
//         } else {
//             this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + 1).then(res => {
//                 this.pokemonsNumber = res.count;
//                 this.checkPokemons();
//             });
//         }
//     }

//     checkPokemons() {
//         console.log('%c 4 checkPokemons() ', 'background: #3B78FF; color: #fff;');
//         // console.log('%c checkPokemons() ', 'background: #3B78FF; color: #fff;');

//         // if (localStorage.getItem("PokemonsNames") && (localStorage.getItem("PokemonsNames").length === this.pokemonsNumber || localStorage.getItem("PokemonsNames").split(',').length === this.pokemonsNumber)) {
//         //     this.pokemons = JSON.parse(localStorage.getItem("PokemonsNames"));
//         //     this.updateList();
//         // } else {
//             this.getPokemonData();
//         // }

//         // console.log(localStorage.getItem("PokemonsNames"));
//         // console.log(JSON.parse(localStorage.getItem("PokemonsNames")));
//     }

//     async getPokemonData() {
//         console.log('%c 5 getPokemonData() ', 'background: #3B78FF; color: #fff;');
//         await this.getPokemonNames();
//         await this.getPokemonTypes();
//         // await this.getPokemonTypes();
//         console.log(this.pokemons)
//     }

//     async getPokemonNames() {
//         console.log('%c 6 getPokemonNames() ', 'background: #3B78FF; color: #fff;');
//         const res = await this.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.pokemonsNumber);
//         for await (const [i, pokemon] of res.results.entries()) {
//             let name = '';
//             if (/\-/.test(pokemon.name)) {
//                 const res = await this.fetchAPI(this.appConfig['pokemon-species'] + pokemon.name);
//                 name = (res.names.find((object) => object.language.name === "en")).name;
//             }
//             this.pokemons[pokemon.name] = {
//                 id: i,
//                 name: name || pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
//             }
//         } 
//     }

//     async getPokemonTypes() {
//         console.log('%c 7 getPokemonTypes() ', 'background: #3B78FF; color: #fff;');
//         const res = await this.fetchAPI(this.appConfig.type)
//         res.results.forEach(type => {
//             this.fetchAPI(type.url).then(res => {
//                 res.pokemon.forEach(elem => {
//                     if (!this.pokemons[elem.pokemon.name]) return;
//                     if (!this.pokemons[elem.pokemon.name].type) this.pokemons[elem.pokemon.name].type = [];
//                     this.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
//                 })
//             });
//         })
//     }

//     buildLocalStorage() {
//         console.log('%c buildLocalStorage() ', 'background: #3B78FF; color: #fff;');

//         // localStorage.setItem("PokemonsNames", JSON.stringify(pokemonNames));
//     }

//     buildApp() {
//         this.buildLoader();
//         this.buildNav();
//         this.buildList();
//     }

//     buildLoader() {
//         this.appLoader = document.createElement('div');
//         this.appLoader.classList.add('loader', 'loading--start');
//         this.appLoader.innerHTML = `<div class="loader--top">1</div><div class="loader--bottom">2</div>`;
//         this.app.appendChild(this.appLoader);
//     }

//     buildNav() {
//         this.appNav = document.createElement('nav');
//         this.app.appendChild(this.appNav);
//     }

//     buildList() {
//         this.appList = document.createElement('div');
//         this.appList.classList.add('list');
//         this.app.appendChild(this.appList);
//     }

//     updateNav() {
//         console.log('%c updateNav() ', 'background: #3B78FF; color: #fff;');
//     }

//     updateList() {
//         console.log('%c updateList() ', 'background: #3B78FF; color: #fff;');
//         const pattern = (pokemon, i) => {
//             return `<div id="Pokemon--${i+1}" class="list__item">
//                 <div class="item__id">${i+1}</div>
//                 <img src="" alt="${pokemon.name}" class="item__img">
//                 <div class='item__name'>${pokemon.name}</div>
//             </div>`};
//             // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png
//         this.pokemons.forEach( (pokemon, i) => {
//             const item = document.createElement("div");
//             item.innerHTML = pattern(pokemon, i);
//             this.appList.append(item.firstChild);
//         })
//     }
// }