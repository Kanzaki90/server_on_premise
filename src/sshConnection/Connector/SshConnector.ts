import {ISshConnector} from "./ISshConnector";
import dotenv from "dotenv";
import sftp from "ssh2-sftp-client"
import {IConnectionConfig} from "../../Controllers/SshController/SshController";
import {arrayDifference, filesSorterByDirectory, getLocalFiles} from "../../utils/helperMethods";
import {HashTable} from "../../utils/HashMap";

dotenv.config()

export interface IFileDetails {
    directory: string;
    name: string;
}

export class SshConnector implements ISshConnector {

    constructor(readonly connectionConfig: IConnectionConfig, readonly remoteDirLocation: string, readonly localDirLocation: string) {
    }

    async checkForUpdates(): Promise<{ isUpToDate: boolean, filesInDirectories?: HashTable<string, string[]> }> {

        try {
            const remoteFilesAndDirecories: IFileDetails[] = await this.listAllFiles(this.remoteDirLocation);
            const localFiles = await getLocalFiles(this.localDirLocation);

            const {remoteFiles, hashMap} = filesSorterByDirectory(remoteFilesAndDirecories, localFiles)

            if (remoteFiles.length === 0) {
                console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | No Files at Remote`);
                return {isUpToDate: true};
            }

            const filesToCopy = arrayDifference(remoteFiles, localFiles);

            if (filesToCopy.length !== 0 || localFiles.length === 0) {
                console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | ${filesToCopy.length} New files discovered`);
                return {isUpToDate: false, filesInDirectories: hashMap};
            }


        } catch (e) {
            console.error(e)
            return {isUpToDate: false};
        }

    }

    async downloadNewFiles(directoriesAndFiles: HashTable<string, string[]>): Promise<boolean> {
        const sftpClient = new sftp();

        try {
            const sftpConn = await sftpClient.connect(this.connectionConfig);
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | SFTP Connected`);
            const directoriesArray = directoriesAndFiles.getAllKeys();
            for (const directoryIndex in directoriesArray) {
                const currentDir = directoriesArray[directoryIndex].slice(1, -1);
                console.log(currentDir)
                const rgx = `/${x}/g`;
                const test = str.replace(rgx, `${currentDir}`);
                console.log(test)
                const directoryFiles = directoriesAndFiles.get(currentDir);

                for (const fileIndex in directoryFiles) {
                    const file = directoryFiles[fileIndex];
                    const remoteFilePath = `${currentDir}/${file}`;
                    const localFilePath = `${this.localDirLocation}/${file}`;
                    const cp = await sftpClient.fastGet(remoteFilePath, localFilePath);
                    console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | ${cp}`);

                }
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            await sftpClient.end();
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | Disconnected from server`);
            return true
        }
    }

    private async listAllFiles(directory: string): Promise<IFileDetails[]> {
        const sftpClient = new sftp();
        try {
            await sftpClient.connect(this.connectionConfig);
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | Connected to server`);

            const files = await sftpClient.list(directory);
            const fileDetails: IFileDetails[] = [];

            for (const file of files) {
                if (file.type === '-') {
                    fileDetails.push({
                        directory: directory,
                        name: file.name
                    });
                } else if (file.type === 'd') {
                    const subDirectory = `${directory}/${file.name}`;
                    const subFiles = await this.listAllFiles(subDirectory);
                    fileDetails.push(...subFiles);
                }
            }

            return fileDetails;
        } catch (err) {
            console.error(err.message);
        } finally {
            await sftpClient.end();
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | Disconnected from server`);
        }
    }

    async testConnection() {
        const sftpClient = new sftp();
        try {
            await sftpClient.connect(this.connectionConfig);
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | testConnection`);
            const filesInfo = await sftpClient.list(this.remoteDirLocation);
            const files = filesInfo.map(o => o.name);
            console.log(JSON.stringify(`  -${new Date().toLocaleTimeString()} | ${JSON.stringify(files)}`))

        } catch (err) {
            console.error(err.message);
        } finally {
            await sftpClient.end();
            console.info(` - ${new Date().toLocaleDateString()}|${new Date().toLocaleTimeString()} | Disconnected from server`);
        }

    }


}