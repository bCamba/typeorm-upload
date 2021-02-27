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
    const defaultValue = 0;
    const transactions = await this.find();

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .map(transaction => Number(transaction.value))
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        defaultValue,
      );

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(transaction => Number(transaction.value))
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        defaultValue,
      );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
