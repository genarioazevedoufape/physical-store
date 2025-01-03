import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schema/store.schema';

@Injectable()
export class StoresService {
  constructor(@InjectModel(Store.name) private storeModel: Model<StoreDocument>) {}

  async create(store: Partial<Store>): Promise<Store> {
    const newStore = new this.storeModel(store);
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
