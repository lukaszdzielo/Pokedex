import { CardBuilder } from './cardBuilder.js';
import { ModalBuilder } from './modalBuilder.js';
export class AppBuilder {
    constructor(app) {
        this.app = app;

        this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        this.appLoader = document.querySelector('.loader');
        this.nav = document.querySelector('nav');
        this.navDialog = this.nav.querySelector('#dialogSettings');
        this.appList = document.querySelector('#pokemonList');
        this.pokemonModal = document.querySelector('#pokemonModal');

        this.cardBuilder = new CardBuilder(this.app);
        this.modalBuilder = new ModalBuilder(this.app);
    }

    init() {
        const switcher = document.querySelector('#theme-switcher');

        switcher.addEventListener('input', e => setTheme(e.target.value));

        const setTheme = theme => document.firstElementChild.setAttribute('color-scheme', theme);






        console.log('theme:', this.theme);
        this.buildLoader();
        this.buildNav();
    }

    buildLoader() {
        this.showLoader();
    }

    buildNav() {
        this.navDialog.showModal();
        const closeBtn = this.navDialog.querySelector('#closeSettings');

        closeBtn.addEventListener('click', () => {
            this.navDialog.close();
        });
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