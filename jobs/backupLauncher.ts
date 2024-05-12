import {SshController} from "../src/Controllers/SshController/SshController";
const lauchBackup = async () => {
    await SshController.start()
}

lauchBackup();