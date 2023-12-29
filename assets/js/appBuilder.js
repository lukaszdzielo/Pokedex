import { AppCardBuilder } from './appCardBuilder.js';
import { AppModalBuilder } from './appModalBuilder.js';
export class AppBuilder {
    constructor(app) {
        this.app = app;
        this.appLoader;
        this.appNav;
        this.appList;
        this.pokemonModal = document.querySelector('#pokemonModal');
        this.appCardBuilder = new AppCardBuilder(this.app);
        this.appModalBuilder = new AppModalBuilder(this.app);
    }

    init() {
        this.buildLoader();
        this.buildNav();
        this.buildList();
    }

    buildLoader() {
        this.appLoader = document.querySelector('.loader');
        this.showLoader();
    }

    buildNav() {
        this.appNav = document.querySelector('nav');
    }

    buildList() {
        this.appList = document.querySelector('.list');
    }

    insertList() {
        let list = document.createElement("div");

        for (const [codeName, pokemon] of Object.entries(this.app.pokemonList)) {
            const card = this.appCardBuilder.init(codeName, pokemon);
            // card.addEventListener('click', (e)=>{
            //     this.appModalBuilder.init(codeName, pokemon);
            // });
            this.appList.appendChild(card);
        }
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