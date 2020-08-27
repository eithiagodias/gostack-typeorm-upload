import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type?: 'income' | 'outcome';
  value: number;
  category: {
    title: string;
  };
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Transaction not allowed.', 400);
    }

    const categoriesRepository = getRepository(Category);
    let categoryDb = await categoriesRepository.findOne({
      where: { title: category.title },
    });

    if (!categoryDb) {
      categoryDb = await categoriesRepository.save(category);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryDb.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
