export class CardBuilder {
    constructor(app) {
        this.app = app;
    }

    pattern(id, pokemon) {
        const { n, c } = pokemon;
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return `<div class="card loading"
        ${(typeof id && typeof id !== 'undefined') ? `data-id='${id}'` : ''}
        ${(typeof n && typeof n !== 'undefined') ? `data-name='${n}'` : ''}
        ${(typeof c && typeof c !== 'undefined') ? `data-catched='${c}'` : ''}
        >
        ${(typeof id && typeof id !== 'undefined') ? `<div class='card__id'>${id}</div>` : ''}
        ${(typeof n && typeof n !== 'undefined') ? `<div class='card__name'>${n}</div>` : ''}
        ${(typeof id && typeof id !== 'undefined') ? `<img class='card__image'><img src="${imageUrl}" class="item__img" alt="${n}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
</div>`;
    }
}