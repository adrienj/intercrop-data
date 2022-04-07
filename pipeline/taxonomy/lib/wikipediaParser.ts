
import fs from 'fs';
import { parse } from 'node-html-parser';
import { decode } from 'html-entities';
import { convertListToCSV } from './csv';


export const getWikipediaPage = async (pageName: string) => {
    const listOfVegetablesRawSource = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${pageName}&format=json`);
    const listOfVegetablesSource = await listOfVegetablesRawSource.json() as any;
    return listOfVegetablesSource.parse.text['*'];
}


// returns a list of [common, latin] name pairs
export const getRowsFromAllTables = (html: string) => {
    const parsedHtml = parse(html);
    const tables = parsedHtml.querySelectorAll('table');
    
    return tables.reduce((rows, table) => ([ // flatten all tables into one
        ...rows,
        ...table
            .querySelectorAll('tr') // get all rows in the table
            .slice(1) // skip the first row
            .map(row => {
                const cols = row.querySelectorAll('td');

                const [wiki_common, wiki_latin] = cols
                    .map(col => decode(col.innerText.trim()).replace(/ /gm, ' ')) // for each column get only the text content
                    .slice(0, 2); // take only the first two columns

                // first column is the article link
                const wiki_link = (cols[0].querySelector('a') as unknown as HTMLAnchorElement)?.href;

                return {
                    wiki_link,
                    wiki_common,
                    wiki_latin,
                }
            })
    ]), []);
}


export const parseSimpleTables = async (articleName: string, outputPath: string) => {
    console.log('Fetching from Wikipedia...');
    const data = getRowsFromAllTables(await getWikipediaPage(articleName)); // https://en.wikipedia.org/wiki/{articleName}
    const species = data.map(row => [row.wiki_common, row.wiki_latin]);
    
    console.log('Saving file...');
    fs.writeFileSync(outputPath, convertListToCSV(species));

    return species;
};