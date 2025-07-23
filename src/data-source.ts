import { DataSource } from 'typeorm';
import { Wallet } from './wallet.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'bitgo-poc.sqlite',
  entities: [Wallet],
  synchronize: true,
});
