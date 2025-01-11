import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: {
            storeByCep: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  describe('storeByCep', () => {
    it('deve retornar frete como Correios para lojas a mais de 50 km de distância', async () => {
      const mockStore = { 
        storeName: 'Loja Correios', 
        postalCode: '12345-678', 
        type: 'LOJA', 
        value: [{ description: 'Correios' }]
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [{ ...mockStore, distance: '51.00 km' }],
        limit: 10,
        offset: 0,
        total: 1,
      });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores[0].value[0].description).toBe('Correios');
      expect(result.stores[0].distance).toBe('51.00 km');
    });

    it('deve retornar frete como PDV para lojas a menos de 50 km de distância', async () => {
      const mockStore = { 
        storeName: 'Loja PDV', 
        postalCode: '12345-678', 
        type: 'PDV',
        value: [{ description: 'PDV' }] 
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [{ ...mockStore, distance: '49.00 km' }],
        limit: 10,
        offset: 0,
        total: 1,
      });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores[0].value[0].description).toBe('PDV');
      expect(result.stores[0].distance).toBe('49.00 km');
    });

    it('deve retornar lojas PDV como PDV para lojas a menos de 50 km de distância', async () => {
      const mockStore = { 
        storeName: 'PDV Loja', 
        postalCode: '12345-678', 
        type: 'PDV',
        value: [{ description: 'PDV' }] 
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [{ ...mockStore, distance: '49.00 km' }],
        limit: 10,
        offset: 0,
        total: 1,
      });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores[0].value[0].description).toBe('PDV');
      expect(result.stores[0].distance).toBe('49.00 km');
    });

    it('não deve retornar lojas a mais de 50 km de distância do usuário', async () => {
      const mockStore = { 
        storeName: 'Loja Distante', 
        postalCode: '12345-678', 
        type: 'PDV',
        value: [{ description: 'PDV' }] 
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [],
        limit: 10,
        offset: 0,
        total: 0,
      });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores.length).toBe(0);
    });
  });
});
