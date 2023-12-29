export class AppCardBuilder {
    constructor(app) {
        this.app = app;
        this.item;
    }

    init(codeName, pokemon) {
        const item = document.createElement("div");
        item.classList.add('card', 'loading');

        // this.pattern(item, codeName, pokemon);
        this.eventLoading(item);

        return item;
    }

    pattern(item, codeName, pokemon) {
        let types = '';
        pokemon.type.forEach(type => {
            type = this.app.pokemonTypes[type];
            types += `<div class="${type}">${type}</div>`;
        });

        const data = `
            <div class='card__id'>${pokemon.id}</div>
            <div class='card__name'>
                ${pokemon.name ? pokemon.name : codeName.charAt(0).toUpperCase() + codeName.slice(1)}
            </div>
            <div class='card__types'>${types}</div>
        `;
        // <div class='card__image'><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" class="item__img" loading="lazy"></div>

        item.innerHTML = data;
    }

    eventLoading(item) {
        // item.querySelector('.card__image img').addEventListener("load", () => {
        //     setTimeout(() => {
        //         item.classList.remove("loading");
        //     }, 400);
        // });
    }
}