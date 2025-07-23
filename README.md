# BitGo POC – API de Integração

## Visão Geral

Esta POC demonstra a integração de uma API NestJS com o BitGo para:
- Criação e gestão de carteiras digitais (wallets)
- Consulta de saldo e geração de endereços
- Envio de transações em Bitcoin (testnet)
- Armazenamento local de informações de carteiras

> **Atenção:** Esta POC utiliza o ambiente de testes do BitGo (`tbtc`). Não utilize para valores reais.

---

## Como rodar o projeto

```bash
npm install
npm run start:dev
```

Acesse a documentação Swagger em: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Principais Endpoints

### Criar Wallet
- **POST** `/wallets`
- **Body:**
  ```json
  {
    "label": "Nome da carteira",
    "passphrase": "senha forte",
    "coin": "tbtc" // opcional
  }
  ```
- **Descrição:** Cria uma nova carteira BitGo e armazena no banco local.

---

### Gerar Endereço de Depósito
- **POST** `/wallets/:id/address`
- **Body:**
  ```json
  {
    "coin": "tbtc" // opcional
  }
  ```
- **Descrição:** Gera um novo endereço de depósito para a carteira informada.

---

### Consultar Saldo
- **GET** `/wallets/:id/balance`
- **Descrição:** Retorna o saldo da carteira em satoshi e o saldo disponível para gastar (`spendableBalance`).

  **Exemplo de resposta:**
  ```json
  {
    "balance": "5900",
    "spendableBalance": "5900"
  }
  ```

> **Importante:** O saldo é retornado em satoshi (1 BTC = 100.000.000 satoshi). Sempre verifique o campo `spendableBalance` antes de tentar enviar.

---

### Enviar Criptomoeda
- **POST** `/wallets/:id/send`
- **Body:**
  ```json
  {
    "address": "endereco_destino",
    "amount": 1000, // em satoshi!
    "passphrase": "senha da carteira",
    "coin": "tbtc" // opcional
  }
  ```
- **Descrição:** Envia o valor especificado para o endereço informado. O valor deve ser em satoshi e o saldo disponível deve ser suficiente para cobrir o valor + taxa de rede.

---

### Listar Wallets
- **GET** `/wallets`
- **Descrição:** Lista todas as wallets criadas e armazenadas no banco local.

---

### Buscar Wallet por ID
- **GET** `/wallets/:id`
- **Descrição:** Retorna os dados da wallet pelo ID.

---

### Buscar Enterprise
- **GET** `/wallets/enterprise`
- **Descrição:** Retorna o enterprise associado ao token BitGo.

---

## Observações Técnicas

- **Unidade de Valor:** Todos os valores de saldo e envio são em **satoshi**. 1 BTC = 100.000.000 satoshi.
- **Taxas de Rede:** O BitGo cobra taxa de rede em todas as transações. O saldo disponível (`spendableBalance`) já considera as taxas e o que realmente pode ser enviado.
- **Erros Comuns:**
  - `insufficient funds`: ocorre quando tenta enviar mais do que o saldo disponível (incluindo taxas).
  - Sempre consulte `/balance` antes de enviar.
- **Ambiente:** O projeto está configurado para usar o ambiente `test` do BitGo (`tbtc`).

---

## Fluxo Sugerido

1. Criar uma wallet
2. Gerar um endereço de depósito
3. Depositar fundos (testnet faucet)
4. Consultar saldo
5. Enviar para outro endereço

---

## Referências
- [BitGo API Docs](https://app.bitgo.com/docs/)
- [NestJS Docs](https://docs.nestjs.com/)
