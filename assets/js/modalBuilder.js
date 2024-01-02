export class ModalBuilder {
    constructor(app) {
        this.app = app;
        this.pokemonDialog;
        this.pokemonDialogWrapper;
    }

    async openPokemonDialog(pokemonCodeName, pokemonId) {
        if (!this.pokemonDialog) this.buildPokemonDialog();

        this.removePokemonContent();

        this.insertPokemonBasic(pokemonCodeName);
        this.pokemonDialog.showModal();

        const pokemonData = await this.getPokemonData(pokemonId);
        this.insertPokemonDetails(pokemonData);

        // console.log('1', this.pokemonDialog.open);
        // console.log('2', this.pokemonDialog.open);
    }

    closePokemonDialog() {
        this.pokemonDialog.close();
        this.removePokemonContent();
    }

    getPokemonData(pokemonCodeName) {
        return this.app.fetchAPI(this.app.linksAPI['pokemon'] + pokemonCodeName);
    }

    buildPokemonDialog() {
        this.app.appBuilder.appList.insertAdjacentHTML('afterend', this.patternPokemonDialog());

        this.pokemonDialog = document.querySelector('#pokemonDialog');
        this.pokemonDialogWrapper = document.querySelector('#pokemonDialogWrapper');

        this.pokemonDialog.querySelector('#dialog__close').addEventListener("click", () => this.closePokemonDialog());
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
        const { id, types, g: genNum } = this.app.pokemonList[pokemonCodeName];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return `<div class="info">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='dialog__image'><img src="${imageUrl}" class="item__img" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
        <div class="dialog__name">${name}</div>
        ${(typeof types && typeof types !== 'undefined' && types.length > 0) ? `<div class="dialog__types">${types.map(type => `<span>${this.app.pokemonTypes[type]}</span>`).join('')}</div>` : ''}
        ${(typeof genNum && typeof genNum !== 'undefined') ? `<div class='dialog__gen'>Gen: ${genNum}</div>` : ''}
        </div>`;
    }

    patternPokemonDetails(pokemonData) {
        const { height, weight } = pokemonData;

        console.log('pokemonData', pokemonData);

        return `<div class="details">
        <div>Height: ${height}</div>
        <div>Weight: ${weight}</div>
        </div>`;
    }
}