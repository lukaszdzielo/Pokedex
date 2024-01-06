import { SchemeManager } from './SchemeManager.js';
import { NavBuilder } from './NavBuilder.js';
import { CardBuilder } from './cardBuilder.js';
import { ModalBuilder } from './modalBuilder.js';
export class AppBuilder {
    constructor(app) {
        this.app = app;
        this.schemeManager = new SchemeManager(this.app);

        this.appLoader = document.querySelector('.loader');

        this.navBuilder = new NavBuilder(this.app);

        this.appList = document.querySelector('#pokemonList');

        this.pokemonModal = document.querySelector('#pokemonModal');

        this.cardBuilder = new CardBuilder(this.app);
        this.modalBuilder = new ModalBuilder(this.app);
    }

    init() {
        this.buildLoader();
    }

    buildLoader() {
        this.showLoader();
    }

    insertList() {
        let list = '';
        for (const [codeName, pokemon] of Object.entries(this.app.pokemonList)) {
            list += this.cardBuilder.pattern(codeName, pokemon);
        }
        this.appList.insertAdjacentHTML('afterbegin', list);
        this.handleEvents();
    }

    handleEvents() {
        this.appList.addEventListener('click', (e) => {
            const elem = e.target.closest('.card');
            if (elem) {
                this.modalBuilder.openPokemonDialog(elem.dataset.id);
            }
        });
    }

    removeList() {
        this.appList.replaceChildren();
    }

    showLoader() {
        document.documentElement.classList.add('scrollDisabled');
        this.appLoader.classList.add('loading');
    }

    hideLoader() {
        setTimeout(() => {
            document.documentElement.classList.remove('scrollDisabled');
            this.appLoader.classList.remove('loading');
        }, 800);
    }
}