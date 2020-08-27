import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((ac, transaction) => {
      const value = Number(transaction.value);
      return transaction.type === 'income' ? ac + value : ac;
    }, 0);

    const outcome = transactions.reduce((ac, transaction) => {
      const value = Number(transaction.value);
      return transaction.type === 'outcome' ? ac + value : ac;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
