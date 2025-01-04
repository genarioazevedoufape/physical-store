import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schema/store.schema';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
