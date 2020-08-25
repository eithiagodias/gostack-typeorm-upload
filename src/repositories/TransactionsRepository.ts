import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();

    const income = transactions.reduce((ac, transaction) => {
      return transaction.type === 'income' ? ac + transaction.value : ac;
    }, 0);

    const outcome = transactions.reduce((ac, transaction) => {
      return transaction.type === 'outcome' ? ac + transaction.value : ac;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
