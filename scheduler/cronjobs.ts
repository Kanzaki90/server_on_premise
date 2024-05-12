import path from "path";
import Graceful from "@ladjs/graceful";
import Cabim from "cabin";
import Bree from "bree";

export const BreeLauncher = (): void => {
    console.info(` - ${new Date()} | Bree Has Been launched`);

    const _path = path.join(__dirname, "../", "jobs", "backupLauncher.ts");
    const bree = new Bree({
        logger: new Cabim(),
        root: path.join(__dirname, "../", "jobs"),
        timeout: false,
        jobs: [{
            name: "backupLauncher",
            cron: "* * * * *",
            path: _path
        }]
    });

    const graceful = new Graceful({brees: [bree]});
    graceful.listen()
    bree.start();
}