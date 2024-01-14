export class CatchedManager {
    constructor(app) {
        this.app = app;
        this.catched = this.app.storage.getLocal(this.app.storage.names.catched) || [];
    }

    mergeCatched() {
        this.catched.forEach(id => {
            if (!this.app.dataManager.list[id]) return;
            this.addToList(id);
            this.addToCard(id);
        });
    }

    add(id) {
        this.catched.push(id);
        this.sort();
        this.updateStorage();
        this.addToList(id);
        this.addToCard(id);
    }

    remove(id) {
        this.catched.splice(this.catched.indexOf(id), 1);
        this.sort();
        this.updateStorage();
        this.removeFromList(id);
        this.removeFromCard(id);
    }

    sort() {
        this.catched.sort((a, b) => a - b);
    }

    updateStorage() {
        this.app.storage.setLocal(this.app.storage.names.catched, this.catched);
    }

    removeStorage() {
        this.app.storage.removeLocal(this.app.storage.names.catched);
    }

    clearStorage() {
        this.catched.forEach(id => {
            this.removeFromList(id);
            this.removeFromCard(id);
        });
        this.catched = [];
        this.removeStorage();
    }

    clear() {
        this.catched.forEach(id => {
            if (!this.app.dataManager.list[id]) return;
            this.removeFromList(id);
            this.removeFromCard(id);
        });
    }

    addToList(id) {
        this.app.dataManager.list[id].c = true;
    }

    removeFromList(id) {
        if (this.app.dataManager.list[id]) delete this.app.dataManager.list[id].c;
    }

    addToCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        if (elem) elem.setAttribute("data-catched", true);
    }

    removeFromCard(id, card) {
        const elem = card ? card : this.app.appBuilder.appList.querySelector(`.card[data-id='${id}']`);
        if (elem) elem.removeAttribute("data-catched");
    }

    import(value) {
        const set = new Set(value.split(',').map(num => +num));
        if (set.has(null) || set.has(undefined) || set.has(NaN) || set.has(0)) {
            set.delete(null);
            set.delete(undefined);
            set.delete(NaN);
            set.delete(0);
        }
        this.clear();
        this.catched = [...set];
        this.sort();
        this.updateStorage();
        this.mergeCatched();
        return this.catched;
    }

    export() {
    }
}