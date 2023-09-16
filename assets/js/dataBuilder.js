const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=',
    offset: 'offset=',
}

export class DataBuilder {
    constructor(app) {
        console.log('%c constructor() ', 'background: #42A5F5; color: #fff;');
        this.app = app;
        this.appConfig;
        this.pokemons;
    };

    async init(app) {
        console.log('%c init() ', 'background: #42A5F5; color: #fff;');
        this.appConfig = app.linksAPI;
        this.pokemons = app.pokemons;
        await this.getPokemonData();
    }

    async getPokemonData() {
        console.log('%c getPokemonData() ', 'background: #42A5F5; color: #fff;');

        const incorrectNames = await this.getPokemonCodeNames();

        await this.getPokemonCorrectNames(incorrectNames);
        await this.getPokemonTypes();
        await this.getPokemonGenerations();

        localStorage.setItem("PokemonsData", JSON.stringify(this.pokemons));

        console.log('%c END ', 'background: #E53935; color: #fff;');
    }

    async getPokemonCodeNames() {
        console.log('%c getPokemonNames() ', 'background: #42A5F5; color: #fff;');

        const incorrectNames = [];

        await this.app.fetchAPI(this.appConfig['pokemon-species'] + '?' + config.limit + this.app.pokemonsNumber).then(res => {
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
        console.log('%c getPokemonCorrectNames() ', 'background: #42A5F5; color: #fff;');

        for (const name of incorrectNames) {
            await this.app.fetchAPI(this.appConfig['pokemon-species'] + name).then(res => {
                this.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
                // console.log('correctNames:', name, this.pokemons[name].name);
            });
        };
    }

    async getPokemonTypes() {
        console.log('%c getPokemonTypes() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.appConfig['type']);
        for (const type of res.results) {
            const res = await this.app.fetchAPI(type.url)
            for (const elem of res.pokemon) {
                if (!this.pokemons[elem.pokemon.name]) continue;
                if (!this.pokemons[elem.pokemon.name].type) this.pokemons[elem.pokemon.name].type = [];
                this.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
            };
            // console.log('types:', type);
        };

        
        console.log('%c getPokemonTypes() ', 'background: #42A5F5; color: #fff;');

        const missingType = [];
        for (const [codeName, obj] of Object.entries(this.pokemons)) {
            if (!obj.type) missingType.push(obj)
        }

        for (const obj of missingType) {
            const res = await this.app.fetchAPI(this.appConfig['pokemon'] + obj.id)
            res.types.forEach(elem => {
                if (!obj.type) obj.type = []
                obj.type[elem.slot-1] = elem.type.name;
            })
            // console.log(obj.name, obj.type);
        }

    }

    async getPokemonGenerations() {
        console.log('%c getPokemonGenerations() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.appConfig['generation']);
        for (const gen of res.results) {
            const res = await this.app.fetchAPI(gen.url)
            for (const pokemon of res.pokemon_species) {
                if (!this.pokemons[pokemon.name]) continue;
                this.pokemons[pokemon.name].generation = gen.name;
            };
            // console.log('gen:', gen);
        };
    }
}