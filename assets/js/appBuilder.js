export class AppBuilder {
    constructor(app) {
        this.app = app;
        this.appLoader;
        this.appNav;
        this.appList;
    }
    
    init() {
        console.log('%c init() ', 'background: #43A047; color: #fff;');
        this.buildLoader();
        this.buildNav();
        this.buildList();
    }

    buildLoader() {
        console.log('%c buildLoader() ', 'background: #43A047; color: #fff;');
        this.appLoader = document.querySelector('.loader');
        this.showLoader();
    }

    buildNav() {
        console.log('%c buildNav() ', 'background: #43A047; color: #fff;');
        this.appNav = document.querySelector('nav');
    }

    buildList() {
        console.log('%c buildList() ', 'background: #43A047; color: #fff;');
        this.appList = document.querySelector('.list');
    }

    insertList() {
        console.log('%c insertList() ', 'background: #43A047; color: #fff;');

        const pokemonCard = (codeName, pokemon) => {

            let types = '';
            pokemon.type.forEach(type => types += `<div class="${type}">${type}</div>`);

            return `<div class="list__item loading" data-pokemon-generation="${pokemon.generation}">
                <div class="item__id">${pokemon.id}</div>
                <div class='item__name'>${pokemon.name}</div>
                <div class='item__type'>${types}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" class="item__img" loading="lazy">
            </div>`
        };
        
        for (const [a, pokemon] of Object.entries(this.app.pokemons)) {
            const item = document.createElement("div");
            item.innerHTML = pokemonCard(a, pokemon);
            this.appList.append(item.firstChild);
        }

        const pokemonCards = this.appList.querySelectorAll(".list__item");
        for (const card of pokemonCards) {
            card.querySelector(".item__img").addEventListener("load", () => {
                setTimeout(() => {
                    card.classList.remove("loading");
                }, 400);
            });
        }

        this.hideLoader();
    }

    showLoader() {
        console.log('%c showLoader() ', 'background: #43A047; color: #fff;');
        document.documentElement.classList.add('scrollDisabled');
        this.appLoader.classList.add('loading');
    }

    hideLoader() {
        console.log('%c hideLoader() ', 'background: #43A047; color: #fff;');
        setTimeout(() => {
            document.documentElement.classList.remove('scrollDisabled');
            this.appLoader.classList.remove('loading');
        }, 800);
    }
}