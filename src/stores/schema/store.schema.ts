import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true, default: () => `STORE-${Date.now()}` })
  storeID: string; 

  @Prop({ required: true })
  storeName: string;

  @Prop({ default: true })
  takeOutInStore: boolean; 
  
  @Prop({ required: true, min: 0 }) 
  shippingTimeInDays: number;

  @Prop({ required: true })
  latitude: string; 

  @Prop({ required: true })
  longitude: string;

  @Prop({ required: true })
  address1: string; 

  @Prop()
  address2: string;

  @Prop()
  address3: string;

  @Prop({ required: true })
  city: string; 
  
  @Prop()
  district: string; 

  @Prop({ required: true })
  state: string; 

  @Prop({ required: true, enum: ['PDV', 'LOJA'] }) 
  type: string;

  @Prop({ default: 'BR' })
  country: string;

  @Prop({ required: true, match: /^[0-9]{5}-[0-9]{3}$/ }) 
  postalCode: string;

  @Prop({ match: /^[0-9]{10,11}$/ }) 
  telephoneNumber: string;

  @Prop({ match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }) 
  emailAddress: string;

}

export const StoreSchema = SchemaFactory.createForClass(Store);
