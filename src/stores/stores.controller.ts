import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './schema/store.schema';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(@Body() store: Partial<Store>) {
    return this.storesService.create(store);
  }

  @Get()
  async findAll() {
    return this.storesService.findAll();
  }

  @Get('cep/:postalCode')
  async findByCep(@Param('postalCode') postalCode: string) {
    return this.storesService.findByCep(postalCode);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.storesService.findById(id);
  }

  @Get('state/:state')
  async findByState(@Param('state') state: string) {
    return this.storesService.findByState(state);
  }
}
