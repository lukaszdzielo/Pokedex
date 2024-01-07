export class PokemonCatchedManager {
    constructor(app) {
        this.app = app;
        this.setStorage();
    }

    add(id) {
        this.app.pokemonCatched.push(id);
        this.sort();
        this.setStorage();
        this.addToList(id);
        this.addToCard(id);
    }

    remove(id) {
        this.app.pokemonCatched.splice(this.app.pokemonCatched.indexOf(id), 1);
        this.sort();
        this.setStorage();
        this.removeFromList(id);
        this.removeFromCard(id);
    }

    sort() {
        this.app.pokemonCatched.sort((a, b) => a - b);
    }

    getStorage() {

    }

    setStorage() {
        this.app.storage.setLocal(this.app.storage.names.catched, this.app.pokemonCatched);
    }

    clearStorage() {

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