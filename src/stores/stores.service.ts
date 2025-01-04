import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schema/store.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { fetchAddressFromCep } from '../utils/fetchAddressFromCep.helper';
import { convertCepToCoordinates } from '../utils/convertCepToCoordinates.helper';
import { ViaCepResponse } from '../types/viaCep-response.interface';
import { Coordinates } from '../types/coordinates.interface';


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
  
    // Verifique os dados antes de criar a loja
    // console.log('Address:', address);
    // console.log('Coordinates:', coordinates);
  
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

  async findByCep(postalCode: string): Promise<Store[]> {
    return this.storeModel.find({ postalCode }).exec();
  }

  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }

  async findByState(state: string): Promise<Store[]> {
    return this.storeModel.find({ state }).exec();
  }
}
