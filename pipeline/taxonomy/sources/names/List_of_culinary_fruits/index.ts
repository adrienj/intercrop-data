import { parseSimpleTables } from '../../../lib/wikipediaParser';

const output = __dirname + '/output.csv';

export const main = async () => {
    return parseSimpleTables('List_of_culinary_fruits', output);
};