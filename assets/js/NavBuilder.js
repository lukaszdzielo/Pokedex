import { DialogBuilder } from './dialogBuilder.js';

export class NavBuilder {
    constructor(app) {
        this.app = app;

        this.nav = document.querySelector('nav');
        this.navDialog = this.nav.querySelector('#dialogSettings');

        this.settingsBtn = this.nav.querySelector('#settingsBtn');
        this.closeBtn = this.navDialog.querySelector('#closeSettings');

        this.eventHolder();
    }

    eventHolder() {
        this.settingsModalEvents();
        this.resetCatched();
        this.resetApp();
        this.import();
        this.export();
    }

    settingsModalEvents() {
        this.settingsBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.navDialog.close());
    }

    open() {
        this.updateExport(this.app.pokemonCatched);
        this.navDialog.showModal();
    }

    resetCatched() {
        this.navDialog.querySelector('#clearCatched').addEventListener('click', () => {
            this.app.catchedManager.clearStorage();
            this.resetExportInput;
        });
    }

    resetApp() {
        this.navDialog.querySelector('#clearApp').addEventListener('click', () => {
            this.app.catchedManager.clearStorage();
            this.resetExportInput;
        });
    }

    resetExportInput() {
        this.navDialog.querySelector('#exportExport').value = '';

    }

    import() {
        const input = this.navDialog.querySelector('#importInput');
        this.navDialog.querySelector('#importBtn').addEventListener('click', () => {
            this.updateExport(this.app.catchedManager.import(input.value.trim()));
            input.value = '';
        });
    }

    export() {
        const input = this.navDialog.querySelector('#exportExport');
        // input.value = this.app.pokemonCatched.toString();
        // navigator.clipboard.writeText(text)
    }

    updateExport(test) {
        this.navDialog.querySelector('#exportExport').value = test;
    }
}