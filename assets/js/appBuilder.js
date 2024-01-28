import { SchemeManager } from './SchemeManager.js';
import { NavBuilder } from './NavBuilder.js';
import { PaginationBuilder } from './paginationBuilder.js';
import { CardBuilder } from './cardBuilder.js';
import { PokemonDialog } from './PokemonDialog.js';

export class AppBuilder {
    constructor(app) {
        this.app = app;

        this.schemeManager = new SchemeManager(this.app);

        this.currentPage;
        this.showedPerPage = 50;

        this.navBuilder = new NavBuilder(this.app);
        this.pagination = new PaginationBuilder(this.app);

        this.appList = document.querySelector('#pokemonList');

        this.cardBuilder = new CardBuilder(this.app);
        this.pokemonDialog = new PokemonDialog(this.app);
        this.handleEvents();
    }

    getCurrentPage() {
        const min = 1;
        const max = Math.ceil(Object.keys(this.app.currentShown).length / this.app.appBuilder.showedPerPage);
        let page = this.app.url.get(this.app.url.names.pageNum) || (this.app.url.set(this.app.url.names.pageNum, 1));

        const initPage = page;

        page = isNaN(+page) ? min : (page < min) ? min : ((page > max) ? max : page);
        this.currentPage = page;

        initPage !== page && this.app.url.set(this.app.url.names.pageNum, page);
        this.app.url.setDefault();
    }

    page() {
        const start = (this.currentPage * this.showedPerPage) - this.showedPerPage;
        const end = (this.currentPage * this.showedPerPage);
        return Object.entries(this.app.currentShown).slice(start, end);
    }

    updateList() {
        let list = '';
        for (const [id, pokemon] of this.page()) {
            list += this.cardBuilder.pattern(id, pokemon);
        }
        this.removeList();
        this.appList.insertAdjacentHTML('afterbegin', list);
        this.scrollTop();
    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    handleEvents() {
        window.onpopstate = () => {
            this.app.url.params = new URLSearchParams(location.search);
            this.currentPage = this.app.url.get(this.app.url.names.pageNum);
            this.updateList();
            // this.app.appBuilder.pagination.changeActiveLists();
            // this.app.appBuilder.pagination.changeActiveSelects();
        };

        this.appList.addEventListener('click', (e) => {
            const elem = e.target.closest('.card');
            if (elem) {
                this.pokemonDialog.open(elem.dataset.id);
            }
        });
    }

    removeList() {
        this.appList.replaceChildren();
    }

    // showLoader() {
    //     this.appLoader.classList.add('loading');
    // }

    // hideLoader() {
    //     setTimeout(() => {
    //         document.documentElement.classList.remove('scrollDisabled');
    //         this.appLoader.classList.remove('loading');
    //     }, 800);
    // }

    enableBodyScroll() {
        document.documentElement.classList.remove('scrollDisabled');
    }

    disableBodyScroll() {
        document.documentElement.classList.add('scrollDisabled');
    }
}