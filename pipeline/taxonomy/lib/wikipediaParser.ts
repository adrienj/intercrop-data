import { HTMLElement, parse } from 'node-html-parser';
import { decode } from 'html-entities';
import { query } from './query';
import { NameEntry } from './gbif';

export const getWikipediaPage = async (pageName: string) => {
    console.log(`Fetching Wikipedia page ${pageName}`);
    const response = await query(`https://en.wikipedia.org/w/api.php?action=parse&page=${pageName}&format=json`);
    return response.parse.text['*'] as string;
};

export const getTablesFromHTML = (html: string): HTMLElement[] => {
    const parsedHtml = parse(html);
    return parsedHtml.querySelectorAll('table');
};

export const getRowsFromAllTables = (tables: HTMLElement[]): Omit<NameEntry, 'source'>[] => {
    return tables.reduce(
        (rows, table) => [
            // flatten all tables into one
            ...rows,
            ...(table
                .querySelectorAll('tr') // get all rows in the table
                .slice(1) // skip the first row
                .map(row => {
                    const cols = row.querySelectorAll('td');
                    if (!cols.length) {
                        return null;
                    }

                    const [vernacular, latin] = cols
                        // eslint-disable-next-line no-irregular-whitespace
                        .map(col => decode(col.innerText.trim()).replace(/ /gm, ' ')) // for each column get only the text content
                        .slice(0, 2); // take only the first two columns

                    if (!vernacular || !latin) {
                        return null;
                    }

                    // first column is the article link
                    const wiki_link = (cols[0].querySelector('a') as unknown as HTMLAnchorElement)?.href;

                    return {
                        wiki_link,
                        vernacular,
                        latin,
                    };
                })
                .filter(Boolean) as any), // remove nulls
        ],
        [],
    );
};
