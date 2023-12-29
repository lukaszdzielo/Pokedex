import { CardBuilder } from './cardBuilder.js';
import { ModalBuilder } from './modalBuilder.js';
export class AppBuilder {
    constructor(app) {
        this.app = app;

        this.appLoader = document.querySelector('.loader');
        this.appNav = document.querySelector('nav');
        this.appList = document.querySelector('#pokemonList');
        this.pokemonModal = document.querySelector('#pokemonModal');

        this.appCardBuilder = new CardBuilder(this.app);
        this.appModalBuilder = new ModalBuilder(this.app);
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
            list += this.appCardBuilder.pattern(codeName, pokemon);
            // list.insertAdjacentHTML('afterbegin', card);
            //     console.log(this.appCardBuilder.init(codeName, pokemon));
            //     // card.addEventListener('click', (e)=>{
            //     //     this.appModalBuilder.init(codeName, pokemon);
            //     // });
            //     this.appList.appendChild(card);
        }
        this.appList.insertAdjacentHTML('afterbegin', list);
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