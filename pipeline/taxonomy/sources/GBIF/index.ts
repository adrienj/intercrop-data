// Fetch GBIF data from taxon names
// Store result in output.json
import fs from 'fs';
import { getGBIFDataset } from '../../lib/gbif';

const output = __dirname + '/output.json';

export const main = async (namesPath = '../names/output.csv') => {
    console.log('Fetching full GBIF taxons...');
    const gbifDataset = await getGBIFDataset(require(namesPath));

    // Save gbifData in a file
    fs.writeFileSync(output, JSON.stringify(gbifDataset, null, 2));
};