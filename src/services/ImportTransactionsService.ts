import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const transactionService = new CreateTransactionService();
    const data = await this.loadCSV(path);

    const promisses: Array<Promise<Transaction>> = [];
    data.map(async line => {
      // eslint-disable-next-line radix
      const value = Number.parseInt(line[2]);
      const request = {
        title: line[0] as string,
        type: line[1] as 'income' | 'outcome',
        value,
        category: { title: line[3] as string },
      };

      const promisse = Promise.resolve(transactionService.execute(request));
      promisses.push(promisse as Promise<Transaction>);
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

    const lines: Array<string> = [];

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
