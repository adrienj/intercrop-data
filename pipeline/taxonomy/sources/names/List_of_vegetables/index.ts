import { parseSimpleTables } from '../../../lib/wikipediaParser';

const output = __dirname + '/index.output';

export const main = async () => {
    return parseSimpleTables('List_of_vegetables', output);
};