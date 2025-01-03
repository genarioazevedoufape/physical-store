import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/physical-store'),
    StoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
