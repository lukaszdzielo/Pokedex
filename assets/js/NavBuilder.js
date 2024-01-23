// import { DialogBuilder } from './dialogBuilder.js';

export class NavBuilder {
    constructor(app) {
        this.app = app;

        this.nav = document.querySelector('nav');
        this.dialog = this.nav.querySelector('#dialogSettings');

        this.settingsBtn = this.nav.querySelector('#settingsBtn');
        this.closeBtn = this.dialog.querySelector('#closeSettings');

        this.eventHolder();
    }

    eventHolder() {
        this.settingsBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
        this.import();
        this.export();
        this.resetDatabase();
        this.resetCatched();
        this.resetApp();
    }

    open() {
        this.updateExport(this.app.dataManager.catched);
        this.app.appBuilder.disableBodyScroll();
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
        this.app.appBuilder.enableBodyScroll();
    }

    resetDatabase() {
        this.dialog.querySelector('#clearDatabase').addEventListener('click', () => {
            this.app.dataManager.removeStorage();
            window.location.reload();
        });
    }

    resetCatched() {
        this.dialog.querySelector('#clearCatched').addEventListener('click', () => {
            this.app.dataManager.catchedManager.clearStorage();
            this.resetExportInput();
        });
    }

    resetApp() {
        this.dialog.querySelector('#clearApp').addEventListener('click', () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        });
    }

    resetExportInput() {
        this.dialog.querySelector('#exportInput').value = '';
    }

    import() {
        const input = this.dialog.querySelector('#importInput');
        this.dialog.querySelector('#importBtn').addEventListener('click', () => {
            this.updateExport(this.app.dataManager.catchedManager.import(input.value.trim()));
            input.value = '';
        });
    }

    export() {
        this.dialog.querySelector('#exportBtn').addEventListener('click', () => {

            this.dialog.querySelector('#exportInput').select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                alert('Testing code was copied ' + msg);
            } catch (err) {
                alert('Oops, unable to copy');
            }

            window.getSelection().removeAllRanges();
        });
    }

    updateExport(listAsString) {
        this.dialog.querySelector('#exportInput').value = listAsString;
    }
}