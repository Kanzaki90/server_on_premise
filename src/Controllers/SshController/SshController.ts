import { SshConnector } from "../../sshConnection/Connector/SshConnector";
import express from "express";
import dotenv from "dotenv";

dotenv.config()

export type IConnectionConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
}

export class SshController {

    static async start(): Promise<void> {
        const REMOTE_DIR_LOCATION = process.env.REMOTE_DIR_LOCATION;
        const LOCAL_DIR_LOCATION = process.env.LOCAL_DIR_FOLDER;
        const connectionConfig: IConnectionConfig = {
            host: process.env.SSH_HOST,
            port: process.env.SSH_PORT as unknown as number,
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASS
        }
        const sshConnector = new SshConnector(connectionConfig, REMOTE_DIR_LOCATION, LOCAL_DIR_LOCATION);
        const checkForUpdates = await sshConnector.checkForUpdates();
        if (!checkForUpdates.isUpToDate) {
            await sshConnector.downloadNewFiles(checkForUpdates.filesInDirectories)
        }

    }

    static async testConnection(): Promise<void>{
        const REMOTE_DIR_LOCATION = process.env.REMOTE_DIR_LOCATION;
        const LOCAL_DIR_LOCATION = process.env.LOCAL_DIR_FOLDER;
        const connectionConfig: IConnectionConfig = {
            host: process.env.SSH_HOST,
            port: process.env.SSH_PORT as unknown as number,
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASS
        }
        const sshConnector = new SshConnector(connectionConfig, REMOTE_DIR_LOCATION, LOCAL_DIR_LOCATION);
        const conTest = await sshConnector.testConnection();
    }

}