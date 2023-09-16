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
        await this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + '?' + this.app.options.limit + this.app.speciesNumber).then(res => {
            res.results.forEach((pokemon,i) => {
                if (/\-/.test(pokemon.name)) incorrectNames.push(pokemon.name);
                this.app.pokemons[pokemon.name] = {
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
            await this.app.fetchAPI(this.app.linksAPI['pokemon-species'] + name).then(res => {
                this.app.pokemons[name].name = (res.names.find((object) => object.language.name === "en")).name;
                // console.log('correctNames:', name, this.app.pokemons[name].name);
            });
        };
    }

    async getPokemonTypes() {
        console.log('%c getPokemonTypes() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.app.linksAPI['type']);
        for (const type of res.results) {
            const res = await this.app.fetchAPI(type.url)
            for (const elem of res.pokemon) {
                if (!this.app.pokemons[elem.pokemon.name]) continue;
                if (!this.app.pokemons[elem.pokemon.name].type) this.app.pokemons[elem.pokemon.name].type = [];
                this.app.pokemons[elem.pokemon.name].type[elem.slot-1] = type.name;
            };
            // console.log('types:', type);
        };

        
        console.log('%c getPokemonTypes() ', 'background: #42A5F5; color: #fff;');

        const missingType = [];
        for (const [codeName, obj] of Object.entries(this.app.pokemons)) {
            if (!obj.type) missingType.push(obj)
        }

        if (!!missingType.length) await this.getPokemonMissingTypes(missingType);
    }

    async getPokemonMissingTypes(missingType) {
        console.log('%c getPokemonMissingTypes() ', 'background: #42A5F5; color: #fff;');

        for (const obj of missingType) {
            const res = await this.app.fetchAPI(this.app.linksAPI['pokemon'] + obj.id)
            res.types.forEach(elem => {
                if (!obj.type) obj.type = []
                obj.type[elem.slot-1] = elem.type.name;
            })
            // console.log(obj.name, obj.type);
        }
    }

    async getPokemonGenerations() {
        console.log('%c getPokemonGenerations() ', 'background: #42A5F5; color: #fff;');

        const res = await this.app.fetchAPI(this.app.linksAPI['generation']);
        for (const gen of res.results) {
            const res = await this.app.fetchAPI(gen.url)
            for (const pokemon of res.pokemon_species) {
                if (!this.app.pokemons[pokemon.name]) continue;
                this.app.pokemons[pokemon.name].generation = gen.name;
            };
            // console.log('gen:', gen);
        };
    }
}