import fs from 'fs';
import { main as getListOfVegetables } from './List_of_vegetables';
import { main as getListOfCulinaryFruits } from './List_of_culinary_fruits';
// import { main as getListOfCompanionPlants } from './List_of_companion_plants';
// import { main as getListOfBeneficialWeeds } from './List_of_beneficial_weeds';
// import { main as getListOfPestRepellingPlants } from './List_of_pest-repelling_plants';

import { convertListToCSV } from '../../lib/csv';

const output = __dirname + '/output.csv';

export const main = async () => {
    const names = [
        ...await getListOfVegetables(),
        ...await getListOfCulinaryFruits(),
        // ...await getListOfCompanionPlants(),
        // ...await getListOfBeneficialWeeds(),
        // ...await getListOfPestRepellingPlants(),
    ];

    const csv = convertListToCSV(names);
    fs.writeFileSync(output, csv);
};