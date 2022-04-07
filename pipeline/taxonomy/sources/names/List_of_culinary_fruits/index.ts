import { parseSimpleTables } from '../../lib/wikipediaParser';

const output = __dirname + '/index.csv';

export const main = async () => {
    parseSimpleTables('List_of_culinary_fruits', output);
};