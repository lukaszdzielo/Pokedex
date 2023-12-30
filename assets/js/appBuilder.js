import { CardBuilder } from './cardBuilder.js';
import { ModalBuilder } from './modalBuilder.js';
export class AppBuilder {
    constructor(app) {
        this.app = app;

        this.appLoader = document.querySelector('.loader');
        this.appNav = document.querySelector('nav');
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

            if (window.location.href.startsWith("http://localhost") || window.location.href.startsWith("https://localhost")) {
                if (this.app.options.devlimit > 0 && Object.entries(this.app.pokemonList)[this.app.options.devlimit - 1][0] === codeName) break;
            }
        }
        this.appList.insertAdjacentHTML('afterbegin', list);
        this.handleEvents();
    }

    handleEvents() {
        this.appList.addEventListener('click', (e) => {
            const elem = e.target.closest('.card');
            if (elem) {
                this.modalBuilder.openPokemonDialog(elem.dataset.codeName);
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