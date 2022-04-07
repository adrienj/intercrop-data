import fs from 'fs';
import fetch from 'node-fetch';
import { program } from 'commander';
import { getWikipediaPage } from '../lib/wikipediaParser';
import { convertCSVToList, convertListToCSV } from '../lib/csv';

const namesSourcesPaths = [
    __dirname + '/../sources/names/List_of_vegetables/index.csv',
    __dirname + '/../sources/names/List_of_culinary_fruits/index.csv',
    __dirname + '/../sources/names/List_of_companion_plants/index.csv',
    __dirname + '/../sources/names/List_of_beneficial_weeds/index.csv',
    __dirname + '/../sources/names/List_of_pest-repelling_plants/index.csv',
];

const gbifDatasetPath = './data/gbifData.json';
const taxonomyPath = './data/taxonomy.csv';

// Main function
async function enrichTaxonsWithMetadata() {
    let basicNames = namesSourcesPaths.map(path => convertCSVToList(fs.readFileSync(path).toString()));
    
    let gbifDataset;
    if (localGBIF) {
        gbifDataset = JSON.parse(await fs.readFileSync(gbifDatasetPath).toString());
    } else {
        console.log('Fetching full GBIF taxons...');
        gbifDataset = await getGBIFDataset(basicNames);
        
        // Save gbifData in a file
        fs.writeFileSync(gbifDatasetPath, JSON.stringify(gbifDataset, null, 2));
    }

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


// returns a Map<wiki_latin, GBIFData>
async function getGBIFDataset(rows) {
    const dataset = {};


    for (const index in rows) {
        const row = rows[index];
        let key = row.wiki_latin;

        process.stdout.write(`[${+index + 1}/${rows.length}][1/3] ${row.wiki_common} ; ${row.wiki_latin}`);
        let taxonData = await getGBIFTaxon(row.wiki_latin);
        
        // Try with the common name to get a taxon with a nubKey
        if (!taxonData?.nubKey) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`[${+index + 1}/${rows.length}][2/3] ${row.wiki_common} ; ${row.wiki_latin}`);
            let taxonData2 = await getGBIFTaxon(row.wiki_common);

            if (taxonData2?.nubKey) {
                key = row.wiki_common;
                taxonData = taxonData2;
            }
            // taxonData = taxons.results[0]; // Get the best result
        }

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`[${+index + 1}/${rows.length}][3/3] ${row.wiki_common} ; ${row.wiki_latin}`);
        const vernacularNames = await getGBIFVernacularNames(taxonData?.nubKey) as any;

        if (taxonData) {
            dataset[key] = {
                ...taxonData,
                vernacularNames: vernacularNames?.results
            };
        }
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
    }
    process.stdout.write("\n"); // end the line

    return dataset;
}

async function getGBIFTaxon(name) {
    // const searchResults = await fetch(`https://api.gbif.org/v1/species/search?q=${row.wiki_latin.replace(/[^\w\s]/mg, '')}&status=ACCEPTED&highertaxonKey=6&limit=3`);
    const searchResults = await fetch(`https://api.gbif.org/v1/species/search?advanced=false&dataset_key=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&facet=rank&facet=dataset_key&facet=constituent_key&facet=highertaxon_key&facet=name_type&facet=status&facet=issue&facet=origin&facetMultiselect=true&highertaxon_key=6&issue.facetLimit=100&locale=en&name_type.facetLimit=100&q=${name.replace(/[^\w\s]/mg, '')}&rank.facetLimit=100&status.facetLimit=100`);
    const taxons = await searchResults.json() as any;
    // Prefer taxons that have a nubKey to get the vernacular names
    return taxons.results.find(data => data.nubKey !== undefined) || taxons.results[0]; 
}


async function getGBIFVernacularNames(nubKey) {
    if (!nubKey) {
        return null;
    }
    
    const vernacularNamesResults = await fetch(`https://api.gbif.org/v1/species/${nubKey}/vernacularNames`);
    return await vernacularNamesResults.json();
}


function insertGBIFColumns(rows, gbifDataset) {
    return rows.map((row) => {
        const gbifData = gbifDataset[row.wiki_latin] || gbifDataset[row.wiki_common];
        if (!gbifData) {
            console.log(`Unknown taxon for "${row.wiki_common}" : ${row.wiki_latin}`);
        }

        return {
            ...row, 
            gbif_vernacularNames_fra: getVernacularNamesIn(gbifData?.vernacularNames, 'fra').join(';'),
            gbif_vernacularNames_eng: [row.wiki_common, ...getVernacularNamesIn(gbifData?.vernacularNames, 'eng')].join(';'), 
            gbif_scientificName: gbifData?.scientificName, 
            gbif_nubKey: gbifData?.nubKey
        };
    });
}
function getVernacularNamesIn(names, lang) {
    return names
        ?.filter(name => name.language === lang)
        .map(name => name.vernacularName.replace(/;/gm, '\;'))
        ?? [];
}


(async () => {
    program
        .description('Generate taxonomy data')
        .action(async (args) => {
            await enrichTaxonsWithMetadata();
        });

  await program.parseAsync(process.argv);
})()