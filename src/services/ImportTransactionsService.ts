import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService, { Request } from './CreateTransactionService';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const transactionService = new CreateTransactionService();
    const data = await this.loadCSV(path);

    const promisses = [];

    data.map(async line => {
      const request = {
        title: line[0],
        type: line[1],
        value: line[2],
        category: { title: line[3] },
      };

      promisses.push(
        Promise.resolve(transactionService.execute(request as Request)),
      );
    });

    await fs.promises.unlink(path);

    return Promise.all(promisses);
  }

  async loadCSV(csvFilePath: string): Promise<string[]> {
    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
