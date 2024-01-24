const names = {
    pageNum: 'page',
};

export class UrlManager {
    constructor(app) {
        this.app = app;
        this.names = { ...names };
        this.params = new URLSearchParams(location.search);
    }

    get(key) {
        return this.params.get(key);
    }

    set(key, value) {
        this.params.set(key, value);
        return value;
    }

    setAndUpdate(key, value) {
        this.params.set(key, value);
        this.updateUrl();
        return value;
    }

    setDefault() {
        history.replaceState(null, "", location.pathname + "?" + this.params.toString());
    }

    updateUrl() {
        history.pushState(null, "", location.pathname + "?" + this.params.toString());
    }

}