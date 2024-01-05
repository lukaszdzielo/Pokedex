export class SchemeManager {
    constructor(app) {
        this.app = app;

        this.init();
    }

    init() {
        console.log(' - SchemeManager - ');

        const switcher = document.querySelector('#theme-switcher');

        switcher.addEventListener('input', e => setTheme(e.target.value));

        const setTheme = theme => document.firstElementChild.setAttribute('color-scheme', theme);
    }
}