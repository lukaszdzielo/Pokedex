export class CardBuilder {
    constructor(app) {
        this.app = app;
    }

    async get(id, pokemon) {
        const imgUrl = await this.getImgUrl(id, pokemon);
        return this.pattern(id, pokemon, imgUrl);
    }

    pattern(id, pokemon, imgUrl) {
        const { n, c } = pokemon;

        return `<div class="card loading"
        ${(typeof id && typeof id !== 'undefined') ? `data-id='${id}'` : ''}
        ${(typeof n && typeof n !== 'undefined') ? `data-name='${n}'` : ''}
        ${(typeof c && typeof c !== 'undefined') ? `data-catched='${c}'` : ''}
        >
        ${(typeof id && typeof id !== 'undefined') ? `<div class='card__id'>${id}</div>` : ''}
        ${(typeof n && typeof n !== 'undefined') ? `<div class='card__name'>${n}</div>` : ''}
        ${(typeof id && typeof id !== 'undefined') ? `<div class='card__image'><img src="${imgUrl}" class="item__img" alt="${n}" loading="lazy" onerror="this.onerror=null;this.src='./assets/0.png';"></div>` : ''}
</div>`;
    }

    async getImgUrl(id, pokemon) {
        if (pokemon.i === true) {
            return this.imgUrlDefault(id);
        } else if (pokemon.i === null) {
            return this.imgUrlPlaceholderDefault();
        } else {
            return this.checkUrl(id, pokemon);
        }
    }

    async checkUrl(id, pokemon) {
        const response = await fetch(this.imgUrlDefault(id));
        if (response.ok) {
            pokemon.i = true;
            return this.imgUrlDefault(id);
        } else {
            pokemon.i = null;
            return this.imgUrlPlaceholderDefault();
        }
    }

    imgUrlDefault(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }

    imgUrlPlaceholderDefault() {
        return `./assets/0.png`;
    }
}