import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoresModule } from './stores/stores.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/physical-store'),
    StoresModule,     
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
