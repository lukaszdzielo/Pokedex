export class PokemonCatchedManager {
    constructor(app) {
        this.app = app;
        this.updateStorage();
    }

    add(id) {
        console.log('add()');
        this.app.pokemonCatched.push(id);
        this.sort();
        this.updateStorage();
        this.updateList(id, 1);
        this.updateCard(id);
    }

    remove(id) {
        console.log('remove()');
        this.app.pokemonCatched.splice(this.app.pokemonCatched.indexOf(id), 1);
        this.sort();
        this.updateStorage();
        this.updateList(id, 0);
        this.updateCard(id);
    }

    sort() {
        this.app.pokemonCatched.sort((a, b) => a - b);
    }

    updateStorage() {
        this.app.storage.setLocal(this.app.storage.names.catched, this.app.pokemonCatched);
    }

    updateList(id, addRemove) {
        console.log('updateList()', id, addRemove);
        this.app.pokemonList[id].c = 1;
        console.log(this.app.pokemonList[id]);
    }

    updateCard(id) {
        // console.log('updateCard()', id);
    }
}