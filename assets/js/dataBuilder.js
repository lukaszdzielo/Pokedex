import { numRomanToArabic } from './numConverter.js';
export class DataBuilder {
    constructor(app) {
        this.app = app;

        this.list = this.app.storage.getLocal(this.app.storage.names.list) || {};
        this.types = this.app.storage.getLocal(this.app.storage.names.types) || {};
        this.generations = this.app.storage.getLocal(this.app.storage.names.genNum) || [0];

    };

    async getSpeciesNum() {
        return await this.app.fetchAPI(this.app.linksAPI['pokemon-species']).then(res => res.count);
    }

    async getList() {
        const incorrectNames = await this.getCodeNameList();
        await this.getCorrectNameList(incorrectNames);
        await this.getPokemonListTypes();
        await this.getPokemonListGenerations();
        this.saveLocal();
    }

    saveLocal() {
        this.app.storage.setLocal(this.app.storage.names.list, this.list);
        this.app.storage.setLocal(this.app.storage.names.types, this.types);
        this.app.storage.setLocal(this.app.storage.names.genNum, this.generations);
    }

    async getCodeNameList() {
        const incorrectNames = [];
        const res = await this.app.fetchAPI(`${this.app.linksAPI['pokemon-species']}?${this.app.options.limit}`);

        res.results.forEach((pokemon, i) => {
            if (/\-/.test(pokemon.name)) incorrectNames.push(i + 1);
            this.list[i + 1] = { n: `${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1)}` };
        });

        return incorrectNames;
    }

    async getCorrectNameList(incorrectNames) {
        const responses = [];
        incorrectNames.forEach(id => {
            const response = this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + id);
            responses.push(response);
        });

        const pokemons = await Promise.all(responses);

        pokemons.forEach(pokemon => {
            const { id, names } = pokemon;
            this.list[id].n = names.find((object) => object.language.name === "en").name;
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
            this.types[type.id] = type.name;
            type.pokemon.forEach(elem => {
                const id = this.getIdFromUrl(elem.pokemon.url);
                if (!this.list[id]) return;
                if (!this.list[id].t) this.list[id].t = [];
                this.list[id].t[elem.slot - 1] = type.id;
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
            this.generations[0] = generation.name = (typeof generation.name === 'string') && numRomanToArabic(generation.name.replace('generation-', ''));
            generation.pokemon_species.forEach(pokemon => {
                const id = this.getIdFromUrl(pokemon.url);
                this.list[id].g = generation.name;
            });
        });
    }

    getIdFromUrl(url) {
        return /\d+/.exec(url.replace(this.app.options.baseUrl, ''))[0];
    }
}