import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schema/store.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { fetchAddressFromCep } from '../utils/fetchAddressFromCep.helper';
import { convertCepToCoordinates } from '../utils/convertCepToCoordinates.helper';
import { ViaCepResponse } from '../types/viaCep-response.interface';
import { Coordinates } from '../types/coordinates.interface';
import { calcularDistancia } from '../utils/calculateDistance.helper';
import { calcularFrete} from '../utils/calculateFreight.helper';
import { FreightOption } from '../types/freightOption.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class StoresService {
  constructor(@InjectModel(Store.name) private storeModel: Model<StoreDocument>) {}


  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    let address: ViaCepResponse | null = null;
    let coordinates: Coordinates | null = null;
  
    try {
      address = await fetchAddressFromCep(createStoreDto.postalCode);
    } catch (error) {
      console.warn(`Erro ao buscar endereço na API ViaCEP: ${error.message}`);
      throw new HttpException(
        'Erro ao buscar endereço na API ViaCEP',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    try {
      coordinates = await convertCepToCoordinates(createStoreDto.postalCode);
    } catch (error) {
      console.warn(`Erro ao converter CEP em coordenadas: ${error.message}`);
      throw new HttpException(
        'Erro ao converter CEP em coordenadas',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    function shippingTimeInDays(): number {
      const randomDays = Math.floor(Math.random() * 5) + 1;
      return randomDays;
    }
  
    const preparationTime = shippingTimeInDays();
  
    const storeData = {
      ...createStoreDto,
      address1: address?.logradouro || createStoreDto.address1,
      address2: address?.bairro,
      address3: address?.complemento,
      city: address?.localidade,
      state: address?.uf,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      shippingTimeInDays: preparationTime,
    };
  
    try {
      const newStore = new this.storeModel(storeData);
      return await newStore.save();
    } catch (error) {
      console.error(`Erro ao salvar a loja: ${error.message}`);
      throw new HttpException(
        'Erro ao salvar a loja',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async listAll(limit: number, offset: number): Promise<any> {
    try {
      const total = await this.storeModel.countDocuments().exec();
      const stores = await this.storeModel
        .find()
        .skip(offset)
        .limit(limit)
        .exec();
  
      return {
        stores: stores,
        limit: limit,
        offset: offset,
        total: total,
      };
    } catch (error) {
      console.error(`Erro ao listar lojas: ${error.message}`);
      throw new HttpException(
        'Erro ao listar lojas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async storeByCep(postalCode: string, limit = 10, offset = 0): Promise<any> {
    const cleanedPostalCode = postalCode.replace('-', '');
    
    function prazo(): number {
      const randomDays = Math.floor(Math.random() * 3) + 1;
      return randomDays;
    }
  
    const prazoEnvio = prazo();
    
    let userCoordinates: Coordinates | null = null;
    try {
      userCoordinates = await convertCepToCoordinates(cleanedPostalCode);
    } catch (error) {
      console.error(`Erro ao converter o CEP do usuário: ${error.message}`);
      throw new HttpException(
        'Erro ao converter o CEP do usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    let stores;
    try {
      stores = await this.storeModel.find({ type: { $in: ['LOJA', 'PDV'] } }).exec();
    } catch (error) {
      console.error(`Erro ao buscar lojas: ${error.message}`);
      throw new HttpException('Erro ao buscar lojas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    const storeDetails = [];
    const pins = [];
  
    for (const store of stores) {
      const storeCoordinates: Coordinates = {
        latitude: parseFloat(store.latitude.toString()),
        longitude: parseFloat(store.longitude.toString()),
      };
  
      const distance = calcularDistancia(userCoordinates, storeCoordinates);
  
      if (distance <= 50) {
        storeDetails.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: store.type,
          distance: `${distance.toFixed(2)} km`,
          value: [
            {
              prazo: prazoEnvio,
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
        });
  
        pins.push({
          position: {
            lat: storeCoordinates.latitude,
            lng: storeCoordinates.longitude,
          },
          title: store.storeName,
        });
      } else if (store.type === 'LOJA') {
        const cleanedStorePostalCode = store.postalCode.replace('-', '');
  
        let freightOptions: FreightOption[] = [];
        try {
          freightOptions = await calcularFrete({
            cepDestino: cleanedPostalCode,
            cepOrigem: cleanedStorePostalCode,
            comprimento: 20,
            largura: 15,
            altura: 10,
          });
        } catch (error) {
          console.error(`Erro ao calcular o frete para a loja ${store.storeName}: ${error.message}`);
        }
  
        storeDetails.push({
          name: store.storeName,
          city: store.city,
          postalCode: store.postalCode,
          type: 'LOJA',
          distance: `${distance.toFixed(2)} km`,
          value: freightOptions,
        });
  
        pins.push({
          position: {
            lat: storeCoordinates.latitude,
            lng: storeCoordinates.longitude,
          },
          title: store.storeName,
        });
      }
    }
  
    storeDetails.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  
    const paginatedStores = storeDetails.slice(offset, offset + limit);
  
    return {
      stores: paginatedStores,
      pins,
      limit,
      offset,
      total: storeDetails.length,
    };
  }
  
  async storeById(id: string): Promise<any> {
    let store;
    try {
      store = await this.storeModel.findById(id).exec();
    } catch (error) {
      console.error(`Erro ao buscar loja por ID: ${error.message}`);
      throw new HttpException('Erro ao buscar loja', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    if (!store) {
      throw new HttpException('Store não existe', HttpStatus.NOT_FOUND);
    }
  
    return {
      stores: [store],
      total: 1, 
    };
  }
  
  async storeByState(state: string, limit: number, offset: number): Promise<any> {
    let stores;
    try {
      stores = await this.storeModel.find({ state }).exec();
    } catch (error) {
      console.error(`Erro ao buscar lojas por estado: ${error.message}`);
      throw new HttpException('Erro ao buscar lojas por estado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    if (!stores || stores.length === 0) {
      throw new HttpException('Nenhuma loja encontrada para o estado informado', HttpStatus.NOT_FOUND);
    }
  
    const total = await this.storeModel.countDocuments().exec();
  
    return {
      stores: stores, 
      limit: limit,   
      offset: offset,  
      total: total,  
    };
  }

}
  
