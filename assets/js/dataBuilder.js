import { numRomanToArabic } from './numConverter.js';
export class DataBuilder {
    constructor(app) {
        this.app = app;
    };

    async getPokemonListData() {
        const incorrectNames = await this.getPokemonListCodeNames();

        await this.getPokemonListCorrectNames(incorrectNames);
        await this.getPokemonListTypes();
        await this.getPokemonListGenerations();

        this.app.storage.set(this.app.storage.names.list, this.app.pokemonList, localStorage);
        this.app.storage.set(this.app.storage.names.types, this.app.pokemonTypes, localStorage);
        this.app.storage.set(this.app.storage.names.genNum, this.app.pokemonGenerations, localStorage);
    }

    async getPokemonListCodeNames() {
        const incorrectNames = [];
        const res = await this.app.fetchAPI(`${this.app.linksAPI['pokemon-species']}?${this.app.options.limit}`);

        res.results.forEach((pokemon, i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
            this.app.pokemonList[pokemon.name] = { id: i + 1 };
        });

        return incorrectNames;
    }

    async getPokemonListCorrectNames(incorrectNames) {
        const responses = [];
        incorrectNames.forEach(codeNames => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + codeNames);
            responses.push(response);
        });

        const pokemons = await Promise.all(responses);

        pokemons.forEach(pokemon => {
            this.app.pokemonList[pokemon.name].name = pokemon.names.find((object) => object.language.name === "en").name;
        });
    }

    async getPokemonListTypes() {
        const res = await this.app.fetchAPI(`${this.app.linksAPI['type']}?${this.app.options.limit}`);
        const responses = [];
        const missingTypes = [];

        res.results.forEach(type => {
            const response = this.app.fetchAPI(type.url);
            responses.push(response);
        });

        const types = await Promise.all(responses);

        types.forEach(type => {
            this.app.pokemonTypes[type.id] = type.name;
            type.pokemon.forEach(elem => {
                if (!this.app.pokemonList[elem.pokemon.name]) return;
                if (!this.app.pokemonList[elem.pokemon.name].types) this.app.pokemonList[elem.pokemon.name].types = [];
                this.app.pokemonList[elem.pokemon.name].types[elem.slot - 1] = type.id;
            });
        });

        for (const [i, pokemon] of Object.entries(this.app.pokemonList)) {
            if (!pokemon.types) missingTypes.push(pokemon);
        }

        if (!!missingTypes.length) await this.getPokemonListMissingTypes(missingTypes);
    }

    async getPokemonListMissingTypes(missingTypes) {
        const responses = [];

        missingTypes.forEach(pokemon => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon'] + pokemon.id);
            responses.push(response);
        });

        const pokemons = await Promise.all(responses);

        missingTypes.forEach((obj, i) => {
            if (!obj.type) obj.types = [];
            pokemons[i].types.forEach(elem => {
                obj.types[elem.slot - 1] = Object.keys(this.app.pokemonTypes).find(key => this.app.pokemonTypes[key] === elem.type.name);
            });
        });
    }

    async getPokemonListGenerations() {
        const res = await this.app.fetchAPI(`${this.app.linksAPI['generation']}?${this.app.options.limit}`);
        const responses = [];

        res.results.forEach(generation => {
            const response = this.app.fetchAPI(generation.url);
            responses.push(response);
        });

        const generations = await Promise.all(responses);

        generations.forEach(generation => {
            this.app.pokemonGenerations = generation.name = (typeof generation.name === 'string') && numRomanToArabic(generation.name.replace('generation-', ''));
            generation.pokemon_species.forEach(pokemon => {
                this.app.pokemonList[pokemon.name].g = generation.name;
            });
        });
    }
}