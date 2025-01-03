import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: true })
  storeID: string;

  @Prop({ required: true })
  storeName: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;

  @Prop()
  state: string;

  @Prop({ required: true, enum: ['PDV', 'LOJA'] })
  type: string;

  @Prop()
  postalCode: string;

  @Prop()
  shippingTimeInDays: number;

  @Prop()
  address1: string;

  @Prop()
  address2: string;

  @Prop()
  telephoneNumber: string;

  @Prop()
  emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
