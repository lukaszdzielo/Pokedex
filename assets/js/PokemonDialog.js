import { DialogBuilder } from "./dialogBuilder.js";

export class PokemonDialog extends DialogBuilder {
    constructor(app) {
        super(app);
        this.app = app;
    }

    async open(id) {
        super.open();

        if (!this.dialog) this.buildDialog();
        this.removeContent();

        this.insertBasicInfo(id);
        this.eventHandler();
        this.catchedBtn();
        this.dialog.showModal();

        if (!this.app.dataManager.details[id]) {
            console.log('download', id);
            this.app.dataManager.details[id] = await this.getDetailsData(id);
        } else {
            console.log('sessionStorage', id);
        }

        this.app.storage.setSession(this.app.storage.names.details, this.app.dataManager.details);

        this.insertDetails(this.app.dataManager.details[id]);

        this.app.appBuilder.disableBodyScroll();
        // console.log('1', this.dialog.open);
    }

    close() {
        super.close();
        this.removeContent();
        this.dialog.remove();
        delete this.dialog;
    }

    getDetailsData(id) {
        return this.app.fetchAPI(this.app.linksAPI['pokemon'] + id);
    }

    buildDialog() {
        this.app.appBuilder.appList.insertAdjacentHTML('afterend', this.patternDialog());

        this.dialog = document.querySelector('#pokemonDialog');

        this.dialogWrapper = document.querySelector('#pokemonDialogWrapper');

        this.dialog.querySelector('#dialog__close').addEventListener("click", () => this.close());
    }

    eventHandler() {
        this.dialog.querySelector('#isCatched').addEventListener('change', () => {
            if (!this.app.dataManager.catched.includes(+this.dialog.dataset.id)) {
                this.app.dataManager.catchedManager.add(+this.dialog.dataset.id);
            } else {
                this.app.dataManager.catchedManager.remove(+this.dialog.dataset.id);
            }
        });
    }

    catchedBtn() {
        this.dialog.querySelector('#isCatched').checked = (this.app.dataManager.catched.includes(+this.dialog.dataset.id)) ? true : false;
    }

    patternDialog() {
        return `<dialog id="pokemonDialog" data-id="">
        <header>
            <div class="catched">
                <input type="checkbox" id="isCatched">
                <label for="isCatched" class="btn">
                    <svg class="notCatched" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" xml:space="preserve"><path d="M6.1,6.5C6.3,7.4,7.1,8,8,8s1.7-0.6,1.9-1.5h4c0-0.2,0-0.3,0-0.5c0-3.3-2.7-6-6-6S2,2.7,2,6c0,0.2,0,0.3,0,0.5H6.1z M8,7C7.4,7,7,6.6,7,6s0.4-1,1-1s1,0.4,1,1S8.6,7,8,7z M8,1c2.6,0,4.7,2,5,4.5H9.9C9.7,4.6,8.9,4,8,4S6.3,4.6,6.1,5.5h-3C3.3,3,5.4,1,8,1z"/><path d="M14,9.5h-3.5H9.9H9c0,0,0,0.3,0,0.5c0,0.6-0.4,1-1,1s-1-0.4-1-1c0-0.2,0-0.5,0-0.5H6.1H5.6H2C2,9.7,2,9.8,2,10c0,3.3,2.7,6,6,6s6-2.7,6-6C14,9.8,14,9.7,14,9.5z M8,15c-2.6,0-4.7-2-5-4.5h3C6.3,11.4,7.1,12,8,12s1.7-0.6,1.9-1.5H13C12.7,13,10.6,15,8,15z"/></svg>
                    <svg class="catched" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" xml:space="preserve"><path d="M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z M8,3c2.6,0,4.7,2,5,4.5H9.9C9.7,6.6,8.9,6,8,6S6.3,6.6,6.1,7.5h-3C3.3,5,5.4,3,8,3z M9,8c0,0.6-0.4,1-1,1S7,8.6,7,8s0.4-1,1-1S9,7.4,9,8z M8,13c-2.6,0-4.7-2-5-4.5h3C6.3,9.4,7.1,10,8,10s1.7-0.6,1.9-1.5H13C12.7,11,10.6,13,8,13z"/></svg>
                </label>
            </div>
            <button id="dialog__close" class="btn close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" /></svg>
            </button>
        </header>
        <main>

            <div id="pokemonDialogWrapper"></div>
        </main>
    </dialog>`;
    }

    removeContent() {
        this.dialogWrapper.replaceChildren();
    }

    insertBasicInfo(id) {
        this.dialogWrapper.insertAdjacentHTML('afterbegin', this.patternInfo(id));
        this.dialog.dataset.id = id;
    }

    insertDetails(pokemonData) {
        this.dialogWrapper.insertAdjacentHTML('beforeend', this.patternDetails(pokemonData));
    }

    patternInfo(id) {
        const { n, t, g } = this.app.dataManager.list[id];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return `<div class="info">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='dialog__image'><img src="${imageUrl}" class="item__img" alt="${n}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
        <div class="dialog__name">${n}</div>
        ${(typeof id && typeof id !== 'undefined') ? `<div class="dialog__name">Id: ${id}</div>` : ''}
        ${(typeof t && typeof t !== 'undefined' && t.length > 0) ? `<div class="dialog__types">${t.map(type => `<span>${this.app.dataManager.types[type]}</span>`).join('')}</div>` : ''}
        ${(typeof g && typeof g !== 'undefined') ? `<div class='dialog__gen'>Gen: ${g}</div>` : ''}
        </div>`;
    }

    patternDetails(pokemonData) {
        const { height, weight, stats } = pokemonData;

        console.log('pokemonData', pokemonData);

        return `<div class="details">
            <div>Height: ${height}</div>
            <div>Weight: ${weight}</div>

            ${(typeof stats && typeof stats !== 'undefined' && stats.length > 0) ? `<div>
                <div class="stats">Stats</div>
                <table>
                    <tr><th></th><th>Base stat</th><tr>
                    ${stats.map(elem => `<tr><td>${elem.stat.name}</td> <td>${elem.base_stat}</td></tr>`).join('')}
                </table>
            </div>` : ''}

        </div>`;
    }
}