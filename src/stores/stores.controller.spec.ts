import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { HttpStatus, HttpException } from '@nestjs/common';

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
            create: jest.fn(),
            listAll: jest.fn(),
            storeByCep: jest.fn(),
            storeById: jest.fn(),
            storeByState: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  describe('create', () => {
    it('deve criar uma loja com sucesso', async () => {
      const createStoreDto = { 
        storeName: 'Loja Teste', 
        postalCode: '12345-678', 
        type: 'LOJA',
        address1: '123 Rua' 
      };
      const mockStore = { ...createStoreDto, id: '1' };

      service.create = jest.fn().mockResolvedValue(mockStore);

      const result = await controller.create(createStoreDto);

      expect(result).toEqual(mockStore);
      expect(service.create).toHaveBeenCalledWith(createStoreDto);
    });

    it('deve lançar um erro se a criação falhar', async () => {
      const createStoreDto = { 
        storeName: 'Loja Teste', 
        postalCode: '12345-678', 
        type: 'LOJA',
        address1: '123 Rua' 
      };

      service.create = jest.fn().mockRejectedValue(new HttpException('Erro', HttpStatus.BAD_REQUEST));

      try {
        await controller.create(createStoreDto);
      } catch (error) {
        expect(error.response).toBe('Erro');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('listAll', () => {
    it('deve retornar uma lista de lojas', async () => {
      const mockStores = [{ storeName: 'Loja 1' }, { storeName: 'Loja 2' }];
      service.listAll = jest.fn().mockResolvedValue({ stores: mockStores, limit: 10, offset: 0, total: 2 });

      const result = await controller.listAll();

      expect(result.stores).toEqual(mockStores);
      expect(service.listAll).toHaveBeenCalled();
    });

    it('deve lançar um erro se listAll falhar', async () => {
      service.listAll = jest.fn().mockRejectedValue(new HttpException('Erro ao listar lojas', HttpStatus.INTERNAL_SERVER_ERROR));
    
      try {
        await controller.listAll();
      } catch (error) {
        expect(error.response).toBe('Erro ao listar lojas');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('storeByCep', () => {
    it('deve retornar lojas por código postal', async () => {
      const mockStores = [{ storeName: 'Loja 1', postalCode: '12345-678' }];
      service.storeByCep = jest.fn().mockResolvedValue({ stores: mockStores, limit: 10, offset: 0, total: 1 });

      const result = await controller.storeByCep('12345-678');

      expect(result.stores).toEqual(mockStores);
      expect(service.storeByCep).toHaveBeenCalledWith('12345-678', 10, 0);
    });

    it('deve lançar um erro se storeByCep falhar', async () => {
      service.storeByCep = jest.fn().mockRejectedValue(new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR));

      try {
        await controller.storeByCep('12345-678');
      } catch (error) {
        expect(error.response).toBe('Erro');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
