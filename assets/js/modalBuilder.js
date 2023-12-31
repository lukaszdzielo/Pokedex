export class ModalBuilder {
    constructor(app) {
        this.app = app;
        this.pokemonDialog;
        this.pokemonDialogWrapper;
    }

    async openPokemonDialog(id) {

        if (!this.pokemonDialog) this.buildPokemonDialog();
        this.removePokemonContent();

        this.insertPokemonBasic(id);
        this.pokemonDialog.showModal();

        if (!this.app.pokemonDetails[id]) {
            console.log('download', id);
            this.app.pokemonDetails[id] = await this.getPokemonData(id);
        } else {
            console.log('sessionStorage', id);
        }

        this.app.storage.setSession(this.app.storage.names.details, this.app.pokemonDetails);

        this.insertPokemonDetails(this.app.pokemonDetails[id]);

        // console.log('1', this.pokemonDialog.open);
    }

    closePokemonDialog() {
        this.pokemonDialog.close();
        this.removePokemonContent();
    }

    getPokemonData(id) {
        return this.app.fetchAPI(this.app.linksAPI['pokemon'] + id);
    }

    buildPokemonDialog() {
        this.app.appBuilder.appList.insertAdjacentHTML('afterend', this.patternPokemonDialog());

        this.pokemonDialog = document.querySelector('#pokemonDialog');

        const asd = this.pokemonDialog.querySelector('#catchBtn');
        asd.addEventListener('click', e => {
            if (!this.app.pokemonCatched.includes(+this.pokemonDialog.dataset.id)) {
                this.app.catchedManager.add(+this.pokemonDialog.dataset.id);
            } else {
                this.app.catchedManager.remove(+this.pokemonDialog.dataset.id);
            }
        });

        this.pokemonDialogWrapper = document.querySelector('#pokemonDialogWrapper');

        this.pokemonDialog.querySelector('#dialog__close').addEventListener("click", () => this.closePokemonDialog());
    }

    patternPokemonDialog() {
        return `<dialog id="pokemonDialog" class="loading" data-id="">
        <div class="loader"></div>
        <header>
            <button id="dialog__close" class="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" /></svg>
            </button>
        </header>
        <button id="catchBtn">Catch/Catched</button>
        <div id="pokemonDialogWrapper"></div>
    </dialog>`;
    }

    removePokemonContent() {
        this.pokemonDialogWrapper.replaceChildren();
    }

    insertPokemonBasic(id) {
        this.pokemonDialogWrapper.insertAdjacentHTML('afterbegin', this.patternPokemonInfo(id));
        this.pokemonDialog.dataset.id = id;
    }

    insertPokemonDetails(pokemonData) {
        this.pokemonDialogWrapper.insertAdjacentHTML('beforeend', this.patternPokemonDetails(pokemonData));
    }

    patternPokemonInfo(id) {
        const { n, t, g } = this.app.pokemonList[id];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return `<div class="info">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='dialog__image'><img src="${imageUrl}" class="item__img" alt="${n}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
        <div class="dialog__name">${n}</div>
        ${(typeof id && typeof id !== 'undefined') ? `<div class="dialog__name">Id: ${id}</div>` : ''}
        ${(typeof t && typeof t !== 'undefined' && t.length > 0) ? `<div class="dialog__types">${t.map(type => `<span>${this.app.pokemonTypes[type]}</span>`).join('')}</div>` : ''}
        ${(typeof g && typeof g !== 'undefined') ? `<div class='dialog__gen'>Gen: ${g}</div>` : ''}
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