export class PokemonCatchedManager {
    constructor(app) {
        this.app = app;
    }

    mergeWithList() {
        this.app.pokemonCatched.forEach(id => {
            if (!this.app.pokemonList[id]) return;
            this.addToList(id);
        });
    }

    add(id) {
        this.app.pokemonCatched.push(id);
        this.sort();
        this.updateStorage();
        this.addToList(id);
        this.addToCard(id);
    }

    remove(id) {
        this.app.pokemonCatched.splice(this.app.pokemonCatched.indexOf(id), 1);
        this.sort();
        this.updateStorage();
        this.removeFromList(id);
        this.removeFromCard(id);
    }

    sort() {
        this.app.pokemonCatched.sort((a, b) => a - b);
    }

    updateStorage() {
        this.app.storage.setLocal(this.app.storage.names.catched, this.app.pokemonCatched);
    }

    clearStorage() {
        this.app.pokemonCatched.forEach(id => {
            this.removeFromList(id);
            this.removeFromCard(id);
        });
        this.app.pokemonCatched = [];
        this.updateStorage();
    }

    addToList(id) {
        this.app.pokemonList[id].c = 1;
    }

    removeFromList(id) {
        delete this.app.pokemonList[id].c;
    }

    addToCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        elem.setAttribute("data-catched", 1);
    }

    removeFromCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        elem.removeAttribute("data-catched");
    }
}