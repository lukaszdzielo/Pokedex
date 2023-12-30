export class ModalBuilder {
    constructor(app) {
        this.app = app;
        // this.pokemonModal = document.querySelector('#pokemonModal');
        this.pokemonDialog;
        this.pokemonDialogWrapper;
    }

    // async init(codeName, pokemon) {
    //     if (!this.app.pokemon[codeName]) {
    //         const res = await this.app.fetchAPI(this.app.linksAPI['pokemon'] + codeName);
    //         this.app.pokemon[codeName] = { ...res, name: (pokemon.name) };
    //     }
    //     this.pokemonModal.classList.add('show');
    //     this.pokemonModal.innerHTML = this.pattern(this.app.pokemon[codeName]);
    // }

    // pattern(pokemon) {
    //     return `
    //         <div>${pokemon.name}</div>
    //         <div>${pokemon.id}</div>
    //     `;
    // }

    async openPokemonDialog(pokemonCodeName) {
        if (!this.pokemonDialog) this.buildPokemonDialog();
        this.pokemonDialog.showModal();

        const pokemonData = await this.getPokemonData(pokemonCodeName);


        this.removePokemonDialogContent();
        this.insertPokemonDialogContent(pokemonData);

        // console.log('1', this.pokemonDialog.open);
        // console.log('2', this.pokemonDialog.open);
    }

    getPokemonData(pokemonCodeName) {
        return this.app.fetchAPI(this.app.linksAPI['pokemon'] + pokemonCodeName);
    }

    buildPokemonDialog() {
        this.app.appBuilder.appList.insertAdjacentHTML('afterend', this.patternPokemonDialog());

        this.pokemonDialog = document.querySelector('#pokemonDialog');
        this.pokemonDialogWrapper = document.querySelector('#pokemonDialogWrapper');

        this.pokemonDialog.querySelector('#dialog__close').addEventListener("click", () => this.pokemonDialog.close());
    }

    patternPokemonDialog() {
        return `<dialog id="pokemonDialog" class="loading">
        <div class="loader"></div>
        <button id="dialog__close">Close</button>
        <div id="pokemonDialogWrapper"></div>
    </dialog>`;
    }

    removePokemonDialogContent() {
        this.pokemonDialogWrapper.replaceChildren();
    }

    insertPokemonDialogContent(pokemonData) {
        this.pokemonDialogWrapper.insertAdjacentHTML('afterbegin', this.patternPokemonDialogContent(pokemonData));
    }

    patternPokemonDialogContent(pokemonData) {
        const { id, height } = pokemonData;
        const name = this.app.pokemonList[pokemonData.name].name ? this.app.pokemonList[pokemonData.name].name : `${pokemonData.name.charAt(0).toUpperCase()}${pokemonData.name.slice(1)}`;
        // console.log(this.app.pokemonList[name].name);
        console.log('?', pokemonData);
        return `<div class="pokemonName">${name}</div>
        <div>Id: ${id}</div>
        <div>Height: ${height}</div>`;
    }
}