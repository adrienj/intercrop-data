import fs from 'fs';
import {
    GBIFDataset,
    GBIFMetadata,
    getVernacularNamesByLanguage,
    NameEntry,
    NameEntryWithMetadata,
} from '../../lib/gbif';
import { getCacheData } from '../../lib/cache';

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const cachePath = __dirname + '/cache/index.json';

export default async (
    names: NameEntry[],
    gbifDataset: GBIFDataset,
    disableCache = false,
): Promise<NameEntryWithMetadata[]> => {
    if (!disableCache) {
        const cache = getCacheData(cachePath);
        if (cache) {
            return cache;
        }
    }

    const data = insertMetadata(names, gbifDataset);

    if (!disableCache) {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    }

    return data;
};

export const getGBIFMetadataByName = (gbifDataset: GBIFDataset, vernacular: string, latin: string): GBIFMetadata => {
    const gbifData = gbifDataset[latin] || gbifDataset[vernacular];
    if (!gbifData) {
        console.log(`Unknown taxon for "${vernacular}" : ${latin}`);

        return {
            gbif_vernacularNames_fra: [],
            gbif_vernacularNames_eng: [vernacular],
            gbif_scientificName: undefined,
            gbif_nubKey: undefined,
        };
    }

    return {
        gbif_vernacularNames_fra: gbifData.vernacularNames
            ? getVernacularNamesByLanguage(gbifData.vernacularNames, 'fra')
            : [],
        gbif_vernacularNames_eng: [
            vernacular,
            ...(gbifData.vernacularNames ? getVernacularNamesByLanguage(gbifData.vernacularNames, 'eng') : []),
        ],
        gbif_scientificName: gbifData.scientificName,
        gbif_nubKey: String(gbifData.nubKey),
    };
};

export const insertMetadata = (rows: NameEntry[], gbifDataset: GBIFDataset): NameEntryWithMetadata[] => {
    return rows.map((row): NameEntryWithMetadata => {
        const metadata = getGBIFMetadataByName(gbifDataset, row.vernacular, row.latin);

        return {
            ...row,
            ...metadata,
        };
    });
};
