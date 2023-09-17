export class DataBuilder {
    constructor(app) {
        console.log('%c constructor() ', 'background: #42A5F5; color: #fff;');
        this.app = app;
    };

    async getPokemonData() {
        console.group('%c getPokemonData() ', 'background: #42A5F5; color: #fff;');

        const incorrectNames = await this.getPokemonCodeNames();

        await this.getPokemonCorrectNames(incorrectNames);
        await this.getPokemonTypes();
        await this.getPokemonGenerations();

        localStorage.setItem("PokemonsData", JSON.stringify(this.app.pokemons));

        console.log('%c getPokemonData() - END', 'background: #E53935; color: #fff;');
        console.groupEnd();
    }

    async getPokemonCodeNames() {
        console.log('%c getPokemonNames() ', 'background: #42A5F5; color: #fff;');

        const incorrectNames = [];

        const res = await this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + '?' + this.app.options.limit + this.app.speciesNumber)

        res.results.forEach((pokemon,i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
            this.app.pokemons[pokemon.name] = {
                id: i+1,
                name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            };
        });

        return incorrectNames;
    }

    async getPokemonCorrectNames(incorrectNames) {
        console.log('%c getPokemonCorrectNames() ', 'background: #42A5F5; color: #fff;');

        const responses = [];
        for (const codeNames of incorrectNames) {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + codeNames);
            responses.push(response);
        }

        const pokemons = await Promise.all(responses);

        for (const pokemon of pokemons) {
            this.app.pokemons[pokemon.name].name = pokemon.names.find((object) => object.language.name === "en").name;
            // console.log('correct:', pokemon.name, this.app.pokemons[pokemon.name].name);
        };
    }

    async getPokemonTypes() {
        console.log('%c getPokemonTypes() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.app.linksAPI['type']);

        const responses = [];
        const missingType = [];

        for (const type of res.results) {
            const response = this.app.fetchAPI(type.url);
            responses.push(response);
        };

        const types = await Promise.all(responses);

        for (const type of types) {
            for (const elem of type.pokemon) {
                if (!this.app.pokemons[elem.pokemon.name]) continue;
                if (!this.app.pokemons[elem.pokemon.name].type) this.app.pokemons[elem.pokemon.name].type = [];
                this.app.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
            };
        }; 

        for (const [i, pokemon] of Object.entries(this.app.pokemons)) {
            if (!pokemon.type) missingType.push(pokemon)
        }

        if (!!missingType.length) await this.getPokemonMissingTypes(missingType);
    }

    async getPokemonMissingTypes(missingType) {
        console.log('%c getPokemonMissingTypes() ', 'background: #42A5F5; color: #fff;');

        const responses = [];

        for (const pokemon of missingType) {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon'] + pokemon.id);
            responses.push(response);
        };

        const pokemons = await Promise.all(responses);

        missingType.forEach((obj, i) => {
            if (!obj.type) obj.type = []; 
            pokemons[i].types.forEach(elem => {
                obj.type[elem.slot-1] = elem.type.name;
            })
            // console.log('-', obj)
        })
    }

    async getPokemonGenerations() {
        console.log('%c getPokemonGenerations() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.app.linksAPI['generation']);
        const responses = [];

        for (const generation of res.results) {
            const response = this.app.fetchAPI(generation.url);
            responses.push(response);
        };

        const generations = await Promise.all(responses);

        generations.forEach(generation => {
            generation.pokemon_species.forEach(pokemon => {
                this.app.pokemons[pokemon.name].generation = generation.name;
                // console.log(this.app.pokemons[pokemon.name]);
            })
        })
    }
}