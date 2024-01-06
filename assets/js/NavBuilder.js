export class NavBuilder {
    constructor(app) {
        this.app = app;

        this.nav = document.querySelector('nav');
        this.navDialog = this.nav.querySelector('#dialogSettings');

        this.settingsBtn = this.nav.querySelector('#settingsBtn');
        this.closeBtn = this.navDialog.querySelector('#closeSettings');

        this.buildNav();
    }

    buildNav() {

        // this.navDialog.showModal();

        this.settingsBtn.addEventListener('click', () => {
            this.navDialog.showModal();
        });
        this.closeBtn.addEventListener('click', () => {
            this.navDialog.close();
        });
    }
}