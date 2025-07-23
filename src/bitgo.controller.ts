import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { BitgoService } from './bitgo.service';

@ApiTags('BitGo')
@Controller('wallets')
export class BitgoController {
  constructor(private readonly bitgoService: BitgoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova wallet' })
  @ApiBody({
    schema: {
      properties: {
        label: { type: 'string' },
        passphrase: { type: 'string' },
        coin: { type: 'string', default: 'tbtc' },
      },
    },
  })
  async createWallet(
    @Body() body: { label: string; passphrase: string; coin?: string },
  ) {
    return this.bitgoService.createWallet(
      body.label,
      body.passphrase,
      body.coin || 'tbtc',
    );
  }

  @Post(':id/address')
  @ApiOperation({ summary: 'Gerar endereço de depósito para a wallet' })
  @ApiParam({ name: 'id', description: 'ID da wallet' })
  @ApiBody({
    schema: { properties: { coin: { type: 'string', default: 'tbtc' } } },
  })
  async createAddress(
    @Param('id') id: string,
    @Body() body: { coin?: string },
  ) {
    return this.bitgoService.createAddress(id, body.coin || 'tbtc');
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as wallets criadas' })
  async listWallets() {
    return this.bitgoService.listWallets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar wallet por ID' })
  @ApiParam({ name: 'id', description: 'ID da wallet' })
  async getWalletById(@Param('id') id: string) {
    return this.bitgoService.getWalletById(id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Consultar saldo da wallet' })
  @ApiParam({ name: 'id', description: 'ID da wallet' })
  async getBalance(@Param('id') id: string) {
    const balance = await this.bitgoService.getWalletBalance(id);
    return balance;
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Enviar cripto para outro endereço' })
  @ApiParam({ name: 'id', description: 'ID da wallet' })
  @ApiBody({
    schema: {
      properties: {
        address: { type: 'string' },
        amount: { type: 'number' },
        passphrase: { type: 'string' },
        coin: { type: 'string', default: 'tbtc' },
      },
    },
  })
  async sendToAddress(
    @Param('id') id: string,
    @Body()
    body: {
      address: string;
      amount: number;
      passphrase: string;
      coin?: string;
    },
  ) {
    return this.bitgoService.sendToAddress(
      id,
      body.address,
      body.amount,
      body.passphrase,
      body.coin || 'tbtc',
    );
  }

  @Get('/enterprise')
  @ApiOperation({ summary: 'Buscar enterprises do usuário autenticado' })
  async getEnterprises() {
    const enterprise = await this.bitgoService.getEnterprises();
    return { enterprise };
  }
}
