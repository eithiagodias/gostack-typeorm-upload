import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const trasactionRepository = getRepository(Transaction);
    await trasactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
