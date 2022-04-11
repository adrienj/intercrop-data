export const convertListToCSV = (rows: string[][]) => {
    return rows.map(row => '"' + row.join('", "') + '"').join('\n');
};
export const convertCSVToList = (text: string) => {
    return text.split('\n').map(line => line.slice(1, -1).split('", "'));
};
