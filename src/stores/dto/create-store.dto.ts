import { IsString, IsNotEmpty, IsNumber, IsIn, Matches, IsEmail, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsNumber()
  @IsOptional()
  shippingTimeInDays?: number;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsOptional()
  address3?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['PDV', 'LOJA']) 
  type: string;

  @Matches(/^[0-9]{5}-[0-9]{3}$/)
  postalCode: string;

  @IsOptional()
  @Matches(/^[0-9]{10,11}$/)
  telephoneNumber?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;
}
