import fs from "fs";
import {IFileDetails} from "../sshConnection/Connector/SshConnector";
import {HashTable} from "./HashMap";

type Directory = string;
type Files = string;

export const arrayDifference = (array1: string[], array2: string[]): string[] => {
    return array1.reduce((acc, val) => {
        if (!array2.includes(val)) {
            acc.push(val);
        }
        return acc;
    }, []);
};


export const filesSorterByDirectory = (remoteFilesAndDirecories: IFileDetails[], localFiles: string[]): {
    remoteFiles: string[],
    hashMap: HashTable<string, string[]>
} => {
    const remoteFiles: string[] = [];
    const hashMap = new HashTable<Directory, Files[]>();

    for (const index in remoteFilesAndDirecories) {
        const fileName = remoteFilesAndDirecories[index].name;
        if (localFiles.includes(fileName)) {
            continue;
        }
        // const parsedDir = remoteFilesAndDirecories[index].directory.replaceAll("/", "|");
        // const dirFileName = `${parsedDir}_${fileName}`;
        // remoteFiles.push(dirFileName);
        remoteFiles.push(fileName);

        const dir = remoteFilesAndDirecories[index].directory;
        const dirExists = hashMap.get(dir);
        (dirExists) ? dirExists.push(fileName) : hashMap.addSet(dir, [fileName])


    }

    return {remoteFiles, hashMap}


}

export const getLocalFiles = async (fileFolder: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        try {
            const filesInCurrentFolder: string[] = [];
            fs.readdirSync(fileFolder).forEach(file => {
                filesInCurrentFolder.push(file);
            });
            resolve(filesInCurrentFolder);
        } catch (e) {
            console.error(` - ${new Date().toLocaleTimeString()} | getLocalFiles exception ${JSON.stringify(e)}`
            );
            reject([])
        }
    })
}