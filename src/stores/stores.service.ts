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
  
  async findByCep(postalCode: string): Promise<any[]> {
    const cleanedPostalCode = postalCode.replace('-', '');
    
    let userCoordinates: Coordinates | null = null;
    try {
      userCoordinates = await convertCepToCoordinates(cleanedPostalCode);
    } catch (error) {
      console.error(`Erro ao converter o CEP do usuário: ${error.message}`);
      return [];
    }
  
    const stores = await this.storeModel.find({ type: { $in: ['LOJA', 'PDV'] } }).exec();
    
    const storeDetails = await Promise.all(
      stores.map(async (store) => {
        const storeCoordinates: Coordinates = {
          latitude: parseFloat(store.latitude.toString()),
          longitude: parseFloat(store.longitude.toString()),
        };
    
        const distance = calcularDistancia(userCoordinates, storeCoordinates);
    
        if (distance <= 50) {
          return {
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
          };
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
    
          return {
            name: store.storeName,
            city: store.city,
            postalCode: store.postalCode,
            type: 'LOJA',
            distance: `${distance.toFixed(2)} km`,
            value: freightOptions,
          };
        }
    
        return null;
      })
    );
    
    return storeDetails.filter(Boolean).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }
  
  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }

  async pinsStoresByCep(postalCode: string, limit: number, offset: number): Promise<any> {
    const cleanedPostalCode = postalCode.replace('-', '');
    const userCoordinates: Coordinates = await convertCepToCoordinates(cleanedPostalCode);
    const total = await this.storeModel.countDocuments({ type: { $in: ['LOJA', 'PDV'] } }).exec();

    const stores = await this.storeModel
      .find({ type: { $in: ['LOJA', 'PDV'] } })
      .skip(offset)
      .limit(limit)
      .exec();        
  
    const storeDetails = await Promise.all(
      stores.map(async (store) => {
        const storeCoordinates: Coordinates = {
          latitude: parseFloat(store.latitude.toString()),
          longitude: parseFloat(store.longitude.toString()),
        };
  
        const distance = calcularDistancia(userCoordinates, storeCoordinates);
  
        if (distance <= 50) {
          return {
            name: store.storeName,
            city: store.city,
            postalCode: store.postalCode,
            type: store.type,
            distance: `${distance.toFixed(2)} km`,
            pin: {
              position: {
                lat: storeCoordinates.latitude,
                lng: storeCoordinates.longitude,
              },
              title: store.storeName,
            },
          };
        }
  
        return null;
      })
    );
  
    const filteredStores = storeDetails.filter(Boolean);
  
    return {
      stores: filteredStores,
      pins: filteredStores.map(store => store.pin), 
      limit,
      offset,
      total,
    };
  }
  
}
