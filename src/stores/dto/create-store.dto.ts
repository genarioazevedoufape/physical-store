import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn, Matches, IsEmail, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Nome da loja', example: 'Loja Exemplo' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiPropertyOptional({ description: 'Prazo de envio em dias', example: 3 })
  @IsNumber()
  @IsOptional()
  shippingTimeInDays?: number;

  @ApiProperty({ description: 'Endereço principal', example: 'Rua das Flores, 123' })
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiPropertyOptional({ description: 'Endereço secundário', example: 'Apto 101' })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiPropertyOptional({ description: 'Endereço terciário', example: 'Bloco B' })
  @IsString()
  @IsOptional()
  address3?: string;

  @ApiPropertyOptional({ description: 'Cidade', example: 'Correntes' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Bairro', example: 'Centro' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ description: 'Estado (sigla)', example: 'PE' })
  @IsString()
  @IsOptional()
  @IsIn(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'])
  state?: string;

  @ApiProperty({ description: 'Tipo da loja', example: 'LOJA', enum: ['PDV', 'LOJA'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PDV', 'LOJA'])
  type: string;

  @ApiProperty({ description: 'CEP no formato 00000-000', example: '55315-000' })
  @Matches(/^[0-9]{5}-[0-9]{3}$/)
  postalCode: string;

  @ApiPropertyOptional({ description: 'Número de telefone (10 ou 11 dígitos)', example: '11987654321' })
  @IsOptional()
  @Matches(/^[0-9]{10,11}$/)
  telephoneNumber?: string;

  @ApiPropertyOptional({ description: 'Endereço de email', example: 'exemplo@loja.com' })
  @IsOptional()
  @IsEmail()
  emailAddress?: string;
}
