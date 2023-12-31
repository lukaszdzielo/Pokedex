export class ModalBuilder {
    constructor(app) {
        this.app = app;
        this.pokemonDialog;
        this.pokemonDialogWrapper;
    }

    async openPokemonDialog(pokemonCodeName) {
        if (!this.pokemonDialog) this.buildPokemonDialog();

        this.removePokemonContent();

        this.insertPokemonBasic(pokemonCodeName);
        this.pokemonDialog.showModal();

        const pokemonData = await this.getPokemonData(pokemonCodeName);
        this.insertPokemonDetails(pokemonData);

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

    removePokemonContent() {
        this.pokemonDialogWrapper.replaceChildren();
    }

    insertPokemonBasic(pokemonCodeName) {
        this.pokemonDialogWrapper.insertAdjacentHTML('afterbegin', this.patternPokemonInfo(pokemonCodeName));
    }

    insertPokemonDetails(pokemonData) {
        this.pokemonDialogWrapper.insertAdjacentHTML('beforeend', this.patternPokemonDetails(pokemonData));
    }

    patternPokemonInfo(pokemonCodeName) {
        const name = this.app.pokemonList[pokemonCodeName].name ? this.app.pokemonList[pokemonCodeName].name : `${pokemonCodeName.charAt(0).toUpperCase()}${pokemonCodeName.slice(1)}`;
        const { id, type, g: gen } = this.app.pokemonList[pokemonCodeName];
        console.log('basic', type, gen);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        // ${type.array.forEach(elem => {

        // })}

        return `<div class="info">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='dialog__image'><img src="${imageUrl}" class="item__img" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
        <div class="dialog__name">${name}</div>
        
        </div>`;
    }

    patternPokemonDetails(pokemonData) {
        const { height } = pokemonData;

        console.log('pokemonData', pokemonData);

        return `<div class="details">
        <div>Height: ${height}</div>
        </div>`;
    }
}