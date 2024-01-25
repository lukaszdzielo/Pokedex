import { AppBuilder } from './appBuilder.js';
import { UrlManager } from './UrlManager.js';
import { DataManager } from './DataManager.js';
import { StorageManager } from './StorageManager.js';

const config = {
    baseUrl: 'https://pokeapi.co/api/v2/',
    limit: 'limit=999999999999999',
    dev: {
        on: false,
        urls: ['http://localhost', 'https://localhost', 'http://192.168', 'http://127.0.0.1'],
        list: [1, 2, 5, 6, 7, 8, 9, 83, 123, 710, 902, 1020, 1024, 1025, 1026, 1027],
    },
    version: 0.2,
};

export class Pokedex {
    constructor() {
        this.app = document.querySelector('#app');
        this.options = { ...config };
        this.isDev = this.isDev();

        this.linksAPI = {};

        this.storage = new StorageManager(this);
        this.url = new UrlManager(this);
        this.appBuilder = new AppBuilder(this);

        if (!location.search.includes('?')) this.url.setDefault();

        this.dataManager = new DataManager(this);

        this.init();
    };

    async init() {
        await this.getAppUrls();
        await this.dataManager.init();

        this.currentShown = (this.options.dev.on && this.isDev) ? await this.devLimiter() : this.dataManager.list;

        this.appBuilder.getCurrentPage();

        await this.appBuilder.updateList();

        this.appBuilder.pagination.build();

        this.localStorageSize();
    }

    async fetchAPI(fetchUrl) {
        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error(`Http error: ${res.status}`);
            const json = await res.json();
            return json;

        } catch (error) {
            console.error(error);
        }
    }

    async getAppUrls() {
        this.linksAPI = await this.fetchAPI(this.options.baseUrl).then(res => res);
    }

    isDev() {
        return (this.options.dev.urls.some((url) => window.location.href.startsWith(url)));
    }

    devLimiter() {
        return Object.keys(this.dataManager.list).reduce((acc, id) => {
            if (this.options.dev.list.includes(+id)) acc[id] = this.dataManager.list[+id];
            return acc;
        }, {});
    }

    localStorageSize() {
        const keys = Object.keys(localStorage);
        let size = 0;
        keys.forEach(key => size += key.length + localStorage.getItem(key).length);
        console.log(`localStorage: ${(size / 1024).toFixed(2)} kb`);
    };
}

globalThis.Pokedex = new Pokedex();