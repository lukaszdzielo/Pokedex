export class ModalBuilder {
    constructor(app) {
        this.app = app;
        this.pokemonModal = document.querySelector('#pokemonModal');
    }

    async init(codeName, pokemon) {
        if (!this.app.pokemon[codeName]) {
            const res = await this.app.fetchAPI(this.app.linksAPI['pokemon'] + codeName);
            this.app.pokemon[codeName] = { ...res, name: (pokemon.name) };
        }
        this.pokemonModal.classList.add('show');
        this.pokemonModal.innerHTML = this.pattern(this.app.pokemon[codeName]);
    }

    pattern(pokemon) {
        return `
            <div>${pokemon.name}</div>
            <div>${pokemon.id}</div>
        `;
    }
}