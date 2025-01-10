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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';

@ApiTags('Stores') // Agrupa as rotas sob o grupo "Stores" no Swagger
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova loja' })
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  @ApiBody({ type: CreateStoreDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createStoreDto: CreateStoreDto) {
    try {
      return await this.storesService.create(createStoreDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as lojas' })
  @ApiResponse({ status: 200, description: 'Lista de lojas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao listar lojas.' })
  async listAll() {
    try {
      return await this.storesService.listAll(10, 0);
    } catch (error) {
      throw new HttpException('Erro ao listar lojas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'Buscar lojas por estado' })
  @ApiParam({ name: 'state', description: 'Estado onde as lojas estão localizadas' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de lojas a retornar', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'Número de lojas a pular para paginação', example: 0 })
  @ApiResponse({ status: 200, description: 'Lista de lojas por estado retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar lojas por estado.' })
  async storeByState(
    @Param('state') state: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ) {
    try {
      return await this.storesService.storeByState(state, limit, offset);
    } catch (error) {
      throw new HttpException(error.message || 'Erro ao buscar lojas por estado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cep/:postalCode')
  @ApiOperation({ summary: 'Buscar lojas por CEP' })
  @ApiParam({ name: 'postalCode', description: 'CEP do usuário para buscar lojas próximas' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de lojas a retornar', example: 10 })
  @ApiQuery({ name: 'offset', required: false, description: 'Número de lojas a pular para paginação', example: 0 })
  @ApiResponse({ status: 200, description: 'Lista de lojas por CEP retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar lojas por CEP.' })
  async storeByCep(
    @Param('postalCode') postalCode: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ) {
    try {
      return await this.storesService.storeByCep(postalCode, limit, offset);
    } catch (error) {
      throw new HttpException(error.message || 'Erro ao buscar lojas por CEP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar loja por ID' })
  @ApiParam({ name: 'id', description: 'ID da loja a ser buscada' })
  @ApiResponse({ status: 200, description: 'Detalhes da loja retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada.' })
  async storeById(@Param('id') id: string) {
    try {
      return await this.storesService.storeById(id);
    } catch (error) {
      throw new HttpException(error.message || 'Loja não encontrada', HttpStatus.NOT_FOUND);
    }
  }
}
