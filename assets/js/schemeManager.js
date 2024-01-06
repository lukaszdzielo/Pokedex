export class SchemeManager {
    constructor(app) {
        this.app = app;
        this.html = document.firstElementChild;
        this.switcher = document.querySelector('#themeSwitcher');
        this.scheme = this.getStorageScheme() || this.setStorageScheme(this.switcher.value);
        this.init();
    }

    init() {
        this.setScheme(this.scheme);
        this.switcher.value = this.scheme;

        this.switcher.addEventListener('change', e => {
            this.setScheme(e.target.value);
            this.setStorageScheme(e.target.value);
        });
    }

    getStorageScheme() {
        return this.app.storage.getLocal('AppScheme');
    }

    setStorageScheme(scheme) {
        this.app.storage.setLocal('AppScheme', scheme);
        return scheme;
    }

    setScheme(scheme) {
        console.log('asd');
        this.html.setAttribute('color-scheme', scheme);
    }
}