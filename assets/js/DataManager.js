import { DataBuilder } from './dataBuilder.js';
import { CatchedManager } from './CatchedManager.js';

export class DataManager {
    constructor(app) {
        this.app = app;

        this.dataBuilder = new DataBuilder(this.app);
        this.catchedManager = new CatchedManager(this.app);

        this.speciesNum;
        this.list = this.dataBuilder.list;
        this.types = this.dataBuilder.types;
        this.generations = this.dataBuilder.generations;

        this.catched = this.catchedManager.catched;

        this.details = this.app.storage.getSession(this.app.storage.names.details) || {};
    }

    async init() {

        this.speciesNum = await this.dataBuilder.getSpeciesNum();

        const isLocalList = !!this.list && !!this.types && !!this.generations[0];

        if (isLocalList && Object.keys(this.list).length === this.speciesNum) {
            console.log('Use local storage');
        } else {
            console.log('Get new pokemon data and save localy');
            // await this.dataManager.update();
            await this.dataBuilder.getList();
        }

        await this.catchedManager.mergeCatched();
    }
}