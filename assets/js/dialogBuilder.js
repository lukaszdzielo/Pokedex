export class DialogBuilder {
    constructor(app) {
        this.app = app;
        this.dialog;
        this.dialogWrapper;
    }

    open() {
        this.app.appBuilder.disableBodyScroll();
    }

    close() {
        this.dialog.close();
        this.app.appBuilder.enableBodyScroll();
    }

    pattern(id) {
        return `<dialog id="${id}">
        <header>
            <button id="dialog__close" class="btn close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" /></svg>
            </button>
        </header>
    </dialog>`;
    }
}

// class SettingsDialog extends DialogBuilder {
//     constructor() {
//     }
// }