import { query } from './query';

export interface VernacularNamesResult {
    vernacularName: string;
    language: string;
}

export interface GBIFData {
    key?: number;
    nubKey?: number;
    nameKey?: number;
    taxonID?: string;
    sourceTaxonKey?: number;
    kingdom?: string;
    phylum?: string;
    order?: string;
    family?: string;
    genus?: string;
    species?: string;
    kingdomKey?: number;
    phylumKey?: number;
    classKey?: number;
    orderKey?: number;
    familyKey?: number;
    genusKey?: number;
    speciesKey?: number;
    datasetKey?: string;
    constituentKey?: string;
    parentKey?: number;
    parent?: string;
    basionymKey?: number;
    basionym?: string;
    scientificName?: string;
    canonicalName?: string;
    vernacularName?: string;
    authorship?: string;
    nameType?: string;
    rank?: string;
    origin?: string;
    taxonomicStatus?: string;
    nomenclaturalStatus?: string[];
    remarks?: string;
    publishedIn?: string;
    numDescendants?: number;
    lastCrawled?: string;
    lastInterpreted?: string;
    issues?: any[];
    synonym?: boolean;
    class?: string;
    vernacularNames?: VernacularNamesResult[];
}

export interface GBIFMetadata {
    gbif_vernacularNames_fra: string[];
    gbif_vernacularNames_eng: string[];
    gbif_scientificName?: string;
    gbif_nubKey?: string;
}

export type GBIFDataset = Record<string, GBIFData>;

export interface NameEntry {
    source: string;
    gbif_nubKey?: string;
    wiki_link?: string;
    latin: string;
    vernacular: string;
}

export type NameEntryWithMetadata = NameEntry & GBIFMetadata;

export const findByName = async (name: string) => {
    const taxons = await query(
        `https://api.gbif.org/v1/species/search?advanced=false&dataset_key=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&facet=rank&facet=dataset_key&facet=constituent_key&facet=highertaxon_key&facet=name_type&facet=status&facet=issue&facet=origin&facetMultiselect=true&highertaxon_key=6&issue.facetLimit=100&locale=en&name_type.facetLimit=100&q=${name.replace(
            /[^\w\s]/gm,
            '',
        )}&rank.facetLimit=100&status.facetLimit=100`,
    );
    // Prefer taxons that have a nubKey to get the vernacular names
    return taxons.results.find(data => data.nubKey !== undefined) || taxons.results[0];
};

export const findByNubKey = async (nubKey: string) => {
    return await query(`https://api.gbif.org/v1/species/${nubKey}`);
};

export const getGBIFVernacularNames = async (nubKey: string): Promise<{ results: VernacularNamesResult } | null> => {
    return await query(`https://api.gbif.org/v1/species/${nubKey}/vernacularNames`);
};

export const getVernacularNamesByLanguage = (names: VernacularNamesResult[], lang: string): string[] => {
    return names.filter(name => name.language === lang).map(name => name.vernacularName.replace(/;/gm, ';'));
};

export const getGBIFDataset = async (rows: NameEntry[], cache?: GBIFDataset): Promise<GBIFDataset> => {
    const dataset: GBIFDataset = cache || {};

    for (const index in rows) {
        const row = rows[index];
        let key = row.latin;

        if (dataset?.[key]) {
            continue;
        }

        process.stdout.write(`[${+index + 1}/${rows.length}][1/3] ${row.vernacular} ; ${row.latin}`);

        let taxonData: any;
        if (row.gbif_nubKey) {
            taxonData = await findByNubKey(row.gbif_nubKey);
        } else {
            taxonData = await findByName(row.latin);
        }

        // Try with the common name to get a taxon with a nubKey
        if (!taxonData?.nubKey) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`[${+index + 1}/${rows.length}][2/3] ${row.vernacular} ; ${row.latin}`);
            const taxonData2 = await findByName(row.vernacular);

            if (taxonData2?.nubKey) {
                key = row.vernacular;
                taxonData = taxonData2;
            }
            // taxonData = taxons.results[0]; // Get the best result
        }

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`[${+index + 1}/${rows.length}][3/3] ${row.vernacular} ; ${row.latin}`);
        const vernacularNames = taxonData?.nubKey && (await getGBIFVernacularNames(taxonData?.nubKey));

        if (taxonData) {
            dataset[key] = {
                ...taxonData,
                vernacularNames: vernacularNames?.results,
            };
        }
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
    }
    process.stdout.write('\n'); // end the line

    return dataset;
};
