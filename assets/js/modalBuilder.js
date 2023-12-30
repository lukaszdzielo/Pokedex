export class ModalBuilder {
    constructor(app) {
        this.app = app;
        this.pokemonModal = document.querySelector('#pokemonModal');
        this.dialog;
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

    openDialog() {
        console.log('openDialog()');
        this.dialog = this.dialog ? this.dialog : this.insertModal();

        this.dialog.showModal();
        this.dialog.querySelector('#dialog__close').addEventListener("click", () => this.dialog.close());
    }

    insertModal() {
        this.app.appBuilder.appList.insertAdjacentHTML('afterend', this.pattern());
        return document.querySelector('#pokemonDialog');
    }

    pattern() {
        return `<dialog id="pokemonDialog">
        <button id="dialog__close">Close</button>
        <div>name</div>
    </dialog>`;
    }
}