import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BitGo } from 'bitgo';
import { bitgoConfig } from './bitgo.config';
import { Wallet } from './wallet.entity';

@Injectable()
export class BitgoService {
  private bitgo: BitGo;

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {
    this.bitgo = new BitGo({
      env: bitgoConfig.env as any,
      accessToken: bitgoConfig.accessToken,
    });
  }

  getBitgoInstance() {
    return this.bitgo;
  }

  async createWallet(label: string, passphrase: string, coin: string = 'tbtc') {
    const enterprise = await this.getEnterprises();
    const wallet = await this.bitgo.coin(coin).wallets().generateWallet({
      label,
      passphrase,
      enterprise: enterprise,
    });
    const entity = this.walletRepository.create({
      bitgoId: wallet.wallet.id(),
      label,
      coin,
    });
    await this.walletRepository.save(entity);
    return wallet;
  }

  async createAddress(walletId: string, coin: string = 'tbtc') {
    const wallet = await this.bitgo.coin(coin).wallets().get({ id: walletId });
    const address = await wallet.createAddress();
    return address;
  }

  async getWalletBalance(walletId: string, coin: string = 'tbtc') {
    const wallet = await this.bitgo.coin(coin).wallets().get({ id: walletId });
    const balance = wallet.balance();
    const spendableBalance = wallet.spendableBalanceString();
    return {
      balance,
      spendableBalance,
    };
  }

  async getWalletById(walletId: string, coin: string = 'tbtc') {
    const wallet = await this.bitgo.coin(coin).wallets().get({ id: walletId });
    return wallet;
  }

  async sendToAddress(
    walletId: string,
    address: string,
    amount: number,
    passphrase: string,
    coin: string = 'tbtc',
  ) {
    const wallet = await this.bitgo.coin(coin).wallets().get({ id: walletId });
    const tx = await wallet.send({
      address,
      amount,
      walletPassphrase: passphrase,
    });
    return tx;
  }

  async listWallets() {
    return this.walletRepository.find();
  }

  async getEnterprises() {
    const list = await this.bitgo.listAccessTokens();
    for (const token of list) {
      if (token?.enterprise) {
        return token.enterprise;
      }
    }
    return null;
  }
}
