import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsNumber,
    IsIn,
    Matches,
    IsEmail,
  } from 'class-validator';
  
  export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    storeName: string;
  
    @IsBoolean()
    takeOutInStore: boolean;
  
    @IsNumber()
    @IsNotEmpty()
    shippingTimeInDays: number;
  
    @IsString()
    @IsNotEmpty()
    latitude: string;
  
    @IsString()
    @IsNotEmpty()
    longitude: string;
  
    @IsString()
    @IsNotEmpty()
    address1: string;

    @IsString()
    @IsNotEmpty()
    address2: string;

    @IsString()
    @IsNotEmpty()
    address3: string;
  
    @IsString()
    city: string;
  
    @IsString()
    district: string;

    @IsString()
    state: string;
  
    @IsString()
    @IsNotEmpty()
    @IsIn(['PDV', 'LOJA']) 
    type: string;

    @IsString()
    country: string;
  
    @Matches(/^[0-9]{5}-[0-9]{3}$/)
    postalCode: string;
  
    @Matches(/^[0-9]{10,11}$/)
    telephoneNumber: string;
  
    @IsEmail()
    emailAddress: string;
  }
  