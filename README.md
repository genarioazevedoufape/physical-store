# Projeto: API de Cálculo de Frete de uma Physical-Store

## Descrição
Este projeto é uma API desenvolvida utilizando o framework **NestJS** com o objetivo de gerenciar informações de lojas. A API fornece endpoints para criar, listar, buscar por estado, buscar as Lojas e/ou PDV mais próximo, calculando o valor do frete. Além disso, a API possui documentação gerada automaticamente utilizando **Swagger**.

## Tecnologias Utilizadas
- **Node.js**
- **NestJS**
- **TypeScript**
- **Swagger** para documentação
- **Class Validator** para validação de dados
- **MongoDB** como banco de dados

## Funcionalidades
- **Criação de lojas:**
  - Endpoint para criar uma loja com informações como nome, endereço, tipo, e outros detalhes.
- **Listagem de lojas:**
  - Listagem de todas as lojas com suporte a paginação.
- **Busca por estado:**
  - Retorna lojas localizadas em um estado específico.
- **Busca por CEP:**
  - Retorna lojas próximas a um CEP informado com o valor do frete.
- **Detalhes de uma loja:**
  - Consulta informações detalhadas de uma loja por ID.

## Requisitos
- Node.js >= 18
- MongoDB >= 5.0

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/genarioazevedoufape/physical-store.git
   ```

2. Entre no diretório do projeto:
   ```bash
   cd repositorio
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/lojas
   DISTANCEMATRIX_BASE_URL:https://api.distancematrix.ai/maps/api/geocode/json
   DISTANCEMATRIX_API_KEY=""
   ```

## Executando o Projeto
1. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

2. Acesse a documentação Swagger em:
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Estrutura do Projeto
```plaintext
src/
├── stores/
│   ├── dto/
│   │   └── create-store.dto.ts
│   ├── schema/
│   │   └── stores.controller.spec.ts
│   ├── stores.controller.ts
│   ├── stores.module.ts
│   ├── stores.service.ts
│   ├── stores.service.spec.ts
├── types/
│   ├── coordinates.interface.ts
│   ├── freightOption.interface.ts
│   ├── index.ts
│   ├── viaCep-response.interface.ts
├── utils/
│   ├── calculateDistance.helper.ts
│   ├── calculateFreight.helper.ts
│   ├── convertCepToCoordinates.helper.ts
│   ├── fetchAddressFromCep.helper.ts
├── app.module.ts
├── main.ts
test/
├── app.e2e-spec.ts
├── jest-e2e.json
README.md

```

## Endpoints Disponíveis
### POST /stores
Cria uma nova loja.
- **Body:**
  ```json
  {
    "storeName": "Minha Loja",
    "address1": "Rua Exemplo, 123",
    "type": "LOJA",
    "postalCode": "12345-678"
  }
  ```

### GET /stores
Lista todas as lojas (paginação disponível).

### GET /stores/state/:state
Busca lojas por estado.
- **Exemplo:** `/stores/state/SP`

### GET /stores/cep/:postalCode
Busca lojas próximas a um CEP.
- **Exemplo:** `/stores/cep/12345-678`

### GET /stores/:id
Retorna detalhes de uma loja por ID.

## API externas
**ViaCep:** [https://viacep.com.br](https://viacep.com.br)
**DistanceMatrix:** [https://distancematrix.ai/distance-matrix-api](https://distancematrix.ai/distance-matrix-api/maps/api/geocode/json)
**Correios:** [https://www.correios.com.br/@@precosEPrazosView](https://www.correios.com.br/@@precosEPrazosView)

## Documentação Swagger
A documentação completa da API está disponível em:

## Testes
Para rodar os testes, execute:
```bash
npm run test
```

## Contribuição
Sinta-se à vontade para abrir issues e pull requests no repositório para sugerir melhorias ou correções.

