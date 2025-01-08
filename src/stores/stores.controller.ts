import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto'; 
import { PinsByCepDto } from './dto/pinsByCep.dto';

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
    return await this.storesService.findAll(10, 0);
  }

  @Get('pins-by-cep')
  async pinsStoresByCep(@Query() query: PinsByCepDto) {
    return this.storesService.pinsStoresByCep(query.cep, query.limit, query.offset);
 }

  @Get('state/:state') 
  async findByState(@Param('state') state: string) {
    return this.storesService.findByState(state);
  }

  @Get('cep/:postalCode') 
  async findByCep(@Param('postalCode') postalCode: string) {
    return this.storesService.findByCep(postalCode);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.storesService.findById(id);
  }
}

