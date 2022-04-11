import fs from 'fs';

export const getCacheData = (path: string) => {
    try {
        return JSON.parse(fs.readFileSync(path).toString());
    } catch (e) {
        return null;
    }
};
