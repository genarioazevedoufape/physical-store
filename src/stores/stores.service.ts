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

  async findAll(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async findByCep(postalCode: string): Promise<{ storeName: string; distance: string; address: string }[]> {

    const userCoordinates: Coordinates = await convertCepToCoordinates(postalCode);
  
    const stores = await this.storeModel.find({ type: { $in: ['LOJA', 'PDV'] } }).exec();
  
    const nearbyStores = stores
      .map((store) => {
        const storeCoordinates: Coordinates = {
          latitude: parseFloat(store.latitude.toString()),
          longitude: parseFloat(store.longitude.toString()),
        };
  
        const distance = calcularDistancia(userCoordinates, storeCoordinates);
  
        if (distance <= 50) {
          return {
            storeName: store.storeName,
            address: `${store.address1}, ${store.city}, ${store.state}, ${store.postalCode}`,
            distance: `${distance.toFixed(2)} km`,
          };
        }
        return null;
      })
      .filter(Boolean) 
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); 

    return nearbyStores;
  }  

  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
}
