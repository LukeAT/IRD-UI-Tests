import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'

export default class Utils {

    static csvParameters(paramFile: string) {

        const records = parse(fs.readFileSync(path.join(__dirname, '../Data/Parameters/' + paramFile)), {
            columns: true,
            skip_empty_lines: true
        });

        return records
    }

}