import fs from 'fs';
import { GBIFData, getGBIFDataset, NameEntry } from '../../lib/gbif';
import { getCacheData } from '../../lib/cache';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const cachePath = __dirname + '/cache/gbif.json';

/**
 * Fetch GBIF metadadata for each entry, by its gbif_nubKey if defined, or search by latin name.
 * Then fetch more vernacular names for each entry.
 */
export default async (namesData: NameEntry[], disableCache = false): Promise<Record<string, GBIFData>> => {
    const cache = !disableCache ? getCacheData(cachePath) : undefined;

    const data = await getGBIFDataset(namesData, cache);

    if (!disableCache) {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    }

    return data;
};
