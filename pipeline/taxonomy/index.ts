import { program } from 'commander';
import getWikipediaNames from './sources/Wikipedia';
import getManualNames from './sources/manual';
import getGBIFDataset from './sources/GBIF';
import insertGBIFMetadata from './transforms/namesWithMetadata';
import { NameEntry } from './lib/gbif';

(async () => {
    program
        .description('Generate taxonomy data')
        .option('-d, --disable-cache', 'Disable cache')
        .action(async args => {
            // Names
            const wikipediaNames = await getWikipediaNames(args.disableCache);
            const manualNames = getManualNames();
            const mergedNames = mergeNames(wikipediaNames, manualNames);

            // GBIF dataset
            const gbifDataset = await getGBIFDataset(mergedNames, args.disableCache);

            // Enrich names
            const namesWithMetadata = await insertGBIFMetadata(mergedNames, gbifDataset, args.disableCache);

            // @todo Add tags
        });

    await program.parseAsync(process.argv);
})();

function mergeNames(wikipediaNames: NameEntry[], manualNames: NameEntry[]) {
    return uniqueBy([...wikipediaNames, ...manualNames], 'latin') as NameEntry[];
}

function uniqueBy(array, key) {
    return [...new Map(array.map(item => [item[key], item])).values()];
}
