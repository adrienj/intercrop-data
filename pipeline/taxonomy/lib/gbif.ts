/**
 * ******************************************************************************
 * Copyright Innov'ATM all rights reserved. This software is the property of
 * Innov'ATM and may not be used in any manner except under a license agreement
 * signed with Innov'ATM.
 * *******************************************************************************
 */




// returns a Map<wiki_latin, GBIFData>
export const getGBIFDataset = async (rows) => {
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

export const getGBIFTaxon = async (name) => {
    // const searchResults = await fetch(`https://api.gbif.org/v1/species/search?q=${row.wiki_latin.replace(/[^\w\s]/mg, '')}&status=ACCEPTED&highertaxonKey=6&limit=3`);
    const searchResults = await fetch(`https://api.gbif.org/v1/species/search?advanced=false&dataset_key=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&facet=rank&facet=dataset_key&facet=constituent_key&facet=highertaxon_key&facet=name_type&facet=status&facet=issue&facet=origin&facetMultiselect=true&highertaxon_key=6&issue.facetLimit=100&locale=en&name_type.facetLimit=100&q=${name.replace(/[^\w\s]/mg, '')}&rank.facetLimit=100&status.facetLimit=100`);
    const taxons = await searchResults.json() as any;
    // Prefer taxons that have a nubKey to get the vernacular names
    return taxons.results.find(data => data.nubKey !== undefined) || taxons.results[0]; 
}


export const getGBIFVernacularNames = async (nubKey) => {
    if (!nubKey) {
        return null;
    }
    
    const vernacularNamesResults = await fetch(`https://api.gbif.org/v1/species/${nubKey}/vernacularNames`);
    return await vernacularNamesResults.json();
}


export const insertGBIFColumns = (rows, gbifDataset) => {
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
export const getVernacularNamesIn = (names, lang) => {
    return names
        ?.filter(name => name.language === lang)
        .map(name => name.vernacularName.replace(/;/gm, '\;'))
        ?? [];
}

