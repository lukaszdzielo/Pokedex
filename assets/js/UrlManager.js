const names = {
    pageNum: 'p',
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
        this.update();
        return value;
    }

    setDefault() {
        this.removeUnknown();
        history.replaceState(null, "", location.pathname + "?" + this.params.toString());
    }

    update() {
        history.pushState(null, "", location.pathname + "?" + this.params.toString());
    }

    removeUnknown() {
        this.params.forEach((value, key) => {
            if (!Object.values(this.names).includes(key)) this.params.delete(key);
        });
    }

}