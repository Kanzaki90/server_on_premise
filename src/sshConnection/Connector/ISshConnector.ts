import {HashTable} from "../../utils/HashMap";

export interface ISshConnector {

    checkForUpdates(): Promise<{ isUpToDate: boolean, directoriesAndFiles?: HashTable<string, string[]> }>;

    downloadNewFiles(directoriesAndFiles: HashTable<string, string[]>): Promise<boolean>;

}