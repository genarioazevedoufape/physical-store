import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsIn,
    Matches,
    IsEmail,
  } from 'class-validator';
  
  export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    storeName: string;
  
    @IsNumber()
    @IsNotEmpty()
    shippingTimeInDays: number;
  
    @IsNotEmpty()
    latitude: number;
  
    @IsNotEmpty()
    longitude: number;
  
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

    @Matches(/^[0-9]{5}-[0-9]{3}$/)
    postalCode: string;
  
    @Matches(/^[0-9]{10,11}$/)
    telephoneNumber: string;
  
    @IsEmail()
    emailAddress: string;
  }
  