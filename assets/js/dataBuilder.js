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

        this.app.storage.setLocal(this.app.storage.names.list, this.app.pokemonList);
        this.app.storage.setLocal(this.app.storage.names.types, this.app.pokemonTypes);
        this.app.storage.setLocal(this.app.storage.names.genNum, this.app.pokemonGenerations);
    }

    async getPokemonListCodeNames() {
        const incorrectNames = [];
        const res = await this.app.fetchAPI(`${this.app.linksAPI['pokemon-species']}?${this.app.options.limit}`);

        res.results.forEach((pokemon, i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(i + 1);
            this.app.pokemonList[i + 1] = { n: `${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1)}` };
        });

        return incorrectNames;
    }

    async getPokemonListCorrectNames(incorrectNames) {
        const responses = [];
        incorrectNames.forEach(id => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + id);
            responses.push(response);
        });

        const pokemons = await Promise.all(responses);

        pokemons.forEach(pokemon => {
            const { id, names } = pokemon;
            this.app.pokemonList[id].n = names.find((object) => object.language.name === "en").name;
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
                const id = this.getIdFromUrl(elem.pokemon.url);
                if (!this.app.pokemonList[id]) return;
                if (!this.app.pokemonList[id].t) this.app.pokemonList[id].t = [];
                this.app.pokemonList[id].t[elem.slot - 1] = type.id;
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
                const id = this.getIdFromUrl(pokemon.url);
                this.app.pokemonList[id].g = generation.name;
            });
        });
    }

    getIdFromUrl(url) {
        return /\d+/.exec(url.replace(this.app.options.baseUrl, ''))[0];
    }
}