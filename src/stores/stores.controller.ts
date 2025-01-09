import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto'; 

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createStoreDto: CreateStoreDto) {
    try {
      return await this.storesService.create(createStoreDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async listAll() {
    try {
      return await this.storesService.listAll(10, 0);  // Ajuste no valor padrão de offset
    } catch (error) {
      throw new HttpException('Erro ao listar lojas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('state/:state')
  async storeByState(
    @Param('state') state: string,         
    @Query('limit') limit: number = 10,    
    @Query('offset') offset: number = 0  // Ajuste no valor padrão de offset
  ) {
    try {
      return await this.storesService.storeByState(state, limit, offset);
    } catch (error) {
      throw new HttpException(error.message || 'Erro ao buscar lojas por estado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cep/:postalCode')
  async storeByCep(
    @Param('postalCode') postalCode: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0  // Ajuste no valor padrão de offset
  ) {
    try {
      return await this.storesService.storeByCep(postalCode, limit, offset);
    } catch (error) {
      throw new HttpException(error.message || 'Erro ao buscar lojas por CEP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async storeById(@Param('id') id: string) {
    try {
      return await this.storesService.storeById(id);  
    } catch (error) {
      throw new HttpException(error.message || 'Loja não encontrada', HttpStatus.NOT_FOUND);
    }
  }
}
