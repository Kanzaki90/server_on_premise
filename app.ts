import express from 'express';
import cors from 'cors';
import servicecheck from "./service/servicecheck";
import home from "./service/home";
import {SshConnector} from "./src/sshConnection/Connector/SshConnector";
import {SshController} from "./src/Controllers/SshController/SshController";

class App {
    public express: express.Application;
    // private sshController: SshController;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(express.json());
        this.express.use(cors());
    }

    private routes(): void {
        this.express.get('/servicecheck', servicecheck);
        this.express.get('/', home);
        this.express.get('/get-test-file', SshController.getTestFile)
    }


}

export default new App().express