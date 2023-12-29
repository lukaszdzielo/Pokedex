export class CardBuilder {
    constructor(app) {
        this.app = app;
    }

    pattern(codeName, pokemon) {
        const { id } = pokemon;
        let name = pokemon.name;
        if (!name) name = `${codeName.charAt(0).toUpperCase()}${codeName.slice(1)}`;


        const imageLink = "https://example.com/image.png";

        // Sprawdź, czy link istnieje.
        // try {
        //     fetch(imageLink);
        // } catch (error) {
        //     // Link nie istnieje. Ustaw domyślne zdjęcie.
        //     const defaultImage = "test";
        //     console.log("Ustawiono domyślne zdjęcie: " + defaultImage);
        // }

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