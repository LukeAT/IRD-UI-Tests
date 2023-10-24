import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export function csvParameters<T>(paramFile: string): Array<T> {
  const file = path.join(__dirname, '../../Data/Parameters', paramFile);
  const content = fs.readFileSync(file);

  const records = parse(content, { columns: true, skip_empty_lines: true });

  return records as Array<T>;
}

