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
  async findAll() {
    return await this.storesService.findAll(10, 1);
  }

  @Get('state/:state') 
  async findByState(@Param('state') state: string) {
    return this.storesService.findByState(state);
  }

  @Get('cep/:postalCode')
  async findByCep(
    @Param('postalCode') postalCode: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.storesService.findByCep(postalCode, limit, offset);
  }
  

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.storesService.findById(id);
  }
}

