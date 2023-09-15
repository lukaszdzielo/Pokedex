export class ListBuilder {

    constructor(app) {
        this.app = app;
        this.appList;
    }

    buildList() {
        this.appList = document.querySelector('.list');
        console.log('s',this.appList);
    }

    insertList() {
        console.log('%c insertList() ', 'background: #43A047; color: #fff;');

        const pokemonCard = (codeName, pokemon) => {
            return `<div class="list__item loading" data-pokemon-generation="${pokemon.generation}">
                <div class="item__id">${pokemon.id}</div>
                <div class='item__name'>${pokemon.name}</div>
                <div class='item__type'>${pokemon.type}</div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" class="item__img" loading="lazy">
            </div>`};
        
        for (const [codeName, pokemon] of Object.entries(this.app.pokemons)) {
            const item = document.createElement("div");
            item.innerHTML = pokemonCard(codeName, pokemon);
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

        this.app.hideLoader();
    }
    
}