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
    }
  
    try {
      coordinates = await convertCepToCoordinates(createStoreDto.postalCode);
    } catch (error) {
      console.warn(`Erro ao converter CEP em coordenadas: ${error.message}`);
    }
  
    const storeData = {
      ...createStoreDto,
      address1: address?.logradouro || createStoreDto.address1,
      address2: address?.bairro || createStoreDto.address2,
      address3: address?.complemento || createStoreDto.address3,
      city: address?.localidade || createStoreDto.city,
      state: address?.uf || createStoreDto.state,
      latitude: coordinates?.latitude || createStoreDto.latitude,
      longitude: coordinates?.longitude || createStoreDto.longitude,
    };
  
    const newStore = new this.storeModel(storeData);
    return newStore.save();
  }  

  async findAll(limit: number, offset: number): Promise<any> {
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
  }
  
  async findByCep(postalCode: string, limit = 10, offset = 0): Promise<any> {
    const cleanedPostalCode = postalCode.replace('-', '');
  
    let userCoordinates: Coordinates | null = null;
    try {
      userCoordinates = await convertCepToCoordinates(cleanedPostalCode);
    } catch (error) {
      console.error(`Erro ao converter o CEP do usuário: ${error.message}`);
      return { stores: [], pins: [], limit, offset, total: 0 };
    }
  
    const stores = await this.storeModel.find({ type: { $in: ['LOJA', 'PDV'] } }).exec();
  
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
              prazo: '1 dia útil',
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
  
  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
  
}
