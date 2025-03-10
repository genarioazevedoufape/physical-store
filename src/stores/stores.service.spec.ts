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
        city: 'Cidade',
        postalCode: '12345-678',
        distance: '51.00 km',
        type: 'LOJA',
        value: [{ description: 'Correios' }],
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [mockStore],
        limit: 10,
        offset: 0,
        total: 1,
      });
    
      const result = await controller.storeByCep('12345-678');
    
      expect(result.stores[0].value[0].description).toBe('Correios');
      expect(result.stores[0].distance).toBe('51.00 km');
      expect(service.storeByCep).toHaveBeenCalledWith('12345-678', 10, 0);
    });
    it('deve retornar frete como PDV para lojas a menos de 50 km de distância', async () => {
      const mockStore = {
        storeName: 'Loja PDV',
        city: 'Cidade',
        postalCode: '12345-678',
        distance: '49.00 km',
        type: 'PDV',
        value: [{ description: 'PDV' }],
      };
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [mockStore],
        limit: 10,
        offset: 0,
        total: 1,
      });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores[0].value[0].description).toBe('PDV');
      expect(result.stores[0].distance).toBe('49.00 km');
    });

    it('não deve retornar PDV a mais de 50 km de distância do usuário', async () => {
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [],
        limit: 10,
        offset: 0,
        total: 0,
      });
    
      const result = await controller.storeByCep('12345-678');
    
      expect(result.stores.length).toBe(0);
      expect(service.storeByCep).toHaveBeenCalledWith('12345-678', 10, 0);
    });

    it('deve retornar frete como PDV para lojas a menos de 50 km de distância', async () => {
      const mockStore = {
        storeName: 'Loja',
        city: 'Cidade',
        postalCode: '12345-678',
        distance: '49.00 km',
        type: 'LOJA',
        value: [{ description: 'LOJA' }],
      };
    
      service.storeByCep = jest.fn().mockResolvedValue({
        stores: [mockStore],
        limit: 10,
        offset: 0,
        total: 1,
      });
    
      const result = await controller.storeByCep('12345-678');
    
      expect(result.stores[0].value[0].description).toBe('LOJA');
      expect(result.stores[0].distance).toBe('49.00 km');
      expect(service.storeByCep).toHaveBeenCalledWith('12345-678', 10, 0);
    });
    
  });
});
