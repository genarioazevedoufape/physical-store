import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto'; 

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  async listAll() {
    return await this.storesService.listAll(10, 1);
  }

  @Get('state/:state') 
  async storeByState(
    @Param('state') state: string,         
    @Query('limit') limit: number = 10,    
    @Query('offset') offset: number = 0  
  ) {
    return this.storesService.storeByState(state, limit, offset);  
  }

  @Get('cep/:postalCode')
  async storeByCep(
    @Param('postalCode') postalCode: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.storesService.storeByCep(postalCode, limit, offset);
  }
  
  @Get(':id')
  async storeById(
    @Param('id') id: string,         
    @Query('limit') limit: number = 10,    
    @Query('offset') offset: number = 0  
  ) {
    return this.storesService.storeById(id, limit, offset);  
  }
}

