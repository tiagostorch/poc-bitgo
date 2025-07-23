import { Module } from '@nestjs/common';
import { BitgoService } from './bitgo.service';
import { BitgoController } from './bitgo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bitgo-poc.sqlite',
      entities: [Wallet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Wallet]),
  ],
  controllers: [BitgoController],
  providers: [BitgoService],
})
export class AppModule {}
