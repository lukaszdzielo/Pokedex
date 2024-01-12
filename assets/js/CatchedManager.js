export class CatchedManager {
    constructor(app) {
        this.app = app;
    }

    mergeCatched() {
        this.app.pokemonCatched.forEach(id => {
            if (!this.app.pokemonList[id]) return;
            this.addToList(id);
            this.addToCard(id);
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

    removeStorage() {
        this.app.storage.removeLocal(this.app.storage.names.catched);
    }

    clearStorage() {
        this.app.pokemonCatched.forEach(id => {
            this.removeFromList(id);
            this.removeFromCard(id);
        });
        this.app.pokemonCatched = [];
        this.removeStorage();
    }

    clear() {
        this.app.pokemonCatched.forEach(id => {
            if (!this.app.pokemonList[id]) return;
            this.removeFromList(id);
            this.removeFromCard(id);
        });
    }

    addToList(id) {
        this.app.pokemonList[id].c = 1;
    }

    removeFromList(id) {
        if (this.app.pokemonList[id]) delete this.app.pokemonList[id].c;
    }

    addToCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        if (elem) elem.setAttribute("data-catched", 1);
    }

    removeFromCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        if (elem) elem.removeAttribute("data-catched");
    }

    import(value) {
        this.clear();
        this.app.pokemonCatched = value.split(',').map(num => +num);
        this.sort();
        this.updateStorage();
        this.mergeCatched();
        return this.app.pokemonCatched;
    }

    export() {
    }
}