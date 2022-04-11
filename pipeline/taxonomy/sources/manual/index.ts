import fs from 'fs';
import { convertCSVToList } from '../../lib/csv';
import { NameEntry } from '../../lib/gbif';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const sourcePath = __dirname + '/index.csv';

// Return parsed csv
export default (): NameEntry[] => {
    return convertCSVToList(fs.readFileSync(sourcePath).toString())
        .slice(1) // remove column names
        .map(
            (row): NameEntry => ({
                source: 'manual',
                gbif_nubKey: row[0],
                latin: row[1],
                vernacular: row[2],
            }),
        );
};
