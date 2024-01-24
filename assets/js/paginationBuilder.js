export class PaginationBuilder {
    constructor(app) {
        this.app = app;
        this.paginations = document.querySelectorAll('.pagination');
    }

    build() {

        const pagesNumber = Math.ceil(Object.keys(this.app.currentShown).length / this.app.appBuilder.showedPerPage);

        this.paginations.forEach(pagination => {

            pagination.replaceChildren();
            pagination.insertAdjacentHTML('afterbegin', this.pattern(pagesNumber));

            this.handleEvents(pagination);
        });
    }

    handleEvents(pagination) {
        pagination.querySelector('ul').addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) {
                this.app.appBuilder.currentPage = li.dataset.page;
                this.changeActiveLists(li);
                this.changeActiveSelects();
                this.app.appBuilder.updateList();
            }
            console.log(this.app.url.names.pageNum);

            this.app.url.setAndUpdate(this.app.url.names.pageNum, this.app.appBuilder.currentPage);
        });

        pagination.querySelector('select').addEventListener('change', (e) => {
            this.app.appBuilder.currentPage = e.target.value;
            this.changeActiveLists();
            this.changeActiveSelects(e.target);
            this.app.appBuilder.updateList();
            this.app.url.setAndUpdate(this.app.url.names.pageNum, this.app.appBuilder.currentPage);
        });
    }

    changeActiveLists(li) {
        this.paginations.forEach(pagination => {
            if (pagination.querySelector('ul') === li?.closest('ul')) {
                pagination.querySelector('.active').classList.remove('active');
                li.classList.add('active');
                return;
            };
            pagination.querySelector('.active').classList.remove('active');
            pagination.querySelector(`[data-page="${this.app.appBuilder.currentPage}"]`).classList.add('active');
        });
    }

    changeActiveSelects(select) {
        this.paginations.forEach(pagination => {
            if (pagination.querySelector('select') === select) return;
            pagination.querySelector('select').value = this.app.appBuilder.currentPage;
        });
    }

    pattern(pagesNumber = 1) {
        let li = '';
        let option = '';
        for (let i = 1; i <= pagesNumber; i++) {
            li += `<li class="${+this.app.appBuilder.currentPage === i ? 'active' : ''}" data-page="${i}">${i}</li>`;
            option += `<option value="${i}">${i}</option>`;
        }
        return `<ul>${li}</ul><select>${option}</select>`;
    }

}