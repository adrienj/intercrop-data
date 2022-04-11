import fs from 'fs';
import { getRowsFromAllTables, getTablesFromHTML, getWikipediaPage } from '../../lib/wikipediaParser';
import { NameEntry } from '../../lib/gbif';
import { getCacheData } from '../../lib/cache';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// https://en.wikipedia.org/wiki/List_of_companion_plants
const articleName = 'List_of_companion_plants';
const cachePath = __dirname + '/cache/' + articleName + '.json';

export default async (disableCache = false): Promise<NameEntry[]> => {
    if (!disableCache) {
        const cache = getCacheData(cachePath);
        if (cache) {
            return cache;
        }
    }

    // remove the last 2 tables of this page ("Further reading")
    const data = getRowsFromAllTables(getTablesFromHTML(await getWikipediaPage(articleName)).slice(0, -2)).map(row => ({
        source: articleName,
        ...row,
    }));

    if (!disableCache) {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    }

    return data;
};
