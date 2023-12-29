export class CardBuilder {
    constructor(app) {
        this.app = app;
    }

    pattern(codeName, pokemon) {
        const { id } = pokemon;
        const name = pokemon.name ? pokemon.name : `${codeName.charAt(0).toUpperCase()}${codeName.slice(1)}`;
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return `<div class="card loading">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='card__id'>${id}</div>` : ''}
        ${(typeof name && typeof name !== 'undefined') ? `<div class='card__name'>${name}</div>` : ''}
        ${(typeof id && typeof id !== 'undefined') ? `<img class='card__image'><img src="${imageUrl}" class="item__img" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
</div>`;
    }

    eventLoading(item) {
        // item.querySelector('.card__image img').addEventListener("load", () => {
        //     setTimeout(() => {
        //         item.classList.remove("loading");
        //     }, 400);
        // });
    }
}