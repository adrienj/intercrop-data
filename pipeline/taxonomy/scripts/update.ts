import fs from 'fs';
import { program } from 'commander';
import { convertCSVToList, convertListToCSV } from '../lib/csv';
import { insertGBIFColumns } from '../lib/gbif';

const namesSourcesPaths = [
    __dirname + '/../sources/names/List_of_vegetables/index.output',
    __dirname + '/../sources/names/List_of_culinary_fruits/index.output',
    __dirname + '/../sources/names/List_of_companion_plants/index.output',
    __dirname + '/../sources/names/List_of_beneficial_weeds/index.output',
    __dirname + '/../sources/names/List_of_pest-repelling_plants/index.output',
];

const gbifDatasetPath = './data/gbifData.json';
const taxonomyPath = './data/taxonomy.csv';

// Main function
async function enrichTaxonsWithMetadata() {
    let basicNames = namesSourcesPaths.map(path => convertCSVToList(fs.readFileSync(path).toString()));
    
    let gbifDataset = JSON.parse(fs.readFileSync(gbifDatasetPath).toString());

    basicNames = insertGBIFColumns(basicNames, gbifDataset);

    console.log('Saving data...');
    
    // Save csv in a file
    const csv = convertListToCSV(insertColumnNames(basicNames.map(getCSVRowData)));
    fs.writeFileSync(taxonomyPath, csv);
}


function insertColumnNames(rows) {
    return [
        ['type', 'wiki_link', 'wiki_latin', 'gbif_scientificName', 'gbif_vernacularNames_fra', 'gbif_vernacularNames_eng', 'gbif_nubKey'],
        ...rows
    ]
}
function getCSVRowData(row) {
    return [
        row.type, row.wiki_link, row.wiki_latin, row.gbif_scientificName, row.gbif_vernacularNames_fra, row.gbif_vernacularNames_eng, row.gbif_nubKey
    ]
}

(async () => {
    program
        .description('Generate taxonomy data')
        .action(async (args) => {
            await enrichTaxonsWithMetadata();
        });

  await program.parseAsync(process.argv);
})()