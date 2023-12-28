import {numRomanToArabic} from './numConverter.js';
export class DataBuilder {
    constructor(app) {
        this.app = app;
    };

    async getPokemonData() {
        const incorrectNames = await this.getPokemonCodeNames();

        await this.getPokemonCorrectNames(incorrectNames);
        await this.getPokemonTypes();
        await this.getPokemonGenerations();

        localStorage.setItem("PokemonList", JSON.stringify(this.app.pokemonList));
        localStorage.setItem("PokemonTypes", JSON.stringify(this.app.pokemonTypes));
        localStorage.setItem("PokemonGen", this.app.pokemonGenerations);
    }

    async getPokemonCodeNames() {
        const incorrectNames = [];
        const res = await this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + '?' + this.app.options.limit + this.app.speciesNumber);

        res.results.forEach((pokemon,i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
            this.app.pokemonList[pokemon.name] = { id: i+1 };
        });

        return incorrectNames;
    }

    async getPokemonCorrectNames(incorrectNames) {
        const responses = [];
        incorrectNames.forEach(codeNames => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + codeNames);
            responses.push(response);
        })

        const pokemons = await Promise.all(responses);

        pokemons.forEach(pokemon => {
            this.app.pokemonList[pokemon.name].name = pokemon.names.find((object) => object.language.name === "en").name;
        })
    }

    async getPokemonTypes() {
        const res = await this.app.fetchAPI(this.app.linksAPI['type'] + '?' + this.app.options.limit);
        const responses = [];
        const missingType = [];

        res.results.forEach(type => {
            const response = this.app.fetchAPI(type.url);
            responses.push(response);
        })

        const types = await Promise.all(responses);

        types.forEach(type => {
            this.app.pokemonTypes[type.id] = type.name;
            type.pokemon.forEach(elem => {
                if (!this.app.pokemonList[elem.pokemon.name]) return;
                if (!this.app.pokemonList[elem.pokemon.name].type) this.app.pokemonList[elem.pokemon.name].type = [];
                this.app.pokemonList[elem.pokemon.name].type[elem.slot-1] = type.id;
            })
        })

        for (const [i, pokemon] of Object.entries(this.app.pokemonList)) {
            if (!pokemon.type) missingType.push(pokemon)
        }

        if (!!missingType.length) await this.getPokemonMissingTypes(missingType);
    }

    async getPokemonMissingTypes(missingType) {
        const responses = [];

        missingType.forEach(pokemon => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon'] + pokemon.id);
            responses.push(response);
        })

        const pokemons = await Promise.all(responses);

        missingType.forEach((obj, i) => {
            if (!obj.type) obj.type = []; 
            pokemons[i].types.forEach(elem => {
                obj.type[elem.slot-1] = Object.keys(this.app.pokemonTypes).find(key => this.app.pokemonTypes[key] === elem.type.name);
            })
        })
    }

    async getPokemonGenerations() {
        const res = await this.app.fetchAPI(this.app.linksAPI['generation'] + '?' + this.app.options.limit);
        const responses = [];

        res.results.forEach(generation => {
            const response = this.app.fetchAPI(generation.url);
            responses.push(response);
        })

        const generations = await Promise.all(responses);

        generations.forEach(generation => {
            this.app.pokemonGenerations = generation.name = (typeof generation.name === 'string') && numRomanToArabic(generation.name.replace('generation-', ''));
            generation.pokemon_species.forEach(pokemon => {
                this.app.pokemonList[pokemon.name].g = generation.name;
            });
        })
    }
}