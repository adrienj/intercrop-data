import fs from 'fs';
import fetchListOfVegetables from './List_of_vegetables';
import fetchListOfCulinaryFruits from './List_of_culinary_fruits';
import fetchListOfCompanionPlants from './List_of_companion_plants';
import fetchListOfBeneficialWeeds from './List_of_beneficial_weeds';
import { NameEntry } from '../../lib/gbif';
import { getCacheData } from '../../lib/cache';

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const cachePath = __dirname + '/cache/index.json';

// Fetch all
export default async (disableCache = false): Promise<NameEntry[]> => {
    if (!disableCache) {
        const cache = getCacheData(cachePath);
        if (cache) {
            return cache;
        }
    }

    const data = [
        ...(await fetchListOfVegetables(disableCache)),
        ...(await fetchListOfCulinaryFruits(disableCache)),
        ...(await fetchListOfCompanionPlants(disableCache)),
        ...(await fetchListOfBeneficialWeeds(disableCache)),
        // TODO ...(await fetchListOfPestRepellingPlants(disableCache)),
        // TODO https://en.wikipedia.org/wiki/Beneficial_insect
    ];

    if (!disableCache) {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    }

    return data;
};
