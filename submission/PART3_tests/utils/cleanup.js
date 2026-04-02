import fs from 'fs';
import path from 'path';

export const cleanupDirectories = () => {
    const directories = ['downloadfile', 'test-reports'];

    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);

        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`Deleted ${dir} directory`);
        } else {
            console.log(`${dir} directory does not exist, skipping deletion`);
        }
    });
};