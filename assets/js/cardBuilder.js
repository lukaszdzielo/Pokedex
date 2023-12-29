export class CardBuilder {
    constructor(app) {
        this.app = app;
    }

    pattern(codeName, pokemon) {
        const { id } = pokemon;
        let name = pokemon.name;
        if (!name) name = `${codeName.charAt(0).toUpperCase()}${codeName.slice(1)}`;

        return `<div class="card loading">
        ${(typeof id && typeof id !== 'undefined') ? `<div class='card__id'>${id}</div>` : ''}
        ${(typeof name && typeof name !== 'undefined') ? `<div class='card__name'>${name}</div>` : ''}
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